import React, { useMemo, useState } from 'react';
import { View, Text, Image, RefreshControl, FlatList, ActivityIndicator, KeyboardAvoidingView, } from 'react-native';

import EmptyState from '@/components/empty-state';
import { Post } from '@/lib/types';
import useApiOps from '@/hooks/use-api';
import { getAllPublications } from '@/lib/api';
import PublicationPost from '@/components/post';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChunkedApiOps } from '@/hooks/use-api-in-chunck';
import { Platform } from 'react-native';



const HomeScreen: React.FC = () => {

    const [refreshing, setRefreshing] = useState(false);

    const {
        data: posts,
        isLoading: isLoadingPosts,
        loadMore,
        refresh,
        hasMore
    } = useChunkedApiOps<Post>(
        () => getAllPublications(),
    );


    const onRefresh = React.useCallback(() => {
        if (!isLoadingPosts) {
            setRefreshing(true);
            refresh();
        }
    }, [isLoadingPosts, refresh]);

    // remove duplicates
    const uniquePosts = useMemo(() => {
        if (!posts?.length) return [];
        return posts?.reduce((unique: Post[], post: Post) => {
            if (!unique.find((p: Post) => p.comments === post.comments)) {
                unique.push(post);
            }
            return unique;
        }, []);
    }, [posts]);

    console.log("\n\n list of posts: ", posts);
    // reverse the array of posts
    const reversedPosts = uniquePosts?.reverse();


    return (
        <SafeAreaView className="flex-1 bg-gray-900 ">
            <View className="">
                <FlatList
                    data={reversedPosts || [] as Post[]}
                    keyExtractor={(post) => String(post.id)}
                    renderItem={({ item }) => {
                        return (
                            <>
                                {isLoadingPosts ? (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size="large" color={'green'} />
                                    </View>
                                ) : <PublicationPost post={item} />}
                            </>
                        )
                    }}
                    ListHeaderComponent={() => (
                        <View className="px-4 ">
                            <View className="flex-row justify-center items-center mb-4 gap-2">
                                <Text className="text-white text-sm font-bold">Donner pour aider</Text>
                                <Image source={require('../../assets/images/adaptive-icon.png')} className="w-8 h-8" />
                                <Text className="text-white text-sm font-bold">Recevoir pour rêver</Text>
                            </View>
                        </View>
                    )}
                    // this property displays in case the list of data above is empty. it behave like a fallback.
                    ListEmptyComponent={() => (
                        <EmptyState
                            title="Aucune Publication Existante"
                            subtitle="Commencer par la premiere."
                            label="Creer une Publication"
                            titleStyle='text-white font-bold text-[16px]'
                            subtitleStyle="text-[13px] text-center font-psemibold text-white"
                            route={'/poster'}
                        />
                    )}

                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}

                />
            </View>
        </SafeAreaView>
        // </KeyboardAvoidingView>
    );
};

export default HomeScreen;
