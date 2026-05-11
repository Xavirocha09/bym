import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

const LEARN_NOTIFICATION_IDS_KEY = '@bym_learn_notification_ids';
const LEARN_NOTIFICATIONS_ENABLED_KEY = '@bym_learn_notifications_enabled';
const LEARN_NOTIFICATION_PROMPTED_KEY = '@bym_learn_notifications_prompted';
const LEARN_REMINDER_CHANNEL_ID = 'learn-reminders';
const LEARN_REMINDER_URL = '/(tabs)/(safety)';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function getHasPromptedForLearnReminders(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(LEARN_NOTIFICATION_PROMPTED_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function markLearnRemindersPrompted(): Promise<void> {
  try {
    await AsyncStorage.setItem(LEARN_NOTIFICATION_PROMPTED_KEY, 'true');
  } catch {}
}

export async function getLearnRemindersEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(LEARN_NOTIFICATIONS_ENABLED_KEY)) === 'true';
  } catch {
    return false;
  }
}

async function setupLearnReminderChannel(): Promise<void> {
  await Notifications.setNotificationChannelAsync(LEARN_REMINDER_CHANNEL_ID, {
    name: 'Learn reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function clearScheduledLearnReminders(): Promise<void> {
  try {
    const ids = JSON.parse((await AsyncStorage.getItem(LEARN_NOTIFICATION_IDS_KEY)) ?? '[]') as string[];
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  } catch {}

  try {
    await AsyncStorage.removeItem(LEARN_NOTIFICATION_IDS_KEY);
  } catch {}
}

export async function enableLearnReminders(): Promise<'granted' | 'denied'> {
  if (process.env.EXPO_OS === 'web') {
    return 'denied';
  }

  await setupLearnReminderChannel();

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== 'granted') {
    await AsyncStorage.setItem(LEARN_NOTIFICATIONS_ENABLED_KEY, 'false');
    return 'denied';
  }

  await clearScheduledLearnReminders();

  const reminderId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Keep your radar sharp',
      body: 'Open Learn for a quick BYM tip or lesson refresh.',
      data: { url: LEARN_REMINDER_URL },
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24 * 2,
      repeats: true,
      channelId: LEARN_REMINDER_CHANNEL_ID,
    },
  });

  await AsyncStorage.setItem(LEARN_NOTIFICATION_IDS_KEY, JSON.stringify([reminderId]));
  await AsyncStorage.setItem(LEARN_NOTIFICATIONS_ENABLED_KEY, 'true');

  return 'granted';
}

export function observeNotificationNavigation(): () => void {
  function redirectFromNotification(notification: Notifications.Notification) {
    const url = notification.request.content.data?.url;
    if (typeof url === 'string') {
      router.push(url as any);
    }
  }

  const response = Notifications.getLastNotificationResponse();
  if (response?.notification) {
    redirectFromNotification(response.notification);
  }

  const subscription = Notifications.addNotificationResponseReceivedListener((nextResponse) => {
    redirectFromNotification(nextResponse.notification);
  });

  return () => {
    subscription.remove();
  };
}
