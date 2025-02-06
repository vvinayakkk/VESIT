import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  withSpring,
  useAnimatedStyle,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import '../global.css'
import { useRouter } from 'expo-router';

const Home = () => {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    // Initial animation for first ring
    ring1padding.value = withSequence(
      withSpring(25, { damping: 6 }),
      withDelay(200, withSpring(15, { damping: 6 }))
    );

    // Initial animation for second ring
    ring2padding.value = withSequence(
      withSpring(35, { damping: 6 }),
      withDelay(200, withSpring(25, { damping: 6 }))
    );
  }, []); // Empty dependency array ensures it only runs once on mount

  // Create animated styles
  const animatedStyleRing1 = useAnimatedStyle(() => ({
    padding: ring1padding.value,
  }));

  const animatedStyleRing2 = useAnimatedStyle(() => ({
    padding: ring2padding.value,
  }));

  return (
    <View className="flex-1 bg-amber-500">
      <StatusBar style="light" />
      
      {/* Main content container */}
      <View className="flex-1 justify-center items-center space-y-10">
        {/* Logo circles */}
        <Animated.View className="bg-white/20 rounded-full" style={animatedStyleRing1}>
          <Animated.View className="bg-white/20 rounded-full" style={animatedStyleRing2}>
            <Image 
              source={require('../assets/images/logo.jpg')} 
              className="w-60 h-60 rounded-full"
            />
          </Animated.View>
        </Animated.View>

        {/* Title and subtitle */}
        <View className="flex items-center mt-8 space-y-2">
          <Text className="font-bold text-white tracking-widest text-6xl">
            Foody
          </Text>
          <Text className="font-medium text-white tracking-widest text-sm">
            Food is always right
          </Text>
        </View>

        {/* Buttons container */}
        <View className="w-full px-6 mt-24 space-y-4">
          <TouchableOpacity onPress={() => router.push('/login')} className="bg-white/20 p-4 mb-5 rounded-full">
            <Text className="text-white text-center font-bold text-lg">
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/signup')} className="bg-white p-4 rounded-full">
            <Text className="text-amber-500 text-center font-bold text-lg">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;