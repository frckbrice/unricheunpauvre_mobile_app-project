import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import SplashScreenComponent from '@/components/splash-screen';
import useUserGlobal from '@/hooks/use-user-hook';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  // // If the fonts fail to load, your splash screen might remain visible indefinitely. Verify the font file path:
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (error) throw error;
    if (loaded) {
      // SplashScreen.hideAsync(); // to hide splash screen on android only.
      setIsLoading(false);
    }
  }, [loaded, error])

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabulate)" options={{ headerShown: false }} />

      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="contribute/[idPub]"
        options={{
          headerTitle: 'Contribute',

          headerLeft: () => {
            return (
              <Ionicons name='arrow-back' size={24} color={'#fff'} />
            );
          }
        }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
