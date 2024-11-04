import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, RefreshControl, FlatList, ActivityIndicator, } from 'react-native';

import EmptyState from '@/components/empty-state';
import { Post } from '@/lib/types';
import useApiOps from '@/hooks/use-api';
import { getAllPublications } from '@/lib/api';
import PublicationPost from '@/components/post';
import { SafeAreaView } from 'react-native-safe-area-context';



const HomeScreen: React.FC = () => {

    const [refreshing, setRefreshing] = useState(false);
    const mounted = useRef(false);
    const {
        data: posts,
        isLoading: isLoadingPosts,
        refetch: refetchPosts
    } = useApiOps<Post>(() => {
        if (mounted.current)
            return getAllPublications();
        return Promise.resolve([]);
    });
    console.log("\n\nfrom HomeScreen component", posts);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false };
    }, [])

    const onRefresh = React.useCallback(() => {
        if (!isLoadingPosts) {
            setRefreshing(true);
            refetchPosts().finally(() => setRefreshing(false));
        }
    }, [isLoadingPosts, refetchPosts]);


    return (
        <SafeAreaView className="flex-1 bg-gray-900 ">
            <View className="">
                <FlatList
                    data={posts as Post[]}
                    keyExtractor={(post) => String(post.id)}
                    renderItem={({ item }) => {


                        return (
                            <>
                                {isLoadingPosts ? (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size="large" color={'gray'} />
                                    </View>
                                ) : <PublicationPost post={item} />}
                            </>

                        )
                    }}
                    ListHeaderComponent={() => (
                        <View className="px-4 ">
                            <View className="flex-row justify-center items-center mb-4 gap-2">
                                <Text className="text-white text-xs font-bold">Donner pour aider</Text>
                                <Image source={require('../../assets/images/adaptive-icon.png')} className="w-8 h-8" />
                                <Text className="text-white text-xs font-bold">Recevoir pour rêver</Text>
                            </View>
                        </View>
                    )}
                    // this property displays in case the list of data above is empty. it behave like a fallback.
                    ListEmptyComponent={() => (
                        <EmptyState
                            title="No Post found"
                            subtitle="Start creating your post."
                            label="Create Post"
                            titleStyle='text-white'
                            subtitleStyle="text-[14px] text-center font-psemibold text-white"
                            route={'/poster'}
                        />
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
