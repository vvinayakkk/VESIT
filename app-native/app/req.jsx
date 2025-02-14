import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Request = () => {
  const API_URL = 'http://192.168.31.15:4000'; 
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    foodCategory: '',
    quantityNeeded: '',
    urgencyLevel: '',
    status: 'Pending',
  });

  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.foodCategory || !formData.quantityNeeded || !formData.urgencyLevel) {
      alert('Please fill in all fields');
      return;
    }

    try {
      //const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/recipient/req`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          recipient_id: user.id,
          food_category: formData.foodCategory,
          quantity_needed: Number(formData.quantityNeeded),
          urgency_level: formData.urgencyLevel,
          status: formData.status,
        }),
      });
      const responseText = await response.text();
        

        let data;
        try {
            data = JSON.parse(responseText);
            if(data){
                router.push('/recipient');
            }
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            alert('Server returned invalid response format');
            return;
        }


      if (response.ok) {
        alert('Request submitted successfully');
        //router.push('household/requests');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong, please try again.');
    }
  };

  const categories = [
    { id: 1, name: 'Raw Food', image: require('../assets/images/raw-food.jpg') },
    { id: 2, name: 'Cooked Food', image: require('../assets/images/cooked-food.jpg') },
    { id: 3, name: 'Packed Food', image: require('../assets/images/packed-food.jpg') }
  ];

  return (
    <SafeAreaView className="flex-1 bg-amber-500">
      <ScrollView>
        <View className="py-10 px-6">
          <View className="px-6 py-4 bg-white rounded-3xl">
            <Text className="text-4xl font-bold text-center mb-6">
              Food <Text className="text-green-400">Request</Text>
            </Text>

            {/* Category Selection */}
            <View className="mb-4">
              <Text className="text-gray-600 my-2">Select the Category:</Text>
              <View className="gap-3">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`border-2 rounded-xl overflow-hidden ${
                      formData.foodCategory === category.name ? 'border-green-500' : 'border-gray-200'
                    }`}
                    onPress={() => handleInputChange('foodCategory', category.name)}
                  >
                    <Image source={category.image} className="w-full h-32" style={{ resizeMode: 'cover' }} />
                    <View className="absolute inset-0 bg-black/30 flex justify-center items-center">
                      <Text className="text-white text-lg font-semibold">{category.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantity Needed */}
            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Quantity Needed:</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg p-3"
                value={formData.quantityNeeded}
                onChangeText={(text) => handleInputChange('quantityNeeded', text)}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
            </View>

            {/* Urgency Level Selection */}
            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Urgency Level:</Text>
              {urgencyLevels.map((level) => (
                <TouchableOpacity key={level} onPress={() => handleInputChange('urgencyLevel', level)}>
                  <Text className={`p-2 my-2 rounded-lg ${
                    formData.urgencyLevel === level ? 'bg-green-500 text-white text-center' : 'bg-gray-200 text-center'
                  }`}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity className="bg-black py-4 rounded-lg mt-4" onPress={handleSubmit}>
              <Text className="text-white text-center font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Request;
