from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from bson.objectid import ObjectId
from dotenv import load_dotenv
import speech_recognition as sr
import google.generativeai as genai
from PIL import Image
import io
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient(os.getenv('MONGODB_URI'))
db = client["food_waste_platform"]

# Configure Google Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')
vision_model = genai.GenerativeModel('gemini-pro-vision')

def parse_voice_input_with_gemini(text):
    """Parse voice input using Gemini to extract food item and expiry date"""
    prompt = f"""
    Extract food item and expiry date from this text: "{text}"
    Respond only with a JSON object in this exact format:
    {{
        "food_name": "item name",
        "expiry_date": "YYYY-MM-DD"
    }}
    
    Example input: "Milk expires on 10th Feb"
    Example output: {{"food_name": "Milk", "expiry_date": "2025-02-10"}}
    
    Rules:
    1. If a year isn't mentioned, use 2025
    2. If no expiry date is found, use null for expiry_date
    3. Clean and standardize food names
    4. Return ONLY the JSON object, no additional text
    """
    
    try:
        response = model.generate_content(prompt)
        # Get the text content and strip any markdown formatting
        response_text = response.text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]  # Remove ```json and ``` 
        elif response_text.startswith('{'):
            response_text = response_text  # Already clean JSON
        else:
            response_text = response_text.strip('`')  # Remove any single backticks
            
        parsed = json.loads(response_text)
        
        # Validate the response format
        if not isinstance(parsed, dict) or 'food_name' not in parsed:
            return None
            
        # Convert expiry_date string to datetime if it exists and isn't null
        if parsed.get('expiry_date'):
            try:
                parsed['expiry_date'] = datetime.strptime(parsed['expiry_date'], '%Y-%m-%d')
            except ValueError:
                parsed['expiry_date'] = None
        
        return parsed
    except Exception as e:
        print(f"Error parsing with Gemini: {str(e)}")
        print(f"Response text: {response.text if 'response' in locals() else 'No response'}")
        return None

@app.route('/api/voice-input', methods=['POST'])
def process_voice_input():
    try:
        audio_file = request.files.get('audio')
        if not audio_file:
            return jsonify({"error": "No audio file provided"}), 400
        
        # Convert audio to text using speech recognition
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            
        print(f"Recognized text: {text}")  # Debug print
        
        # Parse the text using Gemini
        parsed_data = parse_voice_input_with_gemini(text)
        if not parsed_data:
            return jsonify({"error": "Could not parse voice input"}), 400
        
        # Save to MongoDB
        user_id = request.form.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        # Convert string user_id to ObjectId
        try:
            user_object_id = ObjectId(user_id)
        except:
            return jsonify({"error": "Invalid user ID format"}), 400
            
        food_item = {
            "food_name": parsed_data["food_name"],
            "expiry_date": parsed_data["expiry_date"],
            "added_date": datetime.now(),
            "source": "voice_input"
        }
        
        # Add to user's food inventory using ObjectId
        result = db.users.update_one(
            {"_id": user_object_id},  # Use the converted ObjectId
            {"$push": {"food_inventory": food_item}}
        )
        
        # Check if user was found and updated
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "message": "Food item added successfully",
            "data": {
                "food_name": food_item["food_name"],
                "expiry_date": food_item["expiry_date"].isoformat() if food_item["expiry_date"] else None,
                "added_date": food_item["added_date"].isoformat()
            }
        })
        
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Speech recognition error: {str(e)}"}), 500
    except Exception as e:
        print(f"Error in process_voice_input: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500


@app.route('/api/ocr-detection', methods=['POST'])
def process_ocr():
    try:
        # Validate inputs
        image_file = request.files.get('image')
        if not image_file:
            return jsonify({"error": "No image file provided"}), 400
        
        user_id = request.form.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        # Convert string user_id to ObjectId
        try:
            user_object_id = ObjectId(user_id)
        except:
            return jsonify({"error": "Invalid user ID format"}), 400
        
        # Read and process image
        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Generate prompt for Gemini
        prompt = """
        Extract ALL food items and their details from this image.
        
        If it's a RECEIPT:
        - List each food item with quantity and price
        - Look for any expiry dates or best before dates
        - Ignore non-food items
        
        If it's a FOOD PACKAGE:
        - Extract product name
        - Find quantity/weight
        - Find expiry date or best before date
        - Look for storage instructions
        
        Return ONLY a valid JSON object in this exact format:
        {
            "items": [
                {
                    "food_name": "exact product name",
                    "quantity": "amount with unit (e.g., 500g, 1L, 2 pieces)",
                    "expiry_date": "YYYY-MM-DD",
                    "price": "price if available (e.g., 12.99)",
                    "storage": "storage instructions if available"
                }
            ],
            "receipt_total": "total amount if it's a receipt",
            "store_name": "store name if available",
            "receipt_date": "YYYY-MM-DD if available"
        }

        Notes:
        1. Use null for any fields not found
        2. Make sure all dates are in YYYY-MM-DD format
        3. Include ALL food items visible in the image
        4. Clean and standardize food names
        5. Return ONLY the JSON object, no additional text
        """
        
        try:
            # Get response from Gemini
            response = vision_model.generate_content([prompt, image])
            response_text = response.text.strip()
            
            # Clean up the response text
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('{'):
                response_text = response_text
            else:
                response_text = response_text.strip('`')
            
            # Parse the JSON response
            extracted_data = json.loads(response_text)
            print(f"Extracted data: {extracted_data}")  # Debug print
            
        except Exception as e:
            print(f"Gemini processing error: {str(e)}")
            return jsonify({"error": "Failed to process image"}), 500
        
        # Process and format items for database
        formatted_items = []
        for item in extracted_data.get("items", []):
            formatted_item = {
                "food_name": item.get("food_name"),
                "quantity": item.get("quantity"),
                "price": item.get("price"),
                "storage_instructions": item.get("storage"),
                "expiry_date": None,
                "added_date": datetime.now(),
                "source": "ocr_detection",
                "metadata": {
                    "store_name": extracted_data.get("store_name"),
                    "receipt_date": extracted_data.get("receipt_date"),
                    "receipt_total": extracted_data.get("receipt_total")
                }
            }
            
            # Convert expiry date string to datetime if it exists
            if item.get("expiry_date"):
                try:
                    formatted_item["expiry_date"] = datetime.strptime(
                        item["expiry_date"], 
                        '%Y-%m-%d'
                    )
                except ValueError:
                    formatted_item["expiry_date"] = None
            
            formatted_items.append(formatted_item)
        
        if not formatted_items:
            return jsonify({"error": "No food items found in image"}), 400
        
        # Update MongoDB
        result = db.users.update_one(
            {"_id": user_object_id},
            {"$push": {
                "food_inventory": {
                    "$each": formatted_items
                }
            }}
        )
        
        # Check if user was found and updated
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
            
        # Format response data
        response_data = {
            "items": [{
                "food_name": item["food_name"],
                "quantity": item["quantity"],
                "price": item["price"],
                "storage_instructions": item["storage_instructions"],
                "expiry_date": item["expiry_date"].isoformat() if item["expiry_date"] else None,
                "added_date": item["added_date"].isoformat(),
                "metadata": item["metadata"]
            } for item in formatted_items],
            "total_items_added": len(formatted_items)
        }
        
        return jsonify({
            "message": "Items extracted and saved successfully",
            "data": response_data
        })
        
    except Exception as e:
        print(f"Error in process_ocr: {str(e)}")
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)