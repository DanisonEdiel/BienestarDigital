/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Palette = {
  primary: '#2D6CF6',
  primaryDark: '#1E4ED8',
  secondary: '#6C7593',
  backgroundLight: '#F7F9FC',
  backgroundDark: '#0F1115',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#1B1E24',
  textLight: '#11181C',
  textDark: '#ECEDEE',
  iconLight: '#687076',
  iconDark: '#9BA1A6',
  error: '#D32F2F',
  success: '#2E7D32',
};

export const Gradients = {
  headerLight: ['#E8F0FF', '#F7FAFF'],
  cardLight: ['#FFFFFF', '#EEF4FF'],
  headerDark: ['#1A2230', '#0F1115'],
  cardDark: ['#1B1E24', '#12161E'],
};

export const Colors = {
  light: {
    text: Palette.textLight,
    background: Palette.backgroundLight,
    tint: Palette.primary,
    icon: Palette.iconLight,
    tabIconDefault: Palette.iconLight,
    tabIconSelected: Palette.primary,
  },
  dark: {
    text: Palette.textDark,
    background: Palette.backgroundDark,
    tint: '#FFFFFF',
    icon: Palette.iconDark,
    tabIconDefault: Palette.iconDark,
    tabIconSelected: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Poppins_400Regular',
    serif: 'Poppins_400Regular',
    rounded: 'Poppins_400Regular',
    mono: 'Poppins_400Regular',
  },
  default: {
    sans: 'Poppins_400Regular',
    serif: 'Poppins_400Regular',
    rounded: 'Poppins_400Regular',
    mono: 'Poppins_400Regular',
  },
  web: {
    sans: "'Poppins', sans-serif",
    serif: "'Poppins', serif",
    rounded: "'Poppins', sans-serif",
    mono: "'Poppins', monospace",
  },
});
