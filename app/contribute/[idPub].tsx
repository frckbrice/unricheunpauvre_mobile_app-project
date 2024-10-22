import React, { useEffect, useState } from 'react';
import {
    View, Text, Image,
    TouchableOpacity, ScrollView, TextInput,
    Alert,
} from 'react-native';

import { Category, Don, Post, Publication, User, } from '@/lib/types';
import { getSingleResource, uploadResourceData, } from '@/lib/api';

import { useForm, Controller } from 'react-hook-form';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';
import { tokenCache } from '@/store/persist-token-cache';
import { Ionicons } from '@expo/vector-icons';
import useAuthorAndPubGlobal from '@/hooks/current-post-author';



const Contribute: React.FC = () => {

    const [form, setForm] = useState({
        nomDons: '',
        montantDons: 0
    });

    const { control, handleSubmit } = useForm<Don>();
    const { currentUser } = useUserGlobal();


    const { idPub } = useLocalSearchParams();
    const router = useRouter();

    // get current post author and curretn post.
    const { postAuthor, currentPub } = useAuthorAndPubGlobal();

    const onSubmit = async (data: Don) => {
        const formData = {
            ...form,
            idPub: Number(idPub),
            IdUser: currentUser?.IdUser,
        }
        console.log("don to send: ", formData)
        try {
            console.log("from data: ", formData);
            const result = await uploadResourceData(formData, "Don",);
            if (typeof result != 'undefined') {
                Alert.alert('Success', 'Donation created successfully');
                router.push('/accueil')
            }

            else return console.error("fail to create donation.");
        } catch (error) {
            console.error(`Error creating a donation: ${error}, Please try again`);
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-gray-900 ">
            <View className="p-4 justify-center ">
                <View className='flex-row items-center my-5'>
                    <TouchableOpacity onPress={() => router.push('/accueil')} className='mr-2 p-2 rounded-full bg-slate-300 mb-2'>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold mb-4">Contribuer a la publication </Text>
                </View>
                <Text className="text-white text-sm  mb-4 ">
                    Auteur: {postAuthor?.nomUser ?? "Admin platform"}</Text>
                <Text className="text-white text-sm  mb-4 ">
                    Poste le {new Date(currentPub?.timeAgo as string).toDateString()} a {new Date(currentPub?.timeAgo as string).toLocaleTimeString()}</Text>
                <View className="flex-row items-center mb-4">
                    <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-10 h-10 rounded-full mr-2" />
                    <Text className="text-white">un riche un pauvre</Text>
                </View>
            </View>
            <View className="p-4 justify-center ">

                {/* <Text className="text-white text-start mb-1">(optional)</Text> */}
                <TextInput
                    placeholder="Commentaire decrivant votre don..."
                    placeholderTextColor="#f1f1f1"
                    className="bg-gray-800
                     p-2 rounded w-full
                      text-white mb-4 
                     h-100"
                    multiline
                    value={form.nomDons}
                    onChangeText={(text) => setForm({ ...form, nomDons: text })}
                />
                <Text className="text-white text-start">Montant a donner</Text>

                <View className='flex-row w-full rounded
                justify-between items-center
                 bg-gray-800 pr-2 my-2 '>
                    <TextInput
                        placeholder="Commentaire decrivant votre don..."
                        placeholderTextColor="#f1f1f1"
                        className="bg-transparent
                     p-2 rounded w-[80%]
                      text-white 
                     h-100"
                        keyboardType="numeric"
                        value={form.montantDons?.toString()}
                        onChangeText={(text) => setForm({ ...form, montantDons: parseInt(text) })}
                    />
                    <Text className="text-white ml-2">€</Text>
                </View>

                <TouchableOpacity
                    className="bg-gray-600 p-3 rounded-sm shadow-lg w-full"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-white text-center font-bold">PAYER</Text>
                </TouchableOpacity>
            </View >
        </SafeAreaView >

    );
};

export default Contribute;
