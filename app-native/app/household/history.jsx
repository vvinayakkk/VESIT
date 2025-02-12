import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from "../component/header";
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.1.131:4000';

const StatusButton = ({ label, count, isActive, onPress, color }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`px-6 py-3 rounded-full mx-2 ${isActive ? `border-b-4 border-${color}-500 bg-${color}-100` : 'bg-gray-200'}`}
  >
    <View className="flex-row items-center">
      <Text className={`${isActive ? `text-${color}-500` : 'text-gray-600'} font-medium`}>
        {label}
      </Text>
      <View className="ml-2 bg-gray-100 px-3 py-1 rounded-full">
        <Text className="text-gray-600 text-sm font-semibold">{count}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};
const cardColors = [
  { bg: 'bg-blue-50', text: 'text-blue-900' },
  { bg: 'bg-purple-50', text: 'text-purple-900' },
  { bg: 'bg-pink-50', text: 'text-pink-900' },
  { bg: 'bg-yellow-50', text: 'text-yellow-900' },
  { bg: 'bg-indigo-50', text: 'text-indigo-900' },
  { bg: 'bg-red-50', text: 'text-red-900' },
  { bg: 'bg-teal-50', text: 'text-teal-900' },
];




const DonationCard = ({ title, status, date, hasFeedback = false }) => {
  const statusDetails = {
    available: { icon: 'food', color: 'green-500' },
    pending: { icon: 'clock-outline', color: 'amber-500' },
    delivered: { icon: 'check-circle-outline', color: 'blue-500' }
  };

  // Generate a random color for each card
  const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

  return (
    <View className={`p-4 rounded-lg mb-4 shadow-lg border-l-8 ${randomColor.bg} border-${statusDetails[status]?.color}`}>
      <View className="flex-row items-center">
        <View className="bg-white rounded-full p-2 shadow">
          <Icon 
            name={statusDetails[status]?.icon || 'food'}
            size={24}
            color={statusDetails[status]?.color || '#757575'}
          />
        </View>
        <View className="flex-1 ml-3">
          <Text className={`${randomColor.text} font-semibold text-lg`}>{title}</Text>
          <Text className="text-gray-600 text-sm">{date}</Text>
          <View className="flex-row items-center mt-1">
            <Icon name="clock-outline" size={16} color="#666" style={{ marginRight: 4 }} />
            <Text className="text-gray-600 text-sm capitalize">{status}</Text>
          </View>
        </View>
      </View>
      {hasFeedback && (
        <TouchableOpacity 
          className="bg-blue-100 px-4 py-2 rounded-lg mt-3 flex-row items-center"
        >
          <Icon name="message-outline" size={16} color="#2196F3" style={{ marginRight: 4 }} />
          <Text className="text-blue-500 font-medium">View Feedback</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const HistoryScreen = () => {
  const [activeStatus, setActiveStatus] = useState('available');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { user , login } = useContext(UserContext);
  const router = useRouter();

  const fetchUserListings = async () => {
    try {
      if (!user || !user.token) {
        console.log('No user or token found:', user);
        setError('User authentication required');
        setLoading(false);
        return;
      }

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

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch listings');
      }

      if (data.success && Array.isArray(data.listings)) {
        setItems(data.listings);
      } else {
        setError(data.message || 'Failed to fetch listings');
        setItems([]);
      }
    } catch (err) {
      console.error('Full error details:', err);
      setError(err.message || 'Failed to fetch your listings');
      setItems([]);
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
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusCounts = () => {
    const counts = { available: 0, pending: 0, delivered: 0 };
    items.forEach(item => {
      counts[item.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const statusSections = [
    { id: 'available', label: 'Available', count: statusCounts.available, color: 'green' },
    { id: 'pending', label: 'Pending', count: statusCounts.pending, color: 'amber' },
    { id: 'delivered', label: 'Delivered', count: statusCounts.delivered, color: 'blue' },
  ];

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
        
        router.push('/household/history')
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };
  
  const filteredItems = items.filter(item => item.status?.toLowerCase() === activeStatus.toLowerCase());

  return (
    <View className="flex-1 bg-white">
      <Header />

      <View className="px-4">
        <Text className="text-2xl font-bold mt-4 mb-4 text-gray-800">Donation History</Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {statusSections.map((section) => (
            <StatusButton
              key={section.id}
              label={section.label}
              count={section.count}
              isActive={activeStatus === section.id}
              onPress={() => setActiveStatus(section.id)}
              color={section.color}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredItems.map((item) => (
          <DonationCard
            key={item._id}
            title={item.food_name}
            status={item.status}
            date={formatDate(item.expiry_date)}
            hasFeedback={item.status === 'delivered'}
          />
        ))}
        {filteredItems.length === 0 && (
          <View className="flex-1 items-center justify-center mt-8">
            <Icon name="inbox" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">
              No {activeStatus} donations found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
