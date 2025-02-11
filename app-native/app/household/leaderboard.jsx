import Header from "../component/header";
import { View , Text } from "react-native";

const LeaderboardScreen = () => (
    <View className="flex-1 bg-white p-4">
      <Header />
      <Text className="text-xl font-bold mt-4">Leaderboard</Text>
    </View>
  );

export default LeaderboardScreen;