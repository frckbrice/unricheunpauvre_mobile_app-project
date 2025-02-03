

// SearchScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, SafeAreaView, Text, TouchableOpacity, Animated } from 'react-native';
import { Post } from '@/lib/types';
import useApiOps from '@/hooks/use-api';
import { getAllCategories } from '@/lib/api';
// import PublicationPost from '@/components/post';
import SearchInput from '@/components/search-input';
import EmptyState from '@/components/empty-state';
import { SelectItem } from '@/components/picker';
import { useRouter } from 'expo-router';

import { router } from "expo-router";

export const BoxCard = ({ item }: { item: Post }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
            }}
            className="my-3 w-full"
        >
            <TouchableOpacity
                onPress={() => router.replace(`/post/${item?.id}`)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={0.9}
                className="w-full"
            >
                <View className="bg-gray-700 rounded-xl overflow-hidden border-[0.5px] border-gray-600">
                    {/* Main content container with gradient overlay */}
                    <View className="p-2 relative">
                        {/* Post content */}
                        <View className="space-y-2">
                            <Text className="text-white text-base leading-relaxed">
                                {item?.content?.substring(0, 100)}...
                            </Text>

                            {/* Author info with subtle separator */}
                            <View className="pt-1 mt-2 border-t border-gray-600">
                                <Text className="text-white font-bold text-sm">
                                    envoyé par : {item.author?.nomUser} de {item.author?.localisation}
                                </Text>
                            </View>
                        </View>

                        {/* Custom shadow/glow effect */}
                        <View className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-b from-gray-700/20 to-transparent" />
                    </View>
                </View>

                {/* External shadow container */}
                <View className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-50 -z-10" />
            </TouchableOpacity>
        </Animated.View>
    );
};



const SearchScreen = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { data: categories } = useApiOps<{
        nomCat: string,
        typeCat: string,
        id: string
    }>(() => getAllCategories());
    const router = useRouter();

    const handleSearchResults = useCallback((results: Post[]) => {
        console.log('\n\n Search results:', results);
        setPosts(results);
    }, []);

    return (
        <SafeAreaView className="h-full bg-gray-900 p-4">
            <FlatList
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                    return (
                        <>
                            {/* display a list of post links */}
                            <View className="my-2  space-y-2 w-[100%] border-[0.1px] bg-gray-800 border-gray-500 rounded-lg  shadow-xl p-2">
                                <TouchableOpacity onPress={() => router.replace(`/post/${item?.id}`)}>

                                    <Text className='text-white '>{item?.content?.substring(0, 100)}...</Text>

                                    <View className="pt-1 mt-2 border-t border-gray-600">
                                        <Text className="text-white font-bold text-sm">
                                            envoyé par : {item.author?.nomUser} de {item.author?.localisation}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            {/* <BoxCard item={item} /> */}
                        </>
                    );
                }}
                ListHeaderComponent={() => (
                    <View className="mt-2 px-4">
                        <View className="mb-8">
                            <SearchInput
                                placeholder="Rechercher..."
                                onSearchResults={handleSearchResults}
                            />
                        </View>

                        <SelectItem options={categories} onCategorySelect={handleSearchResults} />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="Pas de publications."
                        subtitle="Aucune publication pour ces categories."
                        label="Relancer la recherche"
                        titleStyle="text-white"
                        subtitleStyle="text-white"
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default SearchScreen;
