import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Login Screen
const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white p-4 ">
            <View className="h-[85vh] justify-center">
                <View className="items-center mb-8 ">
                    <Image
                        source={require('../../assets/images/adaptive-icon.png')}
                        resizeMode='contain'
                        className="w-10 h-10 mb-4"
                    />
                    <Text className="text-3xl font-bold text-blue-600">Bienvenue !</Text>
                </View>
                <Text className="text-center mb-8 text-gray-600">
                    Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
                </Text>
                <View className="mb-4">
                    <Text className="mb-2 text-gray-700">Adresse email</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                        <Ionicons name="mail-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Entrer votre adresse email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="mb-2 text-gray-700">Mot de passe</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                        <Ionicons name="lock-closed-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2"
                            placeholder="Entrer votre mot de passe"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Ionicons name="eye-outline" size={24} color="gray" />
                    </View>
                </View>
                <TouchableOpacity>
                    <Text className="text-right text-blue-600 mb-4">Mot de passe oublié ?</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-600 rounded-lg p-3 mb-4" onPress={() => router.push('/(tabs)/profile')}>
                    <Text className="text-white text-center font-bold">CONNEXION</Text>
                </TouchableOpacity>
                <View className="flex-row justify-center">
                    <Text className="text-gray-600">Vous n'avez pas de compte ? </Text>
                    <TouchableOpacity>
                        <Text className="text-blue-600 font-bold">S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
