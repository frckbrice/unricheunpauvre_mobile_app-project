import React, { useEffect, useState } from 'react'
import { tokenCache } from '@/store/persist-token-cache';
import JWT from 'expo-jwt';

import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import { useRouter } from 'expo-router';
import { IUser, User } from '@/lib/types';
import { getResourceByItsId } from '@/lib/api';
import { TOKEN_KEY } from '@/constants/constants';


const useUserGlobal = () => {

    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<JWTBody<JWTDefaultBody> | null>(null)
    const [currentUserObj, setCurrentUserObj] = useState<User | null>(null);

    const getToken = async () => {

        try {
            const token = await tokenCache.getToken('currentUser');
            console.log('current token: ', token)
            if (token) {
                const decoded = JWT.decode(token, TOKEN_KEY as EncodingKey,);
                console.log("new user decoded: ", decoded);
                setCurrentUser(decoded);

                // get the current user pofile
                if (decoded?.userId)
                    setCurrentUserObj(await getResourceByItsId(decoded?.userId, "users", "useUserGlobal"));
            }

        } catch (error) {
            console.error('Failed to decode token:', error);
            setCurrentUser(null);
            setCurrentUserObj(null);
            router.push("/");
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
