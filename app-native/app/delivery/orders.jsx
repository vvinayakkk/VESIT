import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {react, useContext, useEffect} from 'react';
import { View , Text } from 'react-native';
import { UserContext } from '../../context/UserContext';

function myorders(){
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
            
            router.push('/delivery/home')
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
    };
      
    return(
        <View>
            <Text>My Orders</Text>
        </View>
    );
}

export default myorders;