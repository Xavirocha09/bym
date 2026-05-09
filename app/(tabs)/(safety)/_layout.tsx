import { Stack } from 'expo-router/stack';
import { Colors } from '@/constants/colors';

export default function SafetyLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerLargeTitle: true,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerBlurEffect: 'systemUltraThinMaterialDark',
        headerTitleStyle: { color: Colors.text.primary },
        headerLargeTitleStyle: { color: Colors.text.primary },
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        contentStyle: { backgroundColor: Colors.bg.primary },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Learn' }} />
      <Stack.Screen name="[id]" options={{ headerLargeTitle: false }} />
    </Stack>
  );
}
