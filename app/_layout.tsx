import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '../context/AppContext';
import { Colors } from '../constants/colors';

// Must be called at module scope (before any component mounts)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash once the root layout has mounted
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="phrases" />
        <Stack.Screen name="shadow" />
        <Stack.Screen name="plan" />
        <Stack.Screen name="device-check" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="practice/[scenarioId]" />
        <Stack.Screen name="result/[sessionId]" />
      </Stack>
    </AppProvider>
  );
}
