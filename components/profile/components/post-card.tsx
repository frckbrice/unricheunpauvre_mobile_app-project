import useAuthorAndPubGlobal from '@/hooks/current-post-author';
import { Publication } from '@/lib/types';
import React, { memo } from 'react';
import { View, Text, Image, } from 'react-native';

type PostCardProps = {
    currentUser: any
    currentPost: any
}

const PostCard = ({
    currentPost, currentUser
}: PostCardProps) => {

    console.log("\n\n currentPost and currentUSer: ", currentPost, currentUser);

    return (

        <View className="bg-gray-800 rounded-lg p-4 px-2 pb-0">
            <View className="flex-row items-center mb-2">
                <Image source={currentUser?.photoUser ? { uri: currentUser?.photoUser } : {
                    uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true'
                }}
                    className="w-10 h-10 rounded-full mr-2" />
                <View>
                    <Text className="text-white font-medium">
                        {currentUser?.nomUser}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                        {currentUser?.localisation}
                    </Text>
                </View>
                <Text className="text-gray-400 text-sm ml-auto">
                    {new Date(currentPost?.timeAgo as string).toDateString()}
                </Text>
            </View>
            <Text className="text-white mb-2 text-[11px]">
                {currentPost?.content}
            </Text>
            {/* {
                imageUrl ?
                    <Image source={{ uri: imageUrl }} className="w-full h-48 rounded-lg mb-2" />
                    :
                    <Image source={require('@/assets/images/empty.png')} alt='No image found' className="w-full h-48 rounded-lg mb-2" />
            } */}
        </View>
    );
}

export default memo(PostCard);
