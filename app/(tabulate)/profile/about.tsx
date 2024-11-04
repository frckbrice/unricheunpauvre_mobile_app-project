import React, { useState } from 'react';
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

    const { currentUser } = useUserGlobal();

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
                        <Text>{currentUser?.username}</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="text-white mb-2">Ville</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text>{currentUser?.location}</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="text-white mb-2">Description</Text>
                    <Text>{currentUser?.description}</Text>
                </View>
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