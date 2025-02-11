import Header from "../component/header";
import { View , Text } from "react-native";


const ItemsListedScreen = () => (
    <View className="flex-1 bg-white p-4">
      <Header />
      <Text className="text-xl font-bold mt-4">Items Listed</Text>
    </View>
  );
export default ItemsListedScreen  