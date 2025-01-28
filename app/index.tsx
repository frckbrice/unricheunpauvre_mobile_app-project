
import React, { useEffect, useState } from 'react'
import LoginScreen from './(auth)/login';
import useUserGlobal from '@/hooks/use-user-hook';
import { useRouter } from 'expo-router';
import OnboardingScreen from './(auth)/onboarding';

import { ActivityIndicator, View } from 'react-native';
import Register from './(auth)/register';

const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
    </View>
);

const IndexPage = () => {

    const { currentUser } = useUserGlobal();
    const router = useRouter();

    if (currentUser?.nomUser) {
        // Use replace instead of a timeout for immediate navigation
        setTimeout(() => {
            router.replace('/(tabulate)/accueil');
        }, 2000)
    }
    // Show onboarding for non-authenticated users
    return <OnboardingScreen />;

};

export default IndexPage;
