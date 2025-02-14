import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import Header from "../component/header";
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.31.15:4000';

const ItemsListedScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useContext(UserContext);
  const router = useRouter();
  const {login} = useContext(UserContext);

  // Array of background and text color combinations
  const cardColors = [
    { bg: 'bg-blue-50', text: 'text-blue-900' },
    { bg: 'bg-purple-50', text: 'text-purple-900' },
    { bg: 'bg-pink-50', text: 'text-pink-900' },
    { bg: 'bg-green-50', text: 'text-orange-900' },
    { bg: 'bg-yellow-50', text: 'text-yellow-900' },
    { bg: 'bg-indigo-50', text: 'text-indigo-900' },
    { bg: 'bg-red-50', text: 'text-red-900' },
    { bg: 'bg-teal-50', text: 'text-teal-900' },


  ];

  // Default colors in case random selection fails
  const defaultColors = { bg: 'bg-gray-50', text: 'text-gray-900' };

  // Function to get random color combination with fallback
  const getRandomColors = () => {
    try {
      const randomIndex = Math.floor(Math.random() * cardColors.length);
      return cardColors[randomIndex] || defaultColors;
    } catch (error) {
      return defaultColors;
    }
  };

  const fetchUserListings = async () => {
    try {
      if (!user || !user.token) {
        console.log('No user or token found:', user);
        setError('User authentication required');
        setLoading(false);
        return;
      }

      console.log('Fetching with token:', user.token);
      
      setLoading(true);
      const response = await fetch(`${API_URL}/user/food-listings/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch listings');
      }
      
      if (data.success && Array.isArray(data.listings)) {
        // Ensure each item has a color assigned
        const itemsWithColors = data.listings.map(item => ({
          ...item,
          colors: getRandomColors(), // Assign a random color to each item
          _id: item._id || Math.random().toString() // Ensure each item has an ID
        }));
        setItems(itemsWithColors);
      } else {
        setError(data.message || 'Failed to fetch listings');
        setItems([]); // Reset items on error
      }
    } catch (err) {
      console.error('Full error details:', err);
      setError(err.message || 'Failed to fetch your listings');
      setItems([]); // Reset items on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserListings();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
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
        
        router.push('/household/items')
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };
    

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="px-4">
        <Text className="text-xl font-bold mt-4 mb-4">My Food Listings</Text>
      </View>
      
      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500">No food listings yet</Text>
          </View>
        ) : (
          items.map((item) => {
            // Ensure we have valid colors for each item
            const itemColors = item.colors || defaultColors;
            
            return (
              <TouchableOpacity 
                key={item._id} 
                className={`mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-200 ${itemColors.bg}`}
              >
                <View className="p-4">
                  <Text className={`text-lg font-semibold mb-2 ${itemColors.text}`}>
                    {item.food_name || 'Unnamed Item'}
                  </Text>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className={itemColors.text}>
                      Category: {item.category || 'Uncategorized'}
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${
                      item.status === 'available' ? 'bg-green-100' : 
                      item.status === 'claimed' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Text className={`${
                        item.status === 'available' ? 'text-green-800' : 
                        item.status === 'claimed' ? 'text-yellow-800' : 'text-red-800'
                      } capitalize`}>
                        {item.status || 'unknown'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className={itemColors.text}>
                      Quantity: {item.quantity || 0} {item.unit || 'units'}
                    </Text>
                    <Text className={itemColors.text}>
                      Expires: {formatDate(item.expiry_date)}
                    </Text>
                  </View>
                  <Text className={itemColors.text}>
                    Pickup: {item.pickup_location || 'Location not specified'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ItemsListedScreen;
