import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../(auth)/login';
import ProfileEditScreen from './edit-profile';
import SearchScreen from '../(tabs)/recherche';
import AccountIdentificationScreen from './AccountIdentification';
import { Tabs, useRouter, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';



export default function App() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen name="ProfileEdit" options={{ headerShown: false }} />
            <Stack.Screen name="Search" options={{ headerShown: false }} />
            <Stack.Screen name="AccountIdentification" options={{ headerShown: false }} />
        </Stack>
    );
}