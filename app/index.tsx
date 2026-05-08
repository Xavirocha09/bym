import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { isOnboardingComplete } from '@/utils/historyStorage';
import { Colors } from '@/constants/colors';

export default function Index() {
  useEffect(() => {
    (async () => {
      const done = await isOnboardingComplete();
      router.replace(done ? ('/(tabs)/(home)' as any) : '/onboarding');
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.teal.primary} size="large" />
    </View>
  );
}
