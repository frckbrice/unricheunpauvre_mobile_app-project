import useAuthorAndPubGlobal from '@/hooks/current-post-author';
import React, { memo } from 'react';
import { View, Text, Image, } from 'react-native';


const PostCard = ({
    name,
    location,
    time,
    content,
    imageUrl }: { name: string; location: string; time: string; content: string; imageUrl: string; }) => {

    const { } = useAuthorAndPubGlobal();

    return (

        <View className="bg-gray-800 rounded-lg p-4 px-2 pb-0">
            <View className="flex-row items-center mb-2">
                <Image source={
                    { uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }}
                    className="w-10 h-10 rounded-full mr-2" />
                <View>
                    <Text className="text-white font-medium">{name}</Text>
                    <Text className="text-gray-400 text-sm">{location}</Text>
                </View>
                <Text className="text-gray-400 text-sm ml-auto">{new Date(time).toDateString()}</Text>
            </View>
            <Text className="text-white mb-2 text-[13px]">{content}</Text>
            <Image source={{ uri: imageUrl }} className="w-full h-48 rounded-lg mb-2" />

        </View>
    );
}

export default memo(PostCard);
