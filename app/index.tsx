
// import React, { useEffect, useState } from 'react'
// import { ActivityIndicator, View } from 'react-native';
// import { useRouter } from 'expo-router';
// import OnboardingScreen from './(auth)/onboarding';
// import * as SecureStore from 'expo-secure-store';

// const LoadingScreen = () => (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#2563EB" />
//     </View>
// );

// const IndexPage = () => {
//     const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
//     const [isChecking, setIsChecking] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const checkAuthAndOnboarding = async () => {
//             try {
//                 // Check if user has seen onboarding
//                 const onboardingSeen = await SecureStore.getItemAsync('hasSeenOnboarding');
//                 // Check if user is authenticated
//                 const userToken = await SecureStore.getItemAsync('currentUser');

//                 if (userToken) {
//                     console.log("\n\n token exists!")
//                     // User is authenticated, go straight to accueil
//                     router.replace('/(tabulate)/accueil');
//                 } else if (onboardingSeen === 'true') {
//                     console.log("\n\n has onboard!")
//                     // User has seen onboarding but not logged in, go to login
//                     router.replace('/(auth)/login');
//                 } else {
//                     console.log("\n\n has not yet onboarded!")
//                     // First time user, show onboarding
//                     setHasSeenOnboarding(false);
//                 }
//             } catch (error) {
//                 console.error('Error checking auth state:', error);
//                 setHasSeenOnboarding(false);
//             } finally {
//                 setIsChecking(false);
//             }
//         };

//         checkAuthAndOnboarding();
//     }, []);

//     if (isChecking) {
//         return <LoadingScreen />;
//     }

//     // Show onboarding only if user hasn't seen it
//     if (!hasSeenOnboarding) {
//         return (
//             <OnboardingScreen
//                 onComplete={async () => {
//                     // Mark onboarding as seen
//                     await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
//                     // Navigate to login
//                     router.replace('/(auth)/login');
//                 }}
//             />
//         );
//     }

//     return null;
// };

// export default IndexPage;

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingScreen from './(auth)/onboarding';
import * as SecureStore from 'expo-secure-store';

const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
    </View>
);

const IndexPage = () => {
    const [appState, setAppState] = useState<'loading' | 'onboarding' | null>(
        'loading'
    );
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndOnboarding = async () => {
            try {
                // Check if user has seen onboarding
                const onboardingSeen = await SecureStore.getItemAsync('hasSeenOnboarding');
                // Check if user is authenticated
                const userToken = await SecureStore.getItemAsync('currentUser');

                // Wait to make sure all async operations are complete before deciding navigation
                if (userToken) {
                    // User is authenticated, go straight to accueil
                    console.log("User is authenticated, redirecting to home");
                    router.replace('/(tabulate)/accueil');
                } else if (onboardingSeen === 'true') {
                    // User has seen onboarding but not logged in, go to login
                    console.log("User has seen onboarding, redirecting to login");
                    router.replace('/(auth)/login');
                } else {
                    // First time user, show onboarding
                    console.log("First time user, showing onboarding");
                    setAppState('onboarding');
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
                // In case of error, default to onboarding
                setAppState('onboarding');
            }
        };

        checkAuthAndOnboarding();
    }, []);

    const handleOnboardingComplete = async () => {
        console.log("has just onboarded...");
        // Mark onboarding as seen
        await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        // Navigate to login
        router.replace('/(auth)/login');
    };

    // Show loading screen while checking the state
    if (appState === 'loading') {
        return <LoadingScreen />;
    }

    // Show onboarding if that's the determined state
    if (appState === 'onboarding') {
        return <OnboardingScreen />;
    }

    // This will be reached if router.replace was called but hasn't completed yet
    return <LoadingScreen />;
};

export default IndexPage;