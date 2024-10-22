import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
// import 'react-native-reanimated';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import { tokenCache } from "@/store/persist-token-cache";
import SplashScreenComponent from '@/components/splash-screen';
import useUserGlobal from '@/hooks/use-user-hook';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUserGlobal()
  const router = useRouter();

  useEffect(() => {

    if (loaded) {
      SplashScreen.hideAsync();
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (typeof currentUser != "undefined") {
        setTimeout(() => {
          console.log("is signed in");
          router.push('/accueil');
        }, 1000)
      }
    }, 3000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [loaded]);

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabulate)" options={{ headerShown: false }} />

      <Stack.Screen name="+not-found" />
      <Stack.Screen name="contribute/[idPub]" />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayoutInit() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <RootLayout />
      </ClerkLoaded>
    </ClerkProvider>
  )
}