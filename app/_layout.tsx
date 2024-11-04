import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, } from 'react';

import { Ionicons } from '@expo/vector-icons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  // // If the fonts fail to load, your splash screen might remain visible indefinitely. Verify the font file path:
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    if (error) throw error;
    if (loaded) {
      SplashScreen.hideAsync(); // to hide splash screen on android only.
    }

  }, [loaded, error])

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
