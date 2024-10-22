import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { tokenCache } from '@/store/persist-token-cache';
import JWT from 'expo-jwt';
import { Alert } from 'react-native';
import { TOKEN_KEY } from '@/constants/constants';
import { EncodingKey } from 'expo-jwt/dist/types/jwt';

const useUserGlobal = () => {

    const [currentUser, setCurrentUser] = useState<any | null>(null)

    const getToken = async () => {
        try {
            const token = await tokenCache.getToken('currentUser');

            if (token) {
                const decoded = JWT.decode(token, TOKEN_KEY as EncodingKey);
                console.log("new user decoded: ", decoded)
                setCurrentUser(decoded)
            }
            else setCurrentUser(null)
        } catch (error) {
            console.error('Failed to decode token:', error);
            Alert.alert("Error Can't decode token", JSON.stringify(error, null, 2));
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    return { currentUser, setCurrentUser };
}

export default useUserGlobal;
