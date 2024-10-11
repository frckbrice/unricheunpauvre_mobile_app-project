import React from 'react';

import { Stack } from 'expo-router';



export default function App() {
    return (
        <Stack screenOptions={{ headerShown: false }} initialRouteName="parameters" >
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen name="ProfileEdit" options={{ headerShown: false }} />
            <Stack.Screen name="Search" options={{ headerShown: false }} />
            <Stack.Screen name="AccountIdentification" options={{ headerShown: false }} />
        </Stack>
    );
}