import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../component/header";
import { View, Text, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";

const LeaderboardScreen = () => {
  const router = useRouter();
  const {login} = useContext(UserContext);
  // Sample user data with donations and badges
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      donations: 1200,
      badges: ["First Time Donor", "Bronze Supporter"],
      color: "#FFB6C1", // Light pink
      icon: "account-heart"
    },
    {
      id: 2,
      name: "Michael Chen",
      donations: 5000,
      badges: ["First Time Donor", "Bronze Supporter", "Silver Champion", "Gold Heart"],
      color: "#98FB98", // Light green
      icon: "account-star"
    },
    {
      id: 3,
      name: "Emma Wilson",
      donations: 750,
      badges: ["First Time Donor"],
      color: "#87CEEB", // Light blue
      icon: "account-circle"
    }
  ];

  // Function to determine badge color based on type
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "First Time Donor":
        return "bg-blue-100 text-blue-800";
      case "Bronze Supporter":
        return "bg-amber-100 text-amber-800";
      case "Silver Champion":
        return "bg-gray-100 text-gray-800";
      case "Gold Heart":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        
        router.push('/household/leaderboard')
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };
  

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="p-4">
        <Text className="text-xl font-bold mb-4">Leaderboard</Text>
        <ScrollView className="space-y-4">
          {users.map((user) => (
            <View key={user.id} className="bg-gray-100 p-4 mb-4 rounded-xl flex-row items-center space-x-4">
              <View 
                className="w-10 h-10 mr-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: user.color }}
              >
                <Icon 
                  name={user.icon}
                  size={24}
                  color="#333333"
                  //className="mr-3"
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-lg">{user.name}</Text>
                <Text className="text-gray-600">
                  Total Donations: ${user.donations}
                </Text>
                <View className="flex-row flex-wrap mt-2 gap-2">
                  {user.badges.map((badge, index) => (
                    <View
                      key={index}
                      className={`px-2 py-1 rounded-full ${getBadgeColor(badge)}`}
                    >
                      <Text className="text-sm">{badge}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default LeaderboardScreen;