import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Post, User } from '@/lib/types'
import { tokenCache } from '@/store/persist-token-cache';
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET, TOKEN_KEY } from '@/constants/constants';
import { getResourceByItsId, getSingleResource } from '@/lib/api';

const useAuthorAndPubGlobal = () => {

    console.log("PAYPAL_SECRET post author: ", PAYPAL_SECRET);
    console.log("PAYPAL_CLIENT_ID from post author file: ", PAYPAL_CLIENT_ID);

    const [postAuthor, setPostAuthor] = useState<User | null>(null);
    const [currentPub, setCurrentPub] = useState<Post>();
    const [user, setUser] = useState(false)

    const getCurrentPost = async () => {
        const post = JSON.parse(await tokenCache.getToken('post') as string);
        setCurrentPub(post);
    }

    // get the author of this publication fromthe API
    const getPostAuthor = useCallback(async () => {
        const post = JSON.parse(await tokenCache.getToken('post') as string);
        const postAuthor = await getResourceByItsId(post?.idUser as number, "User");
        if (postAuthor) {
            setPostAuthor(postAuthor);
        }
    }, [getSingleResource, setPostAuthor, currentPub]);

    useEffect(() => {
        getCurrentPost();
        getPostAuthor();
    }, []);

    const refetch = () => {
        getPostAuthor();
    }

    return { postAuthor, currentPub, refetch };
}

export default useAuthorAndPubGlobal;
