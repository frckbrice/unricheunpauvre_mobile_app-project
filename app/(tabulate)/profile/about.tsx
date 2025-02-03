import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, usePathname } from 'expo-router';
import useApiOps from '@/hooks/use-api';
import { getSingleResource } from '@/lib/api';
import useUserGlobal from '@/hooks/use-user-hook';
import { ProfileModal } from '@/components/profile/components/profile-details';


// Profile Edit Screen
const About: React.FC = () => {

    const { currentUser, currentUserObj } = useUserGlobal();
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/profile/about' && !isProfileModalVisible) {
            setIsProfileModalVisible(true);
        }
    }, [pathname]);

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 ">

            <ScrollView className='mb-10'>
                <View className="mb-2">
                    <Text className="text-white mb-2">Nom Complet</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className='text-white'>{currentUserObj?.nomUser}</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="text-white mb-2">Nom d'utilisateur</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className=' text-white/75'>{currentUserObj?.username}</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="text-white mb-2">Ville</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className=' text-white/75'>{currentUserObj?.localisation}</Text>
                    </View>
                </View>

                {/* <TouchableOpacity
                    onPress={() => router.push('/(settings)/edit-profile')}
                    className="bg-blue-500 
                rounded-lg p-3 my-4 mt-2">
                    <Text className="text-white text-center font-bold">Modifier</Text>
                </TouchableOpacity> */}

            </ScrollView>
            <ProfileModal
                isVisible={isProfileModalVisible}
                onClose={() => setIsProfileModalVisible(false)}
                user={currentUserObj as any}
            />
        </SafeAreaView>
    );
};

export default About;