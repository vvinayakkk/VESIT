import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            home: focused ? 'home' : 'home-outline',
            orders: focused ? 'badge-account' : 'badge-account-outline'  // Changed from format-list-bulleted-outline
          };
          return <Icon name={icons[route.name] || 'circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fb923c',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingVertical: 5,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }
      })}
    >
      <Tabs.Screen 
        name="home"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen 
        name="orders"
        options={{ title: 'Orders' }}
      />

    </Tabs>
  );
}