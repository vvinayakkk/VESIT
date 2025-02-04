from pymongo import MongoClient
from bson.objectid import ObjectId
import random
from datetime import datetime, timedelta

# MongoDB Connection
client = MongoClient("mongodb+srv://harshitbhanushali22:DmqjI9LFL3VHH5EC@cluster0.ywfh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["food_waste_platform"]

# Clear existing data
db.users.delete_many({})
db.donors.delete_many({})
db.recipients.delete_many({})
db.delivery_agents.delete_many({})
db.food_listings.delete_many({})
db.food_requests.delete_many({})
db.transactions.delete_many({})
db.deliveries.delete_many({})

# Helper function to generate random dates
def random_date(days=30):
    return datetime.now() + timedelta(days=random.randint(1, days))

# Sample data
food_categories = ["Vegetables", "Fruits", "Dairy", "Bakery", "Grains"]
units = ["kg", "liters", "pieces"]

# Insert Users (Households)
users = []
for i in range(5):
    user = {
        "name": f"User_{i}",
        "email": f"user{i}@email.com",
        "phone_number": f"98765432{i}0",
        "address": f"Household Address {i}",
        "role": "Household",
        "food_inventory": [],
        "donation_history": [],
        "created_at": datetime.now()
    }
    users.append(user)

user_ids = db.users.insert_many(users).inserted_ids

# Insert Donors
donors = []
food_listings = []
for i in range(3):
    donor = {
        "business_name": f"Donor_{i}",
        "email": f"donor{i}@business.com",
        "phone_number": f"99887766{i}0",
        "address": f"Donor Address {i}",
        "role": "Donor",
        "food_listings": [],
        "verification_status": "Verified",
        "created_at": datetime.now()
    }
    donors.append(donor)

donor_ids = db.donors.insert_many(donors).inserted_ids

# Insert Food Listings & Link to Donors
for i in range(7):
    donor_id = random.choice(donor_ids)
    food = {
        "donor_id": donor_id,
        "food_name": f"Food_{i}",
        "category": random.choice(food_categories),
        "quantity": random.randint(1, 20),
        "unit": random.choice(units),
        "pickup_location": f"Pickup Location {i}",
        "expiry_date": random_date(10),
        "status": "Available",
        "created_at": datetime.now()
    }
    food_listings.append(food)

food_listing_ids = db.food_listings.insert_many(food_listings).inserted_ids

# Update donors to reference their food listings
for donor_id in donor_ids:
    donor_foods = [str(fid) for fid in food_listing_ids if random.choice([True, False])]
    db.donors.update_one({"_id": donor_id}, {"$set": {"food_listings": donor_foods}})

# Insert Recipients (NGOs)
recipients = []
food_requests = []
for i in range(3):
    recipient = {
        "organization_name": f"NGO_{i}",
        "email": f"ngo{i}@charity.com",
        "phone_number": f"88997766{i}0",
        "address": f"NGO Address {i}",
        "role": "Recipient",
        "food_requests": [],
        "verification_status": "Verified",
        "created_at": datetime.now()
    }
    recipients.append(recipient)

recipient_ids = db.recipients.insert_many(recipients).inserted_ids

# Insert Food Requests & Link to Recipients
for i in range(5):
    recipient_id = random.choice(recipient_ids)
    request = {
        "recipient_id": recipient_id,
        "food_category": random.choice(food_categories),
        "quantity_needed": random.randint(1, 15),
        "urgency_level": random.choice(["Low", "Medium", "High"]),
        "status": "Pending",
        "created_at": datetime.now()
    }
    food_requests.append(request)

food_request_ids = db.food_requests.insert_many(food_requests).inserted_ids

# Update recipients to reference their food requests
for recipient_id in recipient_ids:
    recipient_requests = [str(fid) for fid in food_request_ids if random.choice([True, False])]
    db.recipients.update_one({"_id": recipient_id}, {"$set": {"food_requests": recipient_requests}})

# Insert Delivery Agents
delivery_agents = []
for i in range(3):
    agent = {
        "name": f"Agent_{i}",
        "email": f"agent{i}@courier.com",
        "phone_number": f"77778888{i}0",
        "address": f"Agent Address {i}",
        "role": "Delivery Agent",
        "vehicle_type": random.choice(["Bike", "Van", "Truck"]),
        "availability_status": "Available",
        "assigned_pickups": [],
        "completed_deliveries": [],
        "ratings": round(random.uniform(3.5, 5.0), 1),
        "created_at": datetime.now()
    }
    delivery_agents.append(agent)

agent_ids = db.delivery_agents.insert_many(delivery_agents).inserted_ids

# Insert Transactions & Deliveries
# Insert Transactions & Deliveries
transactions = []
deliveries = []
for i in range(4):
    donor_id = random.choice(donor_ids)
    recipient_id = random.choice(recipient_ids)
    agent_id = random.choice(agent_ids)
    food_items = [random.choice(food_listing_ids)]
    
    transaction = {
        "donor_id": donor_id,
        "recipient_id": recipient_id,
        "food_items": [str(fid) for fid in food_items],
        "pickup_time": random_date(5),
        "delivery_status": "In Progress",
        "agent_id": agent_id,
        "created_at": datetime.now()
    }
    transactions.append(transaction)

# Insert transactions and get their IDs
transaction_insert_result = db.transactions.insert_many(transactions)
transaction_ids = transaction_insert_result.inserted_ids

# Insert Deliveries and link them to transactions
for i in range(4):
    donor_id = random.choice(donor_ids)
    recipient_id = random.choice(recipient_ids)
    agent_id = random.choice(agent_ids)
    food_items = [random.choice(food_listing_ids)]
    
    delivery = {
        "assignment_id": f"DEL-{i}",
        "agent_id": agent_id,
        "donation_id": str(transaction_ids[i]),  # Use the inserted transaction ID
        "pickup_location": f"Donor Address {i}",
        "delivery_location": f"NGO Address {i}",
        "status": "On the Way",
        "created_at": datetime.now()
    }
    deliveries.append(delivery)

db.deliveries.insert_many(deliveries)

# Update delivery agents with assigned pickups
for agent_id in agent_ids:
    agent_pickups = [str(tid) for tid in transaction_ids if random.choice([True, False])]
    db.delivery_agents.update_one({"_id": agent_id}, {"$set": {"assigned_pickups": agent_pickups}})

print("✅ Database populated with interlinked data successfully!")
