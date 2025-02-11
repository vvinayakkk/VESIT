import React from 'react';
import { Stack } from 'expo-router';
import { UserContextProvider } from '../context/UserContext';
import '../global.css';

export default function RootLayout() {
  return (
    <UserContextProvider>
      <Stack screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen 
          name="index"
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
        <Stack.Screen 
          name="household"
          
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
      </Stack>
    </UserContextProvider>
  );
}