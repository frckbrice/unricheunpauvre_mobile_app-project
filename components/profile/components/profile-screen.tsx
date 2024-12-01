import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllResourcesByTarget } from '@/lib/api';
import useApiOps from '@/hooks/use-api';
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
    const {
        data: posts,
        isLoading,
        refetch
    } = useApiOps<Publication>(() => {
        // if (mounted.current)
        return getAllResourcesByTarget("Publication", currentUser?.IdUser);
        // return Promise.resolve([]);
    });
    const router = useRouter();

    const {
        data: likes, // get all the likes for this pub, by its ID
        refetch: refetchlikes,
        isLoading: islikeLoading
    } = useApiOps<Jaime>(() => {
        // if (mounted.current)
        return getAllResourcesByTarget(
            'Jaime', currentUser?.IdUser) as Promise<Jaime[]>;
        // return Promise.resolve([]);
    });

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, [])

    if (isLoading)
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );

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
                        <Text className="text-white text-center font-bold">{isLoading ? <ActivityIndicator size="large" color={Colors.primary} /> : posts?.length || 0}</Text>
                        <Text className="text-gray-400">Publications</Text>
                    </View>
                    <View>
                        <Text className="text-white text-center font-bold">
                            {islikeLoading ? (
                                <ActivityIndicator size="large" color={Colors.primary} />
                            ) : likes?.length ?? 0}
                        </Text>
                        <Text className="text-gray-400">J'aime</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-blue-500 p-2 rounded-xl mb-1 w-full"
                    onPress={() => router.push("/(settings)/edit-profile")}
                >
                    <Text className="text-white text-center">Éditer profil</Text>
                </TouchableOpacity>
                {/* <View className="flex-row justify-around mb-4">
                    <TouchableOpacity className="border-b-2 border-blue-500 pb-2" >
                        <Text className="text-white">Publication</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/(settings)/edit-profile")}>
                        <Text className="text-gray-400">A propos de moi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className="text-gray-400">Favoris</Text>
                    </TouchableOpacity>
                </View> */}
                {/* Add profile posts here, similar to HomeScreen */}
            </View>
        </>
    );
};

export default ProfileScreen;
