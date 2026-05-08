import { Stack } from 'expo-router/stack';
import { PlatformColor } from 'react-native';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerLargeTitle: true,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerBlurEffect: 'systemUltraThinMaterialDark',
        headerTitleStyle: { color: PlatformColor('label') as any },
        headerLargeTitleStyle: { color: PlatformColor('label') as any },
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: '#0D1117' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'BeforeYouMeet' }} />
    </Stack>
  );
}
