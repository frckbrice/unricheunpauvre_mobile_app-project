import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useApiOps from '@/hooks/use-api';
import { Post } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import EmptyState from '@/components/empty-state';
import { usePathname } from 'expo-router';


const SocialFeedScreen = () => {

    const { currentUser, currentUserObj } = useUserGlobal();

    const [refreshing, setRefreshing] = useState(false);
    const pathname = usePathname();
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [userPosts, setUserPosts] = useState<Post[]>([]);

    // const {
    //     data: posts, // get all the post for this current user, by its ID
    //     refetch,
    //     isLoading
    // } = useApiOps<Post>(() => {
    //     return getAllResourcesByTarget<Post>(
    //         'publications', currentUser?.userId, 'idUser'); // get the publications made by this user with id : idUser

    // });

    const getPublicationsOfThisUser = async () => {
        setIsPostsLoading(true)
        try {
            const publications = await getAllResourcesByTarget<Post>(
                'publications', currentUser?.userId, 'idUser'); // get the publications made by this user with id : idUser
            setUserPosts(publications?.data);
        } catch (error) {
            console.error('Failed to get all publications:', error);
            return [];
        } finally {
            setIsPostsLoading(false);
        }
    }

    useEffect(() => {
        // if (pathname.toString().toLowerCase() === '/profile' )
        //     onRefresh();
        if (pathname.toString().toLowerCase() === '/profile' && !userPosts?.length)
            setTimeout(() => {
                getPublicationsOfThisUser();
            }, 2000);
    }, [pathname]);

    // useEffect(() => {
    //     if (!isLoading && !posts.length)
    //         onRefresh();
    // }, [posts]);


    // const onRefresh = React.useCallback(() => {
    //     if (!isLoading) {
    //         setRefreshing(true);
    //         refetch().finally(() => setRefreshing(false));
    //     }
    // }, [isLoading, refetch]);

    // if (isLoading)
    //     return (
    //         <View className='flex-1 justify-center items-center'>
    //             <ActivityIndicator size="small" color={'gray'} />
    //         </View>
    //     );


    const onRefresh = React.useCallback(() => {
        if (!isPostsLoading) {
            setRefreshing(true);
            getPublicationsOfThisUser().finally(() => setRefreshing(false));
        }
    }, [getPublicationsOfThisUser, isPostsLoading]);

    if (isPostsLoading)
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size="small" color={'gray'} />
            </View>
        );

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 mb-6">
            <FlatList
                // data={posts?.data}
                data={userPosts}
                keyExtractor={(post) => String(post?.id)}
                renderItem={({ item: post }) => {
                    // console.log("current user posts: ", post)
                    // console.log("current user  in card: ", currentUserObj)
                    return <PostCard
                        currentUser={currentUserObj}
                        currentPost={post}
                    />
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={() => (
                    <EmptyState
                        title="Aucun rêve"
                        subtitle="Commencer par publier un rêve."
                        label="Poster un rêve"
                        titleStyle='text-white font-bold text-[16px]'
                        subtitleStyle="text-[13px] text-center font-psemibold text-white"
                        route={'/poster'}
                    />
                )}
            />
        </SafeAreaView>
    );
};
export default SocialFeedScreen;