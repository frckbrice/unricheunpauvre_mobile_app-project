import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, FlatList, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/empty-state';
import { posts } from "@/constants/mock-data"
import { Post } from '@/lib/types';
import useApiOps from '@/hooks/use-api';
import { getAllPublications } from '@/lib/api';
import PublicationPost from '@/components/post';



const HomeScreen: React.FC = () => {

    const [refreshing, setRefreshing] = useState(false);
    const {
        data: posts,
        isLoading: isLoadingPosts,
        refetch: refetchPosts
    } = useApiOps<Post[] | []>(getAllPublications);


    const onRefresh = () => {
        refetchPosts();
    }

    return (
        <ScrollView className="flex-1 bg-gray-900 pt-1 ">
            <View className="p-4">
                <FlatList
                    data={posts as Post[]}
                    keyExtractor={(post) => String(post.id)}
                    renderItem={({ item: post }) => {


                        return (
                            <>
                                <PublicationPost post={post} />
                            </>

                        )
                    }}
                    ListHeaderComponent={() => (
                        <View className=" my-2 px-4 ">
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
                            subtitleStyle="text-[14px] text-center font-psemibold"
                            route={'/poster'}
                        />
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
