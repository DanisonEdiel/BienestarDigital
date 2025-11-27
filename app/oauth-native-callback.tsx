import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

export default function OAuthNativeCallback() {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);
  return null;
}