import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../component/header';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.31.15:4000';

const colors = ['bg-blue-100', 'bg-teal-100' , 'bg-yellow-100', 'bg-red-100', 'bg-purple-100', 'bg-pink-100'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const FoodListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user , login } = useContext(UserContext);
  const router = useRouter();


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${API_URL}/delivery/foodlistings`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const availableListings = Array.isArray(data) ? data : [];
        setListings(availableListings.map(item => ({ ...item, bgColor: getRandomColor() })));
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);
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
        
        router.push('/delivery/home')
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };
  

  const handleAccept = async (listingId) => {
    try {
      await fetch(`${API_URL}/api/foodlistings/${listingId}/accept`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
      });
      const updatedListings = listings.filter(listing => listing._id !== listingId);
      setListings(updatedListings);
    } catch (error) {
      console.error('Error accepting listing:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 justify-center items-center h-64">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : listings.length > 0 ? (
          <View className="flex-1 gap-4">
            {listings.map((listing) => (
              <View key={listing._id} className={`rounded-lg border border-gray-300 shadow-md mb-4 bg-green-50`}>
                <View className="p-4 border-b border-gray-200">
                  <Text className="text-xl font-semibold text-green-700">{listing.food_name}</Text>
                  <View className="mt-1 bg-green-200 px-2 py-1 rounded self-start">
                    <Text className="text-sm text-green-700">{listing.category}</Text>
                  </View>
                </View>

                <View className="p-4 space-y-3">
                  <View className="flex-row items-center gap-3">
                    <Icon name="package-variant" size={20} color="#059669" />
                    <Text className="text-gray-600">{listing.quantity} {listing.unit}</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Icon name="map-marker" size={20} color="#059669" />
                    <Text className="text-gray-600">{listing.pickup_location}</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Icon name="calendar" size={20} color="#059669" />
                    <Text className="text-gray-600">Expires: {new Date(listing.expiry_date).toLocaleDateString()}</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Icon name="account" size={20} color="#059669" />
                    <Text className="text-gray-600">Donor #{listing.donor_id.toString().slice(-4)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="flex-row items-center justify-center bg-green-600 mx-4 mb-4 p-3 rounded-lg gap-2"
                  onPress={() => handleAccept(listing._id)}
                >
                  <Icon name="check-circle" size={20} color="white" />
                  <Text className="text-white text-base font-medium">Accept for Delivery</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center h-64">
            <Text className="text-gray-500 text-lg">No food listings available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FoodListingsPage;
