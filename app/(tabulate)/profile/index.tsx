import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useApiOps from '@/hooks/use-api';
import { Post } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';
import { FlatList, RefreshControl } from 'react-native';
import EmptyState from '@/components/empty-state';


const SocialFeedScreen = () => {

    const { currentUser, currentUserObj } = useUserGlobal();

    const [refreshing, setRefreshing] = useState(false);

    const {
        data: posts, // get all the post for this current user, by its ID
        refetch,
        isLoading
    } = useApiOps<Post>(() => {
        return getAllResourcesByTarget<Post>(
            'publications', currentUser?.userId, 'idUser'); // get the publications made by this user with id : idUser

    });


    const onRefresh = React.useCallback(() => {
        if (!isLoading) {
            setRefreshing(true);
            refetch().finally(() => setRefreshing(false));
        }
    }, [isLoading, refetch]);

    // if (isLoading)
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
    //             <ActivityIndicator size="small" color={Colors.primary} />
    //         </View>
    //     );

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 mb-6">
            <FlatList
                data={posts?.data}
                keyExtractor={(post) => String(post?.id)}
                renderItem={({ item: post }) => {
                    console.log("current user posts: ", post)
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