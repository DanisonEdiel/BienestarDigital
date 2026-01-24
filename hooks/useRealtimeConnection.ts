import { useUserStore } from '@/store/userStore';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || process.env.VITE_API_URL || 'http://localhost:3000';
// Strip '/api' if present for socket connection usually, or keep if namespaced.
// User said: "URL base: http://<backend>:3000" and "io('http://<backend>:3000', ...)"
// My .env has "http://.../api". I should strip "/api".
const SOCKET_URL = BACKEND_URL.replace(/\/api$/, '');

export function useRealtimeConnection(onLockCommand: (locked: boolean) => void) {
  const { domainUserId } = useUserStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!domainUserId) return;

    // 1. Socket.io Connection
    socketRef.current = io(SOCKET_URL, {
      query: { userId: domainUserId },
      transports: ['websocket'], // force websocket
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });

    socketRef.current.on('cmd_lock_device', (payload: any) => {
        console.log('Socket cmd_lock_device:', payload);
        if (payload && typeof payload.locked === 'boolean') {
            onLockCommand(payload.locked);
        }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // 2. FCM Notification Listener (Foreground)
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      if (data && data.cmd === 'lock_device') {
          console.log('FCM cmd_lock_device:', data);
          // data.locked might be string "true"/"false" in FCM data payload
          const isLocked = data.locked === true || data.locked === 'true';
          onLockCommand(isLocked);
      }
    });

    // 3. FCM Notification Response Listener (Background/Interaction)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if (data && data.cmd === 'lock_device') {
             const isLocked = data.locked === true || data.locked === 'true';
             onLockCommand(isLocked);
        }
    });

    return () => {
      socketRef.current?.disconnect();
      subscription.remove();
      responseSubscription.remove();
    };
  }, [domainUserId, onLockCommand]);
}
