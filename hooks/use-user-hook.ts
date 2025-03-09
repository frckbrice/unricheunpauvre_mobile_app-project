// import React, { useEffect, useState } from 'react'
// import JWT from 'expo-jwt';

// import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
// import { useRouter } from 'expo-router';
// import { User } from '@/lib/types';
// import { getResourceByItsId } from '@/lib/api';
// import { TOKEN_KEY } from '@/constants/constants';
// import * as SecureStore from 'expo-secure-store';
// import { Alert } from 'react-native';

// const useUserGlobal = () => {

//     const router = useRouter();
//     const [currentUser, setCurrentUser] = useState<JWTBody<JWTDefaultBody> | null>(null)
//     const [currentUserObj, setCurrentUserObj] = useState<User | null>(null);

//     const getToken = async () => {

//         try {
//             // const token = await tokenCache.getToken('currentUser');
//             const token = await SecureStore.getItemAsync('currentUser');
//             console.log('current token: ', token)
//             if (token) {
//                 const decoded = JWT.decode(token, TOKEN_KEY as EncodingKey,);
//                 console.log("new user decoded: ", decoded);
//                 setCurrentUser(decoded);

//                 // handle the expired token to send the user to re-login again.
//                 const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
//                 if (decoded != null && (decoded as { exp: number }).exp < currentTime) {
//                     Alert.alert('Re-connectez vous', 'Votre session a expiré')
//                     await SecureStore.deleteItemAsync('currentUser'); // Clear expired token
//                     router.replace('/login'); // Redirect to login
//                 }
//                 try {

//                     // get the current user pofile
//                     if (decoded?.userId) {
//                         console.log("current user id: ", decoded?.userId);
//                         const user = await getResourceByItsId(decoded?.userId, "users", "useUserGlobal");
//                         setCurrentUserObj(user);
//                     }
//                 } catch (error) {
//                     console.error('(use-user hook file), Failed to get current user from api:', error);
//                     setCurrentUserObj(null);
//                 }
//             } else {
//                 console.warn("\n\n No token found")
//                 setCurrentUser(null);
//                 setCurrentUserObj(null);
//             }

//         } catch (error) {
//             console.error('Failed to decode token in use-user hook file:', error);
//             setCurrentUser(null);
//             setCurrentUserObj(null);
//             router.push("/login");
//         }
//     };

//     // console.log('current user obj: ', currentUserObj)

//     useEffect(() => {
//         getToken();
//     }, []);

//     return {
//         currentUser,
//         setCurrentUser,
//         currentUserObj
//     };
// }

// export default useUserGlobal;

import React from 'react';
import JWT from 'expo-jwt';
import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import { useRouter } from 'expo-router';
import { User } from '@/lib/types';
import { getResourceByItsId } from '@/lib/api';
import { TOKEN_KEY } from '@/constants/constants';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query-client';

console.log("\n\n token secret: ", TOKEN_KEY);
const useUserGlobal = () => {
    const router = useRouter();


    // Fetch and decode the token
    const { data: currentUser } = useQuery({
        queryKey: ['currentUserToken'],
        queryFn: async () => {
            const token = await SecureStore.getItemAsync('currentUser');
            if (!token) {
                throw new Error('No token found');
            }
            const decoded = JWT.decode(token, TOKEN_KEY as EncodingKey);
            return decoded;
        },
        staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    });

    // Fetch the current user profile
    const { data: currentUserObj } = useQuery({
        queryKey: ['currentUserProfile', currentUser?.userId],
        queryFn: async () => {
            if (!currentUser?.userId) {
                throw new Error('No user ID found');
            }
            const user = await getResourceByItsId(currentUser.userId, 'users', 'useUserGlobal');
            return user;
        },
        enabled: !!currentUser?.userId, // Only fetch if userId exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry(failureCount, error) {
            return !!error && failureCount < 3;
        },
    });

    const verifyOnboarding = async () => {
        const onboardingSeen = await SecureStore.getItemAsync('hasSeenOnboarding');
        if (onboardingSeen === 'true') {
            // User has seen onboarding but not logged in, go to login
            queryClient.invalidateQueries({ queryKey: ['currentUserToken'] }); // Invalidate token query
            console.log("\n\n Invalidating token query");
            router.replace('/login')
        } else {
            // First time user, show onboarding
            console.log("First time user, showing onboarding");
            router.replace('/')
        }
    };

    // Check token expiration
    React.useEffect(() => {
        if (currentUser) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if ((currentUser as { exp: number }).exp < currentTime) {
                Alert.alert('Re-connectez vous', 'Votre session a expiré');
                SecureStore.deleteItemAsync('currentUser'); // Clear expired token
                queryClient.invalidateQueries({ queryKey: ['currentUserToken'] }); // Invalidate token query
                router.replace('/login'); // Redirect to login
            }
        } else {
            setTimeout(() => {
                verifyOnboarding().catch(console.error);
            }, 2000);
        };
    }, [currentUser, queryClient, router]);

    return {
        currentUser,
        currentUserObj,
    };
};

export default useUserGlobal;
