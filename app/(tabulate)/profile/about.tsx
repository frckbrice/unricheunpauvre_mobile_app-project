import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import useApiOps from '@/hooks/use-api';
import { getSingleResource } from '@/lib/api';
import useUserGlobal from '@/hooks/use-user-hook';


// Profile Edit Screen
const About: React.FC = () => {

    const [birthDate, setBirthDate] = useState('');
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [city, setCity] = useState('Paris');

    const { currentUser } = useUserGlobal();

    const getTheCurrentUserData = useCallback(async (user_id: string) => {
        try {
            const user = await fetch(`https://rhysapi.iptvstreamerspro.com/api/User/${user_id}`, {
                headers: {
                    "content-type": "application/json"
                },
            });
            if (!user.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await user.json();
            console.log("\n\n from about file curent user data: ", userData);
            setName(userData.nomUser);
            setUsername(userData.username);
            setCity(userData.localisation);
            // setMdpUser(userData?.mdpUser);
            // setUserImg(userData?.photoUser);

            // Parse and set birth date if exists
            if (userData.dateNaiss) {
                const parsedDate = new Date(userData.dateNaiss);
                // setDate(parsedDate);
                setBirthDate(formatDate(parsedDate));
            }

        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (currentUser?.IdUser) {
            getTheCurrentUserData(currentUser?.IdUser)
        }
    }, [getTheCurrentUserData, currentUser]); // a design decision

    // Utility function to format date
    const formatDate = (date: Date): string => {
        return date.toISOString();
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 ">
            {/* <View className="flex-row items-center mb-6">
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Votre profil</Text>
            </View> */}
            <ScrollView className='mb-10'>
                <View className="mb-2">
                    <Text className="text-white mb-2">Nom d'utilisateur</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className='text-white'>{currentUser?.name}</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="text-white mb-2">Username</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className=' text-white/75'>{username}</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="text-white mb-2">Ville</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className=' text-white/75'>{city}</Text>
                    </View>
                </View>
                {/* <View className="mb-2">
                    <Text className="text-white mb-2">Description</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text>{currentUser?.description}</Text>
                    </View>

                </View> */}
                <TouchableOpacity
                    onPress={() => router.push('/(settings)/edit-profile')}
                    className="bg-blue-500 
                rounded-lg p-3 my-4 mt-2">
                    <Text className="text-white text-center font-bold">Modifier</Text>
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
};

export default About;