import { useEffect } from 'react';
import { Platform, UIManager } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D1117' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="scan/type" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
          <Stack.Screen name="scan/upload" />
          <Stack.Screen name="scan/context" />
          <Stack.Screen name="scan/analyzing" options={{ gestureEnabled: false, animation: 'fade' }} />
          <Stack.Screen name="scan/results" options={{ animation: 'fade' }} />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
