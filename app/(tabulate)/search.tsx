

// SearchScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, FlatList, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { Category, Post } from '@/lib/types';
import useApiOps from '@/hooks/use-api';
import { getAllCategories } from '@/lib/api';
import PublicationPost from '@/components/post';
import SearchInput from '@/components/search-input';
import EmptyState from '@/components/empty-state';
import { SelectItem } from '@/components/picker';
import { useRouter } from 'expo-router';

const SearchScreen = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { data: categories } = useApiOps<{ nomCat: string, typeCat: string, id: string }>(() => getAllCategories());
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
                            <View className="my-2 mx-4 space-y-2 w-[100%] border border-gray-900 rounded-lg px-4">
                                <TouchableOpacity onPress={() => router.replace(`/post/${item?.id}`)}>
                                    {/* <Image source={{ uri: item.imageUrl }} resizeMode='contain' className="w-96 h-16 rounded-lg" /> */}
                                    <Text className='text-white '>{item?.content?.substring(0, 100)}...</Text>
                                    <Text className='text-white  text-bold '>{item.author?.nomUser}</Text>
                                </TouchableOpacity>
                            </View>
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
