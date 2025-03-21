import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <TouchableOpacity onPress={() => router.push('/accueil')} style={styles.link} className="bg-blue-600 rounded-lg p-3 mb-4 w-full text-white flex items-center">

          <Text className=' text-white text-center text-xl'>Go to home screen!</Text>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
