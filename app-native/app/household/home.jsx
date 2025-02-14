import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import Header from '../component/header';
import { useRouter, Tabs, router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedQuote from '../component/typerwritter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../context/UserContext';

const nearbyOrgs = [
  {
    id: '1',
    name: 'Food Bank Community',
    description: 'Local food distribution center',
    distance: '2.3 km',
    logo: require('../../assets/images/d1.jpg')
  },
  {
    id: '2',
    name: 'Hunger Relief Foundation',
    description: 'Fighting food insecurity',
    distance: '5.1 km',
    logo: require('../../assets/images/d2.jpg')
  },
  {
    id: '3',
    name: 'Community Pantry Network',
    description: 'Connecting donors with those in need',
    distance: '4.7 km',
    logo: require('../../assets/images/d3.jpg')
  }
];

// Home Screen Component
const Home = () => {
  const { width } = Dimensions.get('window');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const router = useRouter();
  const {login} = useContext(UserContext);
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
        
        router.push('/household/home')
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };
  

  const renderOrgItem = ({ item }) => (
    <TouchableOpacity 
      className={`flex-row items-center p-4 mb-3 rounded-xl ${selectedOrg?.id === item.id ? 'bg-orange-100' : 'bg-gray-100'}`}
      onPress={() => setSelectedOrg(item)}
    >
      <Image 
        source={item.logo} 
        className="w-16 h-16 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="text-gray-600">{item.description}</Text>
        <Text className="text-gray-500 text-sm">{item.distance}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
      <View className="flex-1 bg-white">
      <Header />
      <ScrollView />
      <View className="relative p-4">
        <View className="overflow-hidden rounded-2xl shadow-lg">
          <Image 
            source={require('../../assets/images/donate.webp')} 
            className="w-full h-96 object-cover"
            style={{ 
              width: width - 32,
              height: width * 0.7,
            }}
            resizeMode="cover"
          />
          <View 
            className="absolute inset-0 justify-center items-center" 
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            <View className="px-6">
            <AnimatedQuote 
              text='"Every Donation Brings Hope"'
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
              }}
            />
              <Text className="text-white text-center opacity-80">
                Your small act of kindness can make a big difference in someone's life
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/donate')}
          className="absolute bottom-6 left-1/2 bg-orange-500 px-8 py-4 rounded-full shadow-2xl"
          style={{
            transform: [{ translateX: -(width - 64) / 2 }],
            elevation: 10,
          }}
        >
          <Text className="text-white text-lg font-bold">Donate Now</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Nearby Organizations</Text>
        <FlatList
          data={nearbyOrgs}
          renderItem={renderOrgItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ScrollView />
    </View>
  );
};

// Other Screen Components
export default Home