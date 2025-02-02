import React, { useEffect, useState } from 'react'
import { tokenCache } from '@/store/persist-token-cache';
import JWT from 'expo-jwt';

import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import { useRouter } from 'expo-router';
import { IUser, User } from '@/lib/types';
import { getResourceByItsId } from '@/lib/api';
// import { TOKEN_KEY } from '@/constants/constants';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = '3c26dc0a9b416a6948d9fc42326ad7074b70e6d459b7adadbca754c6243d0199cb88768fca2f4f94b5e097a3266691d76feb5a9730b45c7a3cd90f14f7427b43'
const useUserGlobal = () => {

    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<JWTBody<JWTDefaultBody> | null>(null)
    const [currentUserObj, setCurrentUserObj] = useState<User | null>(null);

    const getToken = async () => {

        try {
            // const token = await tokenCache.getToken('currentUser');
            const token = await SecureStore.getItemAsync('currentUser');
            console.log('current token: ', token)
            if (token) {
                const decoded = JWT.decode(token, TOKEN_KEY as EncodingKey,);
                console.log("new user decoded: ", decoded);
                setCurrentUser(decoded);

                try {
                    // get the current user pofile
                    if (decoded?.userId) {
                        console.log("current user id: ", decoded?.userId);
                        const user = await getResourceByItsId(decoded?.userId, "users", "useUserGlobal");
                        setCurrentUserObj(user);
                    }
                } catch (error) {
                    console.error('(use-user hook file), Failed to get current user from api:', error);
                    setCurrentUserObj(null);
                }
            } else {
                console.warn("\n\n No token found")
                setCurrentUser(null);
                setCurrentUserObj(null);
            }

        } catch (error) {
            console.error('Failed to decode token in use-user hook file:', error);
            setCurrentUser(null);
            setCurrentUserObj(null);
            router.push("/login");
        }
    };

    // console.log('current user obj: ', currentUserObj)

    useEffect(() => {
        getToken();
    }, []);

    return {
        currentUser,
        setCurrentUser,
        currentUserObj
    };
}

export default useUserGlobal;
