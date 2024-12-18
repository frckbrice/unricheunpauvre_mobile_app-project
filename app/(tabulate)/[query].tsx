import React, { useEffect, useState } from 'react';
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
import { API_URL } from '@/constants/constants';

// Search Screen
const SearchScreen: React.FC = () => {
    const categoriesP = ['Santé', 'Éducation', 'Logement', 'Alimentation'];
    const [posts, setPosts] = useState<Post[]>([]);
    const {
        data: categories,
        refetch: refetchCategories,
        isLoading
    } = useApiOps<Category>(() => getAllCategories());
    const { query } = useLocalSearchParams<{ query: string }>();

    const getAllPubs = async (id: number) => {
        const url = `${API_URL}/Publication/${id}`;
        const option = {
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const res = await fetch(url, option);
            const data = await res.json();
            if (data) {
                console.log(data);
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching Publication data :', error);
        }
    };

    const getCurrentUser = (catId: number) => {
        getAllPubs(catId);
    };

    return (
        <SafeAreaView className="h-full bg-gray-900 p-4 ">

            {/* Add your search results here */}
            <FlatList
                data={posts?.length ? posts : []} //
                keyExtractor={(item) => String(item.id)} // tells RN how we'd like to render our list.
                renderItem={({ item }) => (
                    <PublicationPost post={item} />
                )}
                ListHeaderComponent={() => (
                    <View className=" mt-2 px-4 ">
                        <View className="mb-8">
                            {/* search input */}
                            <SearchInput initialQuery={query} placeholder={"Rechercher..."} />
                        </View>
                        <View className='space-y-1'>
                            {categories.length ? categories?.map((category: Category, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => getCurrentUser(category?.idCat)}
                                    className="bg-white/90 rounded-lg px-4 py-2 mr-2 h-10"
                                >
                                    <Text className="text-black-100">{category?.nomCat}
                                    </Text>
                                </TouchableOpacity>
                            )) : <Text className="text-white">Pas de categoies actuellement</Text>}
                        </View>

                    </View>
                )}
                // this property displays in case the list of data above is empty. it behave like a fallback.
                ListEmptyComponent={() => (
                    <EmptyState
                        title="Pas de publications."
                        subtitle="Aucune publication pour ces categories."
                        label='Relancer la recherche'
                        titleStyle='text-white'
                        subtitleStyle='text-white'
                    />
                )}
            />;
        </SafeAreaView>
    );
};

export default SearchScreen;
