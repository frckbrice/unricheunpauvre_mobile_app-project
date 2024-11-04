import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useApiOps from '@/hooks/use-api';
import { Category, Post } from '@/lib/types';
import { getAllCategories } from '@/lib/api';
import { FlatList } from 'react-native';
import PublicationPost from '@/components/post';
import SearchInput from '@/components/search-input';
import EmptyState from '@/components/empty-state';
import { useLocalSearchParams } from 'expo-router';

// Search Screen
const SearchScreen: React.FC = () => {
    const categoriesP = ['Santé', 'Éducation', 'Logement', 'Alimentation'];
    const pubs: Post[] = [];
    const {
        data: categories,
        refetch: refetchCategories,
        isLoading
    } = useApiOps<Category>(getAllCategories);
    const { query } = useLocalSearchParams();

    const listCat = categories?.length ? categories?.map((category: Category) => category.name) : categoriesP;

    return (
        <SafeAreaView className="h-full bg-gray-900 p-4 ">

            {/* Add your search results here */}
            <FlatList
                data={pubs} //
                keyExtractor={(item) => String(item.id)} // tells RN how we'd like to render our list.
                renderItem={({ item }) => <PublicationPost post={item} />}
                ListHeaderComponent={() => (
                    <View className=" mt-2 px-4 ">

                        <View className="mb-8">
                            {/* search input */}
                            <SearchInput initialQuery={query} placeholder={"Search query"} />
                        </View>
                        <View className='space-y-1'>
                            {listCat.map((category: string, index: number) => (
                                <TouchableOpacity key={index} className="bg-white/90 rounded-lg px-4 py-2 mr-2 h-10">
                                    <Text className="text-black-100">{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>
                )}
                // this property displays in case the list of data above is empty. it behave like a fallback.
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Publication found"
                        subtitle="No Post yet found for this search query"
                        label='Search again'
                        titleStyle='text-white'
                        subtitleStyle='text-white'
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default SearchScreen;
