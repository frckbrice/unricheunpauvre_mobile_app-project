import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FormField from '@/components/form-field';
import { useSignIn } from '@clerk/clerk-expo';
import { createUserAccount } from '@/lib/api';
import { tokenCache } from '@/store/persist-token-cache';

// Login Screen
const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLoaded, signIn, setActive } = useSignIn();
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const router = useRouter();

    const onSignInPress = React.useCallback(async () => {
        setIsSubmitting(true);
        console.log("nomUser", username, "mdpUser", password, "isSubmitting", isSubmitting,)
        try {
            const newUser = await createUserAccount(
                username,
                password,
                'Auth/login',
            );

            if (newUser) {
                tokenCache.saveToken('token', newUser.token);
                Alert.alert('Success', 'account created successfully');
                router.replace('/accueil')
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsSubmitting(false);
        }
    }, [isLoaded, username, password])


    return (
        <SafeAreaView className="flex-1 mt-5 ">
            <View className="px-4 justify-center ">
                <View className="items-center mb-5 ">
                    <Image
                        source={require('../../assets/images/favicon.png')}
                        resizeMode='contain'
                        className="w-10 h-10 mb-4"
                    />
                    <Text className="text-3xl font-bold text-blue-600">Se conntecter !</Text>
                </View>
                <Text className="text-center mb-8 text-gray-600">
                    Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
                </Text>
                <View className="mb-4">
                    <Text className="mb-2 text-gray-700">Adresse username</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                        <Ionicons name="mail" size={24} color="#2563eb" />
                        <TextInput
                            className="flex-1 ml-2 placeholder:text-gray-200"
                            placeholder="Entrer votre adresse username"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            keyboardType="email-address"
                        />

                    </View>
                </View>
                <View className="mb-4">
                    <Text className="mb-2 text-gray-700">Mot de passe</Text>
                    <FormField
                        title={"Password"}
                        value={password}
                        placeholder="Enter your password"
                        handleChangeText={(e: string) => setPassword(e)}
                        inputStyle=" placeholder:text-gray-400"
                    />
                </View>


                <TouchableOpacity className="mt-3">
                    <Text className=" text-blue-600 mb-4 text-center font-semibold">Mot de passe oublié ?</Text>
                </TouchableOpacity>

            </View>

            <View
                className=' w-full h-80 rounded-tr-[40px] rounded-tl-[40px]'
            >
                <View

                    style={{ borderTopRightRadius: 50, borderTopLeftRadius: 50 }}
                    className=" h-fit w-full "
                >
                    <Image source={require('../../assets/images/loggingImg.png')}
                        resizeMode='cover' className="w-[100%] h-80 rounded-tr-[40px] rounded-tl-[40px]" />
                    <View
                        className='bg-transparent justify-center '
                        style={{ position: 'absolute', top: 50, left: 50, }}
                    >
                        <TouchableOpacity
                            className="bg-blue-600 rounded-lg p-3 my-4"
                            onPress={onSignInPress}
                        >
                            <Text className="text-white text-center font-bold  ">CONNEXION</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center items-center mt-2" >
                            <Text className=" text-primaryMuted font-extrabold">Vous n'avez pas de compte ? </Text>
                            <TouchableOpacity onPress={() => router.replace('/register')}>
                                <Text className="text-lg text-blue-600 font-extrabold">S'inscrire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* <View className=' h-[8vh] bg-black' /> */}
            </View>

        </SafeAreaView>
    );
};

export default LoginScreen;
