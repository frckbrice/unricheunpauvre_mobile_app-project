

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { tokenCache } from '@/store/persist-token-cache';
import { Colors } from '@/constants';
import FormField from '@/components/form-field';

interface LoginFormData {
    username: string;
    password: string;
}

const renderSubmitButton = (submitStatus: "idle" | "loading" | "success" | "error") => {
    switch (submitStatus) {
        case 'loading':
            return <ActivityIndicator size="small" color="white" />;
        case 'success':
            return (
                <View className="flex-row items-center justify-center space-x-2">
                    <Text className="text-white text-center font-bold">CONNECTÉ</Text>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                </View>
            );
        case 'error':
            return (
                <View className="flex-row items-center justify-center space-x-2">
                    <Text className="text-white text-center font-bold">RÉESSAYER</Text>
                    <Ionicons name="alert-circle" size={20} color="white" />
                </View>
            );
        default:
            return <Text className="text-white text-center font-bold">CONNEXION</Text>;
    }
};

const LoginScreen: React.FC = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        defaultValues: {
            username: '',
            password: ''
        },
        mode: 'onChange'
    });

    const onSignInPress = async (data: LoginFormData) => {
        setSubmitStatus('loading');
        try {
            const res = await fetch(`https://rhysapi.iptvstreamerspro.com/api/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                }),
            });

            if (!res.ok) {
                setSubmitStatus('error');
                return;
            }

            const responseData = await res.json();
            if (responseData?.token) {
                // store current user to cache
                tokenCache.saveToken('currentUser', responseData?.token);
                setSubmitStatus('success');

                // Navigate after showing success state briefly
                setTimeout(() => {
                    router.replace('/accueil');
                }, 1000);
            } else {
                setSubmitStatus('error');
            }
        } catch (err) {
            console.error(err);
            setSubmitStatus('error');
        }
    };



    const getSubmitButtonStyle = () => {
        switch (submitStatus) {
            case 'success':
                return 'bg-green-600';
            case 'error':
                return 'bg-red-600';
            case 'loading':
                return 'bg-blue-400';
            default:
                return 'bg-blue-600';
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="h-full">
                <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                    <View className="px-4 justify-center flex-1 w-full">
                        <View className="items-center mb-5">
                            <Image
                                source={require('../../assets/images/favicon.png')}
                                resizeMode='contain'
                                className="w-24 h-24 mb-4"
                            />
                            <Text className="text-3xl font-bold text-blue-600">Se connecter !</Text>
                        </View>
                        <Text className="text-center mb-8 text-gray-600">
                            Veuillez saisir votre nom d'utilisateur et votre mot de passe pour vous connecter
                        </Text>

                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">
                                Nom d'utilisateur
                                <Text className='text-red-500'>*</Text>
                            </Text>
                            <Controller
                                control={control}
                                name="username"
                                rules={{
                                    required: 'Le nom d\'utilisateur est requis',
                                    minLength: {
                                        value: 3,
                                        message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <View className={`flex-row items-center border rounded-lg p-2 
                                        ${errors.username ? 'border-red-500' : 'border-gray-300'}`}>
                                        <Ionicons name="person" size={24} color="#2563eb" />
                                        <TextInput
                                            className="flex-1 ml-2 text-black-200"
                                            placeholder="Entrer votre nom d'utilisateur"
                                            value={value}
                                            onChangeText={onChange}
                                            autoCapitalize="none"
                                        />
                                    </View>
                                )}
                            />
                            {errors.username && (
                                <Text className="text-red-500 text-sm mt-1">{errors.username.message}</Text>
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">
                                Mot de passe
                                <Text className='text-red-500'>*</Text>
                            </Text>
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: 'Le mot de passe est requis',
                                    minLength: {
                                        value: 4,
                                        message: 'Le mot de passe doit contenir au moins 6 caractères'
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormField
                                        title={"Mot de passe"}
                                        value={value}
                                        placeholder="Entrer votre mot de pass..."
                                        handleChangeText={onChange}
                                        inputStyle="placeholder:text-gray-200 text-black-200"
                                    />
                                )}
                            />
                            {errors.password && (
                                <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                            )}
                        </View>

                        <View className='w-full mt-4'>
                            <TouchableOpacity
                                className={`rounded-lg p-3 ${getSubmitButtonStyle()}`}
                                onPress={handleSubmit(onSignInPress)}
                                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                            >
                                {renderSubmitButton(submitStatus)}
                            </TouchableOpacity>

                            <View className="flex-row justify-center items-center mt-4">
                                <Text className="text-gray-500 font-extrabold">Vous n'avez pas de compte ? </Text>
                                <TouchableOpacity
                                    onPress={() => router.replace('/register')}
                                    disabled={submitStatus === 'loading'}
                                >
                                    <Text className="text-lg text-blue-600 font-extrabold">S'inscrire</Text>
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