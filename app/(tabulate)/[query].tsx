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
    } = useApiOps<Category[]>(getAllCategories);
    const { query } = useLocalSearchParams();

    const listCat = categories.length ? categories.map((category: Category) => category.name) : categoriesP;

    return (
        <SafeAreaView className="h-full bg-gray-900 p-4 py-10">
            {/* <View className="flex-row items-center mb-6">
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1 ml-4 bg-gray-800 rounded-lg p-2 flex-row items-center">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        className="flex-1 ml-2 text-white"
                        placeholder="search publications ..."
                        placeholderTextColor="gray"
                    />
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6 h-10"
            >
                {listCat.map((category: string, index: number) => (
                    <TouchableOpacity key={index} className="bg-white rounded-2xl px-4 py-2 mr-2 h-10">
                        <Text>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text className="text-white text-xl mb-4">00 Resultat trouvé</Text> */}
            {/* Add your search results here */}
            <FlatList
                data={pubs} //
                keyExtractor={(item) => String(item.id)} // tells RN how we'd like to render our list.
                renderItem={({ item }) => <PublicationPost post={item} />}
                ListHeaderComponent={() => (
                    <View className="my-6 mt-2 px-4 ">

                        <View className="my-6 mb-8">
                            {/* search input */}
                            <SearchInput initialQuery={query} placeholder={"Search query"} />
                        </View>
                        {listCat.map((category: string, index: number) => (
                            <TouchableOpacity key={index} className="bg-white rounded-2xl px-4 py-2 mr-2 h-10">
                                <Text>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                // this property displays in case the list of data above is empty. it behave like a fallback.
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Publication found"
                        subtitle="No Post yet found for this search query"
                        label='Search again'
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default SearchScreen;
