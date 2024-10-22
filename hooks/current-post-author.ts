import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Post, User } from '@/lib/types'
import { tokenCache } from '@/store/persist-token-cache';
import JWT from 'expo-jwt';
import { Alert } from 'react-native';
import { TOKEN_KEY } from '@/constants/constants';
import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import { getSingleResource } from '@/lib/api';

const useAuthorAndPubGlobal = () => {

    const [postAuthor, setPostAuthor] = useState<User | null>(null);
    const [currentPub, setCurrentPub] = useState<Post>();

    const getCurrentPost = async () => {
        const post = JSON.parse(await tokenCache.getToken('post') as string);
        setCurrentPub(post);
    }

    // get the author of this publication fromthe API
    const getPostAuthor = async () => {
        if (!currentPub?.idUser) return console.error("No author id supplied for this post");
        const postAuth = await getSingleResource('User', currentPub?.idUser as number);
        if (typeof postAuth != 'undefined') {
            setPostAuthor(postAuth as User);
        }
    }

    useEffect(() => {
        getCurrentPost();
        getPostAuthor();
    }, []);

    return { postAuthor, currentPub };
}

export default useAuthorAndPubGlobal;
