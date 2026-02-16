import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { BookingProvider } from '../context/BookingContext';
import 'react-native-reanimated';
import CustomSplashScreen from '../components/SplashScreen';
import { StatusBar } from 'expo-status-bar';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const NatureTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F6F0D7',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  if (showSplash) {
    return <CustomSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider value={NatureTheme}>
      <BookingProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="date/[date]" options={{ headerShown: false }} />
          <Stack.Screen name="booking/new" options={{ headerShown: false }} />
          <Stack.Screen name="booking/[id]" options={{ headerShown: false }} />
        </Stack>
      </BookingProvider>
    </ThemeProvider>
  );
}
