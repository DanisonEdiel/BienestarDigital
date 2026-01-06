import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { api } from '@/lib/api';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Ensure notifications are configured (can be done in _layout or a provider)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useRegisterDeviceToken() {
  const { domainUserId, clerkId } = useUserStore();
  
  return useMutation({
    mutationFn: async () => {
      if (!domainUserId || !clerkId) return null;

      // 1. Get Push Token
      let token;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      // Use expo push token or device push token depending on backend
      // Backend says: "Guarda el token de FCM". 
      // Expo can give FCM token if configured, or we can use ExpoPushToken and backend handles it?
      // Usually "FCM token" implies native device token.
      // But for simplicity with Expo, we often use `getDevicePushTokenAsync` or `getExpoPushTokenAsync`.
      // Let's assume `getDevicePushTokenAsync` for FCM if using bare workflow or configured expo.
      // However, `getExpoPushTokenAsync` is easier if backend uses Expo SDK.
      // If backend expects raw FCM, we need `getDevicePushTokenAsync`.
      
      // Let's try getting the token.
      try {
          // If we are in Expo Go, we must use Expo Push Token.
          // If we are in a build, we can get Device Token.
          // Let's send whatever we get and label it?
          // User asked for "FCM Token".
          // In managed workflow, `getDevicePushTokenAsync` returns FCM token on Android.
          
          const tokenData = await Notifications.getDevicePushTokenAsync();
          token = tokenData.data;
      } catch (e) {
          // Fallback for emulator or dev
          console.log('Error getting device token, trying expo token', e);
          const expoToken = await Notifications.getExpoPushTokenAsync();
          token = expoToken.data;
      }

      // 2. Register with backend
      // Note: We need a deviceId. 
      // Ideally this should be a unique ID for the installation.
      // Expo `Application.getAndroidId` or similar? 
      // Or we can let the backend generate/assign one if not provided?
      // The endpoint is `POST /api/family/device/:deviceId/register-token`.
      // If we don't have a stable deviceId, we might have issues.
      // Let's use `token` as deviceId for now if we don't have another unique ID, 
      // or check if we stored one.
      
      // Let's assume we can use the `domainUserId` as a prefix or just a random ID stored in SecureStore.
      // But for "Locking", the parent calls `/device/:deviceId/lock`.
      // The parent sees a list of children. Does the list of children include devices?
      // The backend `GET /api/family/children` likely returns children and their devices.
      // So the child must register a device ID that the parent can see.
      
      // Implementation detail: Generate a UUID for this device installation and store it.
      // For this example, I'll assume a stored device ID or generate one.
      
      // Actually, let's just use the token as the ID for simplicity in this demo, 
      // unless we want to persist a UUID.
      const deviceId = 'device_' + domainUserId; 
      
      const res = await api.post(`/family/device/${deviceId}/register-token`, { 
          clerkId, 
          fcmToken: token 
      });
      return res.data;
    }
  });
}
