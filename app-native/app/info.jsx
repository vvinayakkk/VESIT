import React, { useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  FadeInDown,
  SlideInUp
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './component/header';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const springConfig = {
  damping: 12,
  mass: 1,
  stiffness: 100
};
const API_URL = 'http://192.168.31.15:4000'; 
const InfoDetail = ({ icon, label, value, index }) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 100, 
      withSpring(0, springConfig)
    );
    opacity.value = withDelay(
      index * 100, 
      withSpring(1, springConfig)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle]} className="flex-row items-center space-x-3 mb-4 bg-white p-3 rounded-xl shadow-sm">
      <MaterialCommunityIcons name={icon} size={24} color="#047857" />
      <View>
        <Text className="text-emerald-600 font-medium text-sm">{label}</Text>
        <Text className="text-gray-800 font-bold">{value}</Text>
      </View>
    </Animated.View>
  );
};

const Info = () => {
  const listing = useLocalSearchParams();
  const router = useRouter();
  const {user} = useContext(UserContext)
  const scrollY = useSharedValue(0);
  const scale = useSharedValue(1);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.1, 1],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
      opacity: headerOpacity.value
    };
  });

  const handleScroll = ({ nativeEvent }) => {
    scrollY.value = withTiming(nativeEvent.contentOffset.y, { duration: 100 });
  };


  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handleClaimPress = async() => {
    scale.value = withSequence(
      withSpring(0.95, springConfig),
      withSpring(1.02, springConfig),
      withSpring(1, springConfig)
    );
    //console.log("hii")
    const response = await fetch(`${API_URL}/recipient/claim/${listing._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Add claim logic here
    router.push("/recipient");
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      
      <ScrollView 
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={true}
      >
        <Animated.View 
          style={[headerStyle]} 
          className="w-full"
        >
          {listing?.image && (
            <View className="h-80  overflow-hidden">
              <Image
                source={{ uri: listing.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <AnimatedBlurView
                intensity={60}
                tint="dark"
                className="absolute bottom-0 w-full h-24"
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  className="h-full w-full"
                />
              </AnimatedBlurView>
            </View>
          )}
        </Animated.View>

        <Animated.View 
          entering={SlideInUp.delay(200).springify()}
          className="px-5 mt-20 relative z-10"
        >
          <View className="bg-white rounded-2xl p-8 shadow-lg">
            <Animated.Text 
              entering={FadeInDown.delay(400).springify()}
              className="text-3xl font-bold text-gray-900 mb-8"
            >
              {listing?.food_name || 'Delicious Food'}
            </Animated.Text>
            
            <View className="space-y-3">
              <InfoDetail 
                icon="food" 
                label="Quantity" 
                value={`${listing?.quantity} ${listing?.unit}`}
                index={0}
              />
              <InfoDetail 
                icon="map-marker" 
                label="Pickup Location" 
                value={listing?.pickup_location}
                index={1}
              />
              <InfoDetail 
                icon="clock-outline" 
                label="Expires" 
                value={new Date(listing?.expiry_date).toLocaleDateString()}
                index={2}
              />
              <InfoDetail 
                icon="food-fork-drink" 
                label="Category" 
                value={listing?.category}
                index={3}
              />
            </View>
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={SlideInUp.delay(600).springify()}
          className="p-5 mb-4"
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={handleClaimPress}
            className="mt-5"
          >
            <Animated.View 
              style={[buttonStyle]}
              className="bg-emerald-600 p-4 rounded-xl shadow-md"
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons name="hand-heart" size={24} color="white" />
                <Text className="text-white text-lg font-bold">
                  Claim This Food
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Info;