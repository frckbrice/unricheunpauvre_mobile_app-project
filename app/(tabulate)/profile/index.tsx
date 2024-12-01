import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useApiOps from '@/hooks/use-api';
import { Post, Publication } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { Colors } from '@/constants';


const SocialFeedScreen = () => {

    const { currentUser } = useUserGlobal();
    const mounted = useRef(false);
    const [refreshing, setRefreshing] = useState(false);

    const {
        data: posts, // get all the post for this current user, by its ID
        refetch,
        isLoading
    } = useApiOps<Post>(() => {
        // if (mounted.current) {
        return getAllResourcesByTarget(
            'Publication', currentUser?.IdUser, 'idUser');
        // }
        // return Promise.resolve([]);
    });

    console.log("current user posts: ", posts)

    // useEffect(() => {
    //     mounted.current = true;
    //     return () => { mounted.current = false };
    // }, [])

    useEffect(() => {
        if (posts && !posts.length) refetch();
    }, [])

    const onRefresh = React.useCallback(() => {
        if (!isLoading) {
            setRefreshing(true);
            refetch().finally(() => setRefreshing(false));
        }
    }, [isLoading, refetch]);

    if (isLoading)
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 mb-6">
            <FlatList
                data={posts}
                keyExtractor={(post) => String(post?.id) + Date.now()}
                renderItem={({ item: post }) => {
                    console.log("current user posts: ", post)
                    return <PostCard
                        name={currentUser?.name}
                        location={currentUser?.location ?? 'anonymous'}
                        time={post?.datePub}
                        content={post?.libelePub}
                        imageUrl={post?.imagePub}
                    />
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );
};
// ?? 'https://media.istockphoto.com/id/1162529718/photo/fealing-generous-becous-of-helping-to-other.jpg?s=612x612&w=0&k=20&c=Rq9YrcVlT13KsKolfG-fWjlx3mJVCWhIt1a2AB2m1CU='
export default SocialFeedScreen;