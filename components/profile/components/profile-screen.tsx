import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllResourcesByTarget } from '@/lib/api';
import { Jaime, Publication } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { Colors } from '@/constants';

type TProfileScreen = {
    pubNumber: number;
    likesNumber: number;
}

const ProfileScreen: React.FC = () => {

    const { currentUser } = useUserGlobal();
    const mounted = useRef(false);

    const router = useRouter();
    const [likes, setLikes] = useState(0);
    const [islikeLoading, setIsLikeLoading] = useState(false);
    const [posts, setPosts] = useState(0);
    const [isPostsLoading, setIsPostsLoading] = useState(false);

    const getAllLikes = useCallback(async () => {
        setIsLikeLoading(true);
        try {
            const allLikes = await getAllResourcesByTarget(
                'Jaime', currentUser?.IdUser, 'idPub') as Jaime[];
            console.log("all likes: ", allLikes);
            setLikes(allLikes.length);
        } catch (error) {
            console.error('Failed to get all likes:', error);
        } finally {
            setIsLikeLoading(false);
        }
    }, [getAllResourcesByTarget, setLikes, setIsLikeLoading]);

    const getAllUserPublications = useCallback(async () => {
        setIsPostsLoading(true);
        try {
            const posts = await getAllResourcesByTarget(
                'UserPublications', currentUser?.IdUser);
            console.log("all posts: ", posts);
            setPosts(posts.length);
        } catch (error) {
            console.error('Failed to get all posts:', error);
        } finally {
            setIsPostsLoading(false);
        }
    }, [getAllResourcesByTarget, setPosts, setIsPostsLoading])

    useEffect(() => {
        console.log("\n\n from profile screen file currentUser: ", currentUser)
        getAllLikes();
        getAllUserPublications();
    }, []);

    console.log("\n\n from profile file:  the likes are: ", likes)


    return (
        <>
            <View className="bg-gray-900 ">
                <View className="flex-row items-center mb-2 px-4">
                    <Image source={{ uri: currentUser?.profileImg ?? 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-12 h-12 rounded-full mr-4" />
                    <View>
                        <Text className="text-white text-[14.5px] font-bold">{currentUser?.name ?? "Anonymous"} </Text>
                        <Text className="text-gray-400">{currentUser?.location ?? "Anonynous"}</Text>
                    </View>
                </View>
                <View className="flex-row justify-around mb-4">
                    <View>
                        <Text className="text-white text-center font-bold">
                            {isPostsLoading
                                ? <ActivityIndicator size="large" color={Colors.primary} />
                                : posts || 0}
                        </Text>
                        <Text className="text-gray-400">Rêves</Text>
                    </View>
                    <View>
                        <Text className="text-white text-center font-bold">
                            {islikeLoading ? (
                                <ActivityIndicator size="large" color={Colors.primary} />
                            ) : likes ?? 0}
                        </Text>
                        <Text className="text-gray-400">J'aime</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-blue-500 p-2 ml-4 rounded-xl mb-1 w-[90%]"
                    onPress={() => router.push("/(settings)/edit-profile")}
                >
                    <Text className="text-white text-center">Éditer profil</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ProfileScreen;
