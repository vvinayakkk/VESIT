import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../component/header';
import { UserContext } from '../../context/UserContext';

const API_URL = 'http://192.168.31.15:4000';
const { width } = Dimensions.get('window');

const ListingCard = ({ listing }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const truncatedDonorId = listing.donor_id.toString().slice(-4);

  const ListingDetail = ({ icon, text }) => (
    <View className="flex-row items-center gap-3">
      <Icon name={icon} size={20} color="#059669" />
      <Text className="text-gray-600">{text}</Text>
    </View>
  );

  return (
    <View className="rounded-lg border border-gray-300 shadow-md mb-4 bg-green-50">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-semibold text-green-700">{listing.food_name}</Text>
        <View className="mt-1 bg-green-200 px-2 py-1 rounded self-start">
          <Text className="text-sm text-green-700">{listing.category}</Text>
        </View>
      </View>

      <View className="p-4 space-y-3">
        <ListingDetail 
          icon="package-variant" 
          text={`${listing.quantity} ${listing.unit}`} 
        />
        <ListingDetail 
          icon="map-marker" 
          text={listing.pickup_location} 
        />
        <ListingDetail 
          icon="calendar" 
          text={`Expires: ${formatDate(listing.expiry_date)}`} 
        />
        <ListingDetail 
          icon="account" 
          text={`Donor #${truncatedDonorId}`} 
        />
      </View>

        <TouchableOpacity
            className="flex-row items-center justify-center bg-green-600 mx-4 mb-4 p-3 rounded-lg gap-2"
            onPress={() => router.push({
                pathname: '/info',
                params: listing
            })}
            >
            <Icon name="check-circle" size={20} color="white" />
            <Text className="text-white text-base font-medium">Get Food</Text>
        </TouchableOpacity>
    </View>
  );
};

const FeaturedSection = ({ onRequest }) => (
    <View className="p-4 mb-4 relative">
      <View className="rounded-2xl overflow-hidden shadow-lg">
        <Image
          source={require('../../assets/images/req-food.jpg')}
          style={{
            width: width - 32,
            height: width * 0.75,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
        <View 
          className="absolute inset-0 flex justify-center items-center px-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <TouchableOpacity 
            onPress={onRequest}
            className="bg-orange-500 px-8 py-4 rounded-full shadow-2xl"
            style={{
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >
            <Text className="text-white text-lg font-semibold tracking-wide">
              Request Food Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
);
  
const FoodListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, login } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          login(user);
          router.push('/recipient/home');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkExistingSession();
  }, []);

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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

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
      setListings(prevListings => 
        prevListings.filter(listing => listing._id !== listingId)
      );
    } catch (error) {
      console.error('Error accepting listing:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <ScrollView className="flex-1">
        <FeaturedSection onRequest={() => router.push('/req')} />
        
        <View className="px-4">
          {loading ? (
            <View className="flex-1 justify-center items-center h-64">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          ) : listings.length > 0 ? (
            <View className="flex-1 gap-4">
              {listings.map((listing) => (
                <ListingCard 
                  key={listing._id} 
                  listing={listing} 
                />
              ))}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center h-64">
              <Text className="text-gray-500 text-lg">
                No food listings available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FoodListingsPage;