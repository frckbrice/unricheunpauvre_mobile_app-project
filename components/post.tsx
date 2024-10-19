import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react';
import { Post } from '@/lib/types';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TPost = {
    post: Post;
}

const PublicationPost = ({ post }: TPost) => {
    return (
        <>
            <View className="flex-row items-center mb-1 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl">
                <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-10 h-10 rounded-full mr-2" />
                <View>
                    <Text className="text-white font-medium">{post.author}</Text>
                    <Text className="text-gray-400 text-sm">{post.location}</Text>
                </View>
                <Text className="text-gray-400 text-sm ml-auto">{post.timeAgo}</Text>
            </View>
            <View key={post.id} className="bg-gray-800 rounded-lg rounded-tl-none  rounded-tr-none p-4 mb-4">

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
        </>

    )
}

export default PublicationPost;
