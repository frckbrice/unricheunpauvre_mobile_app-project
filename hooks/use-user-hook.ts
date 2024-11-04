import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { tokenCache } from '@/store/persist-token-cache';
import JWT from 'expo-jwt';
import { Alert } from 'react-native';
import { TOKEN_KEY } from '@/constants/constants';
import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import { useRouter } from 'expo-router';

const useUserGlobal = () => {

    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<JWTBody<JWTDefaultBody> | null>(null)

    const getToken = async () => {
        try {
            const token = await tokenCache.getToken('currentUser');
            console.log('current token: ', token)
            if (token) {
                const decoded = JWT.decode(token, TOKEN_KEY as EncodingKey);
                console.log("new user decoded: ", decoded)
                setCurrentUser(decoded)
            }
            else router.push('/');
        } catch (error) {
            console.error('Failed to decode token:', error);
            setTimeout(() => {
                router.push('/');
            }, 1000)
        }
    }

    useEffect(() => {
        getToken();
        // if (!currentUser)
        //     setTimeout(() => {
        //         router.push('/');
        //     }, 1000)
    }, [])

    return { currentUser, setCurrentUser };
}

export default useUserGlobal;
