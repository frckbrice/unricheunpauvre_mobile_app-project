import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FormField from '@/components/form-field';
import { createUserAccount } from '@/lib/api';
import { tokenCache } from '@/store/persist-token-cache';
import { Colors } from '@/constants';
import { ActivityIndicator } from 'react-native';

// Login Screen
const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const router = useRouter();

    const onSignInPress = React.useCallback(async () => {
        setIsSubmitting(true);
        try {
            // const data = await createUserAccount(password, username, 'Auth/login');
            const res = await fetch(`https://rhysapi.iptvstreamerspro.com/api/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to login user');
            }
            const data = await res.json();
            if (data?.token) {
                tokenCache.saveToken('currentUser', data?.token);
                Alert.alert('Success', `${data?.message}`);
                router.replace('/accueil');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            console.log(err);
            Alert.alert("Echec de connection", "votre connexion au reseau est instable. veuillez reessayer");
        } finally {
            setIsSubmitting(false);
        }
    }, [username, password]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, }}
        >
            <SafeAreaView className="h-full ">
                <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                    <View className="px-4 justify-center flex-1">
                        <View className="items-center mb-5 ">
                            <Image
                                source={require('../../assets/images/favicon.png')}
                                resizeMode='contain'
                                className="w-10 h-10 mb-4"
                            />
                            <Text className="text-3xl font-bold text-blue-600">Se connecter !</Text>
                        </View>
                        <Text className="text-center mb-8 text-gray-600">
                            Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
                        </Text>
                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">Adresse username</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                                <Ionicons name="mail" size={24} color="#2563eb" />
                                <TextInput
                                    className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
                                    placeholder="Entrer votre adresse username"
                                    value={username}
                                    onChangeText={(text: string) => setUsername(text)}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">Mot de passe</Text>
                            <FormField
                                title={"Mot de passe"}
                                value={password}
                                placeholder="Entrer votre mot de pass..."
                                handleChangeText={(e: string) => setPassword(e)}
                                inputStyle="placeholder:text-gray-200 text-black-200"
                            />
                        </View>
                        {/* <TouchableOpacity className="mt-3">
                            <Text className=" text-blue-600 mb-4 text-center font-semibold">Mot de passe oublié ?</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View className='w-full '>
                        <View
                            className='bg-transparent justify-center'
                        >
                            <TouchableOpacity
                                className="bg-blue-600 rounded-lg p-3 my-4 mx-5"
                                onPress={onSignInPress}
                            >
                                {isSubmitting ? <ActivityIndicator size="large" color={Colors.primary} /> : <Text className="text-white text-center font-bold">CONNEXION</Text>}
                            </TouchableOpacity>
                            <View className="flex-row justify-center items-center mt-2">
                                <Text className=" text-gray-500 font-extrabold">Vous n'avez pas de compte ? </Text>
                                <TouchableOpacity onPress={() => router.replace('/register')}>
                                    <Text className="text-lg text-blue-600 font-extrabold">creer son compte</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
