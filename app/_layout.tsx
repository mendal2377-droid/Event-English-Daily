import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '../context/AppContext';
import { Colors } from '../constants/colors';

// Must be called at module scope (before any component mounts)
SplashScreen.preventAutoHideAsync();

// Max width of the app column on the web. On phones the app is full width;
// on a laptop it renders as a centered phone-width column so nothing stretches.
const WEB_MAX_WIDTH = 480;

// Responsive shell: only wraps on web. Centers the app in a dark frame.
function WebShell({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={styles.webBackdrop}>
      <View style={styles.webColumn}>{children}</View>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProvider>
      <StatusBar style="light" />
      <WebShell>
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
          <Stack.Screen name="glossary" />
          <Stack.Screen name="upgrade" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="practice/[scenarioId]" />
          <Stack.Screen name="result/[sessionId]" />
        </Stack>
      </WebShell>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  webBackdrop: {
    flex: 1,
    backgroundColor: '#04050a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webColumn: {
    flex: 1,
    width: '100%',
    maxWidth: WEB_MAX_WIDTH,
    backgroundColor: Colors.bg,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});
