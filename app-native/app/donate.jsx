import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const donate = () => {
  const [mealType, setMealType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    email: '',
    phoneNo: '',
    district: '',
    address: '',
  });

  const categories = [
    {
      id: 1,
      name: 'Raw Food',
      image: require('../assets/images/raw-food.jpg')
    },
    {
      id: 2,
      name: 'Cooked Food',
      image: require('../assets/images/cooked-food.jpg')
    },
    {
      id: 3,
      name: 'Packed Food',
      image: require('../assets/images/packed-food.jpg')
    }
  ];

  const handleSubmit = () => {
    console.log('Form submitted:', { ...formData, mealType, selectedCategory });
  };

  return (
    <ScrollView className="flex-1 bg-amber-500">
        <View className="py-10 px-6">
        <View className="px-6 py-4 bg-white rounded-3xl">
            <Text className="text-4xl font-bold text-center mb-6">Food <Text className="text-green-400 font-bold"> Donate </Text></Text>

            {/* Food Name Input */}
            <View className="mb-4">
            <Text className="text-gray-600 mb-2">Food Name:</Text>
            <TextInput
                className="w-full border border-gray-300 rounded-lg p-3"
                value={formData.foodName}
                onChangeText={(text) => setFormData({...formData, foodName: text})}
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
                <View className={`w-5 h-5 rounded-full border-2 border-green-500 mr-2 ${
                    mealType === 'veg' ? 'bg-green-500' : 'bg-white'
                }`} />
                <Text>Veg</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                className={`flex-row items-center ${mealType === 'non-veg' ? 'opacity-100' : 'opacity-50'}`}
                onPress={() => setMealType('non-veg')}
                >
                <View className={`w-5 h-5 rounded-full border-2 border-green-500 mr-2 ${
                    mealType === 'non-veg' ? 'bg-green-500' : 'bg-white'
                }`} />
                <Text>Non-veg</Text>
                </TouchableOpacity>
            </View>
            </View>

            {/* Category Selection */}
            <View className="mb-4">
            <Text className="text-gray-600 mb-2">Select the Category:</Text>
            <View className="gap-3">
                {categories.map((category) => (
                <TouchableOpacity
                    key={category.id}
                    className={`border-2 rounded-xl overflow-hidden ${
                    selectedCategory === category.name ? 'border-green-500' : 'border-gray-200'
                    }`}
                    onPress={() => setSelectedCategory(category.name)}
                >
                    <Image
                    source={category.image}
                    className="w-full h-32"
                    style={{ resizeMode: 'cover' }}
                    />
                    <View className="absolute inset-0 bg-black/30 justify-center items-center">
                    <Text className="text-white text-lg font-semibold">{category.name}</Text>
                    </View>
                </ TouchableOpacity>
                ))}
            </View>
            </View>

            {selectedCategory && (
            <View className="space-y-6">
                <View>
                <Text className="text-gray-600 my-2">Quantity (person):</Text>
                <TextInput
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={formData.quantity}
                    onChangeText={(text) => setFormData({...formData, quantity: text})}
                    keyboardType="numeric"
                />
                </View>

                <View>
                </View>

                <View>
                <Text className="text-gray-600 my-2">Alternative Phone No:</Text>
                <TextInput
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={formData.phoneNo}
                    onChangeText={(text) => setFormData({...formData, phoneNo: text})}
                    keyboardType="phone-pad"
                />
                </View>

                <View>
                <Text className="text-gray-600 my-2">District:</Text>
                <TextInput
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={formData.district}
                    onChangeText={(text) => setFormData({...formData, district: text})}
                />
                </View>

                <View>
                <Text className="text-gray-600 my-2">Full Address:</Text>
                <TextInput
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={formData.address}
                    onChangeText={(text) => setFormData({...formData, address: text})}
                    multiline
                    numberOfLines={3}
                />
                </View>

                <TouchableOpacity
                className="bg-black py-4 rounded-lg mt-4"
                onPress={handleSubmit}
                >
                <Text className="text-white text-center font-semibold">Submit</Text>
                </TouchableOpacity>
            </View>
            )}
            </View>
        </View>
    </ScrollView>
  );
};

export default donate;