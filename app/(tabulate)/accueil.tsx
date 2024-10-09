import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


type Post = {
    id: string;
    author: string;
    location: string;
    content: string;
    imageUrl: string;
    likes: number;
    comments: number;
    timeAgo: string;
};

const HomeScreen: React.FC = () => {
    const posts: Post[] = [

        {
            id: '4',
            author: '1 riche 1 pauvre',
            location: 'Paris, champs elisees',
            content: `See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support.`,
            imageUrl: 'https://media.istockphoto.com/id/1996175547/photo/multiracial-group-of-volunteers-packing-groceries-at-community-food-bank.jpg?s=1024x1024&w=is&k=20&c=PBl7DHO5a7FQ3qkbKt1tghRl-Pk3xtYYB3DKQ7CCLH0=',
            likes: 1,
            comments: 4,
            timeAgo: '2 days ago',
        },
        {
            id: '1',
            author: '1 riche 1 pauvre',
            location: 'Paris, champs elisees',
            content: `See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support.`,
            imageUrl: 'https://media.istockphoto.com/id/1162529718/photo/fealing-generous-becous-of-helping-to-other.jpg?s=612x612&w=0&k=20&c=Rq9YrcVlT13KsKolfG-fWjlx3mJVCWhIt1a2AB2m1CU=',
            likes: 1,
            comments: 4,
            timeAgo: 'yesterday',
        },

    ];

    return (
        <ScrollView className="flex-1 bg-gray-900 py-5 h-[100%]">
            <View className="p-4">
                <View className="flex-row justify-center items-center mb-4 gap-2">
                    <Text className="text-white text-xs font-bold">Donner pour aider</Text>
                    <Image source={require('../../assets/images/adaptive-icon.png')} className="w-8 h-8" />
                    <Text className="text-white text-xs font-bold">Recevoir pour rêver</Text>
                </View>
                {posts.map((post) => (
                    <View key={post.id} className="bg-gray-800 rounded-lg p-4 mb-4">
                        <View className="flex-row items-center mb-2">
                            <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-10 h-10 rounded-full mr-2" />
                            <View>
                                <Text className="text-white font-medium">{post.author}</Text>
                                <Text className="text-gray-400 text-sm">{post.location}</Text>
                            </View>
                            <Text className="text-gray-400 text-sm ml-auto">{post.timeAgo}</Text>
                        </View>
                        <Text className="text-white mb-2">{post.content}</Text>
                        <Image source={{ uri: post.imageUrl }} className="w-full h-48 rounded-lg mb-2" />
                        <View className="flex-row justify-between">
                            <TouchableOpacity className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                                <Text className="text-white text-[12px]">Réaliser</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                                <Text className="text-white text-[12px]">Contribuer</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center mt-2 px-2 py-1 bg-white rounded-2xl justify-between">
                            <View className="flex-row  ">
                                <Ionicons name="chatbox-ellipses" size={20} color="gray" ba />
                                <Text className="text-gray-600 ml-1 mr-4">{post.comments}</Text>
                                <Ionicons name="heart" size={20} color="red" />
                                <Text className="text-gray-600 ml-1">{post.likes}</Text>
                            </View>
                            <View className="flex   bg-blue-300 rounded-full p-3 justify-center items-center">
                                <Ionicons name="heart" size={20} color="white" />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
