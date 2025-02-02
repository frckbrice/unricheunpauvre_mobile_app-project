

// import React, { useEffect, useState } from 'react'
// import useUserGlobal from '@/hooks/use-user-hook';
// import { useRouter } from 'expo-router';
// import OnboardingScreen from './(auth)/onboarding';

// import * as SecureStore from 'expo-secure-store';
// import LoginScreen from './(auth)/login';
// import { ActivityIndicator, View } from 'react-native';


// const LoadingScreen = () => (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#2563EB" />
//     </View>
// );



// const IndexPage = () => {

//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//     const router = useRouter();

//     useEffect(() => {
//         // Check authentication status on component mount
//         const checkAuth = async () => {
//             try {
//                 const token = await SecureStore.getItemAsync('currentUser');

//                 if (token) {
//                     console.log('user token: ', token);
//                     router.replace('/(tabulate)/accueil');
//                 } else {
//                     console.error('Error getting user token from cache: ', error);
//                     setIsAuthenticated(false);
//                 }
//             } catch (error) {
//                 console.error('error getting user token: ', error);
//                 setIsAuthenticated(false);
//             }
//         };

//         checkAuth();
//     }, []);

//     // Show loading state while checking auth
//     if (isAuthenticated === null) {
//         return <LoadingScreen />; // return a loading spinner
//     }

//     // Show login screen if not authenticated
//     if (isAuthenticated === false) {
//         return <LoginScreen />;
//     }

//     // By default, show onboarding
//     return <OnboardingScreen />;
// };

// export default IndexPage;

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native';
import useUserGlobal from '@/hooks/use-user-hook';
import { useRouter } from 'expo-router';
import OnboardingScreen from './(auth)/onboarding';
import * as SecureStore from 'expo-secure-store';

const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
    </View>
);

const IndexPage = () => {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndOnboarding = async () => {
            try {
                // Check if user has seen onboarding
                const onboardingSeen = await SecureStore.getItemAsync('hasSeenOnboarding');
                // Check if user is authenticated
                const userToken = await SecureStore.getItemAsync('currentUser');
                // if (!userToken) {
                //     router.replace('/');
                // }
                if (userToken) {
                    // User is authenticated, go straight to accueil
                    router.replace('/(tabulate)/accueil');
                } else if (onboardingSeen) {
                    // User has seen onboarding but not logged in, go to login
                    router.replace('/(auth)/login');
                } else {
                    // First time user, show onboarding
                    setHasSeenOnboarding(false);
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
                setHasSeenOnboarding(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuthAndOnboarding();
    }, []);

    if (isChecking) {
        return <LoadingScreen />;
    }

    // Show onboarding only if user hasn't seen it
    if (!hasSeenOnboarding) {
        return (
            <OnboardingScreen
                onComplete={async () => {
                    // Mark onboarding as seen
                    await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
                    // Navigate to login
                    router.replace('/(auth)/login');
                }}
            />
        );
    }

    return null;
};

export default IndexPage;