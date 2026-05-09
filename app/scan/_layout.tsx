import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function ScanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg.primary } }}>
      <Stack.Screen name="type" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="context" />
      <Stack.Screen name="analyzing" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="results" options={{ animation: 'fade' }} />
    </Stack>
  );
}
