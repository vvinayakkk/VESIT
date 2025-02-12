import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.1.131:4000'; // Ensure this is consistent with your backend

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    email: '',
    password: '',
    vehicle_type: '',
    isOrganization: false
  });

  const router = useRouter();
  const roles = ['Household', 'Delivery Agent', 'Recipient'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = async () => {
    if (!selectedRole) {
      alert('Please select a role before signing up.');
      return;
    }
    console.log(formData)

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        alert('Account created successfully! Please log in.');
        router.push('/login');
      } else {
        console.error('Signup failed:', data.message);
        alert(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred. Please check your network connection.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-6 py-6 mt-4">
        <TouchableOpacity onPress={() => router.back()} className="absolute top-0.1 left-0.1 z-10">
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-amber-700 mb-6 text-center">
          Sign Up
        </Text>

        {/* Role Selection */}
        <View className="mb-2">
          <Text className="text-lg px-2 font-semibold text-gray-900 mb-3">
            Select Role
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {roles.map((role) => (
              <TouchableOpacity
                key={role}
                className={`w-[48%] py-3 px-5 rounded-full border items-center mb-3 ${
                  selectedRole === role
                    ? 'bg-amber-500 border-amber-600'
                    : 'bg-white border-gray-300'
                }`}
                onPress={() => setSelectedRole(role)}
              >
                <Text
                  className={`text-base font-medium ${
                    selectedRole === role ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vehicle Type Selection (Only for Delivery Agents) */}
        {selectedRole === 'Delivery Agent' && (
          <View className="mb-3">
            <Text className="text-gray-600 text-base mb-2">Select your vehicle type (required):</Text>
            <View className="flex-row justify-between">
              {['Bike', 'Scooty', 'Bicycle'].map((vehicle) => (
                <TouchableOpacity 
                  key={vehicle}
                  className={`flex-row items-center space-x-2 ${
                    formData.vehicle_type === vehicle ? 'opacity-100' : 'opacity-50'
                  }`}
                  onPress={() => handleInputChange('vehicle_type', vehicle)}
                >
                  <View className={`w-5 h-5 rounded-full border-2 border-blue-500 ${
                    formData.vehicle_type === vehicle ? 'bg-blue-500' : 'bg-white'
                  }`} />
                  <Text className="text-gray-700 p-1">{vehicle}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedRole === 'Delivery Agent' && !formData.vehicle_type && (
              <Text className="text-red-500 text-sm mt-1">Please select a vehicle type</Text>
            )}
          </View>
        )}

        {/* Organization Selection (Only for Household Role) */}
        {selectedRole === 'Household' && (
          <View className="mb-3 flex-row items-center">
            <Text className="text-gray-600 text-base mr-4">Are you an Organization?</Text>
            <View className="flex-row">
              <TouchableOpacity 
                className={`flex-row items-center mr-4 ${formData.isOrganization ? 'opacity-100' : 'opacity-50'}`}
                onPress={() => handleInputChange('isOrganization', true)}
              >
                <View className={`w-5 h-5 rounded-full border-2 border-amber-500 mr-2 ${
                  formData.isOrganization ? 'bg-amber-500' : 'bg-white'
                }`} />
                <Text>Yes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className={`flex-row items-center ${!formData.isOrganization ? 'opacity-100' : 'opacity-50'}`}
                onPress={() => handleInputChange('isOrganization', false)}
              >
                <View className={`w-5 h-5 rounded-full border-2 border-amber-500 mr-2 ${
                  !formData.isOrganization ? 'bg-amber-500' : 'bg-white'
                }`} />
                <Text>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Form Inputs */}
        <View className="space-y-5">
          {[
            { field: 'name', placeholder: 'Name' },
            { field: 'phone_number', placeholder: 'Phone Number', keyboardType: 'phone-pad' },
            { field: 'address', placeholder: 'Address', multiline: true },
            { field: 'email', placeholder: 'Email', keyboardType: 'email-address' },
            { field: 'password', placeholder: 'Password', secureTextEntry: true }
          ].map(({ field, ...props }) => (
            <View key={field} className="bg-white rounded-xl shadow-sm p-4 my-1 border border-gray-300">
              <TextInput
                className="text-base text-gray-900"
                placeholder={props.placeholder}
                {...props}
                value={formData[field]}
                onChangeText={(text) => handleInputChange(field, text)}
              />
            </View>
          ))}
        </View>

        {/* Sign-Up Button */}
        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-lg items-center mt-5 shadow-md"
          onPress={handleSignup}
        >
          <Text className="text-white text-lg font-semibold">Sign Up</Text>
        </TouchableOpacity>
        <View className="mt-2 items-center">
          <Text className="text-gray-600 text-base mb-2">Or Connect with</Text>
          <View className="flex-row gap-5">
            {[
              { icon: 'twitter', bg: '#1DA1F2' },
              { icon: 'google', bg: '#DB4437' },
              { icon: 'facebook', bg: '#4267B2' }
            ].map(({ icon, bg }) => (
              <TouchableOpacity
                key={icon}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Icon name={icon} size={24} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
