import React from 'react';
import { Stack } from 'expo-router';
import '../global.css'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          // This ensures no animation when app first loads
          animation: 'none',
        }}
      />
    </Stack>
  );
}