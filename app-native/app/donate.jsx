import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Donate = () => {
  const API_URL = 'http://192.168.1.131:4000'; 
  const router = useRouter();
  const { user , login } = useContext(UserContext);
  const [mealType, setMealType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    expiry: '',
    unit: '',
    address: '',
    status: 'Available',  // Default status
  });

  const getToken = async () => {
    return await AsyncStorage.getItem('token'); 
  };

  const categories = [
    { id: 1, name: 'Raw Food', image: require('../assets/images/raw-food.jpg') },
    { id: 2, name: 'Cooked Food', image: require('../assets/images/cooked-food.jpg') },
    { id: 3, name: 'Packed Food', image: require('../assets/images/packed-food.jpg') }
  ];

  const statuses = ['Available', 'Pending', 'delivered'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.foodName || !mealType || !selectedCategory || !formData.quantity || !formData.expiry || !formData.unit || !formData.address || !formData.status) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/user/donate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          donor_id: user.id,
          food_name: formData.foodName,
          category: selectedCategory,
          quantity: Number(formData.quantity),
          unit: formData.unit,
          pickup_location: formData.address,
          expiry_date: new Date(formData.expiry).toISOString(),
          status: formData.status,
          meal_type: mealType,
        }),
      });

      if (response.ok) {
        alert('Donation successful');
        router.push('household/items');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong, please try again.');
    }
  };
  useEffect(() => {
    checkExistingSession();
  }, []);
  
  const checkExistingSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      //const userRole = await AsyncStorage.getItem('userRole');
      
      if (userData ) {
        const user = JSON.parse(userData);
        login(user);
        
        router.push('/donate')
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-amber-500">
      <ScrollView>
        <View className="py-10 px-6">
          <View className="px-6 py-4 bg-white rounded-3xl">
            <Text className="text-4xl font-bold text-center mb-6">
              Food <Text className="text-green-400">Donate</Text>
            </Text>

            {/* Food Name Input */}
            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Food Name:</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg p-3"
                value={formData.foodName}
                onChangeText={(text) => handleInputChange('foodName', text)}
                placeholder="Enter food name"
              />
            </View>

            {/* Meal Type Selection */}
            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Meal type:</Text>
              <View className="flex-row gap-4">
                <TouchableOpacity 
                  className={`flex-row items-center ${mealType === 'veg' ? 'opacity-100' : 'opacity-50'}`}
                  onPress={() => setMealType('veg')}
                >
                  <View className={`w-5 h-5 rounded-full border-2 border-green-500 mr-2 ${mealType === 'veg' ? 'bg-green-500' : 'bg-white'}`} />
                  <Text>Veg</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className={`flex-row items-center ${mealType === 'non-veg' ? 'opacity-100' : 'opacity-50'}`}
                  onPress={() => setMealType('non-veg')}
                >
                  <View className={`w-5 h-5 rounded-full border-2 border-green-500 mr-2 ${mealType === 'non-veg' ? 'bg-green-500' : 'bg-white'}`} />
                  <Text>Non-veg</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Selection */}
            <View className="mb-4">
              <Text className="text-gray-600 my-2">Select the Category:</Text>
              <View className="gap-3">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`border-2 rounded-xl overflow-hidden ${selectedCategory === category.name ? 'border-green-500' : 'border-gray-200'}`}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <Image source={category.image} className="w-full h-32" style={{ resizeMode: 'cover' }} />
                    <View className="absolute inset-0 bg-black/30 justify-center items-center">
                      <Text className="text-white text-lg font-semibold">{category.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Additional Inputs */}
            <View className="space-y-6">
              <View>
                <Text className="text-gray-600 my-2">Quantity:</Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={formData.quantity}
                  onChangeText={(text) => handleInputChange('quantity', text)}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                />
              </View>

              <View>
                <Text className="text-gray-600 my-2">Expiry Date:</Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={formData.expiry}
                  onChangeText={(text) => handleInputChange('expiry', text)}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View>
                <Text className="text-gray-600 my-2">Unit:</Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={formData.unit}
                  onChangeText={(text) => handleInputChange('unit', text)}
                  placeholder="Enter unit (e.g., kg, pieces)"
                />
              </View>

              <View>
                <Text className="text-gray-600 my-2">Full Address:</Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  multiline
                  numberOfLines={3}
                  placeholder="Enter your full address"
                />
              </View>

              {/* Status Selection */}
              <View>
                <Text className="text-gray-600 my-2">Status:</Text>
                {statuses.map((status) => (
                  <TouchableOpacity key={status} onPress={() => handleInputChange('status', status)}>
                    <Text className={`p-2 rounded-lg ${formData.status === status ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity className="bg-black py-4 rounded-lg mt-4" onPress={handleSubmit}>
                <Text className="text-white text-center font-semibold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Donate;
