import React, { useEffect, useState } from 'react'
import { tokenCache } from '@/store/persist-token-cache';
import JWT from 'expo-jwt';

import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import { useRouter } from 'expo-router';

const TOKEN_KEY = '8b41c9eb4a6b43f9aeb6ddf7497bd237rhys';

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
            router.push('/');
        }
    };

    useEffect(() => {
        getToken();
    }, [])

    return { currentUser, setCurrentUser };
}

export default useUserGlobal;
