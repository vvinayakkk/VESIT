import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../context/UserContext';

const Header = () => {
  const { user } = useContext(UserContext);
  
  // Memoize userInitials to prevent recalculation on every render
  const userInitials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }, [user?.name]);

  // Prevent rendering if no user data
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']}>
      <LinearGradient
        colors={['#e3a02c', '#ffe6af']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          padding: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center">
          {/* Left Section: User Info */}
          <View className="flex-1 py-6">
            <Text 
              className="text-4xl font-extrabold text-white drop-shadow-lg"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Hello, {user.name} 👋
            </Text>
            <Text 
              className="text-sm text-gray-100 opacity-80"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.email}
            </Text>
            <Text 
              className="text-sm text-gray-100 opacity-80"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.address}
            </Text>
          </View>

          {/* Right Section: User Avatar */}
          <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center border-2 border-white shadow-xl">
            <Text className="text-white font-bold text-lg tracking-wide">
              {userInitials}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Header;