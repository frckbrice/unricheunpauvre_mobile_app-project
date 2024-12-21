import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useApiOps from '@/hooks/use-api';
import { Post, Publication } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { Colors } from '@/constants';
import EmptyState from '@/components/empty-state';


const SocialFeedScreen = () => {

    const { currentUser } = useUserGlobal();
    const mounted = useRef(false);
    const [refreshing, setRefreshing] = useState(false);

    const {
        data: posts, // get all the post for this current user, by its ID
        refetch,
        isLoading
    } = useApiOps<Post>(() => {
        return getAllResourcesByTarget(
            'UserPublications', currentUser?.IdUser);

    });

    console.log("\n\n from profile indec file, personal posts: ", posts)
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
                data={posts}
                keyExtractor={(post) => String(post?.id)}
                renderItem={({ item: post }) => {
                    console.log("current user posts: ", post)
                    return <PostCard
                        name={currentUser?.name}
                        location={currentUser?.location ?? 'anonyme'}
                        time={post?.datePub}
                        content={post?.libelePub}
                        imageUrl={post?.imagePub}
                    />
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={() => (
                    <EmptyState
                        title="Aucune Publication personnelle"
                        subtitle="Commencer par publier."
                        label="Creer une Publication"
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