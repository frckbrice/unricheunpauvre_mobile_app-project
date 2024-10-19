import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FormField from '@/components/form-field';
import { useSignIn } from '@clerk/clerk-expo';

// Login Screen
const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoaded, signIn, setActive } = useSignIn();

    const router = useRouter();

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) {
            return
        }
        /** possible to fetch projects from here once the
         *  agent code is added. and set them to start project
         *  component directly. */
        // await getAllAssignedProjects(userCode);

        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                return router.push("/accueil");
            } else {
                // See https://clerk.com/docs/custom-flows/error-handling
                // for more info on error handling
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, email, password])


    return (
        <SafeAreaView className="flex-1 mt-5">
            <View className="h-auto justify-center   flex-1">
                <View className="items-center mb-5 ">
                    <Image
                        source={require('../../assets/images/favicon.png')}
                        resizeMode='contain'
                        className="w-10 h-10 mb-4"
                    />
                    <Text className="text-4xl font-bold text-blue-600">Bienvenue !</Text>
                </View>
                <Text className="text-center mb-8 text-gray-600">
                    Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
                </Text>
                <View className="mb-4">
                    <Text className="mb-2 text-gray-700">Adresse email</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                        <Ionicons name="mail" size={24} color="#2563eb" />
                        <TextInput
                            className="flex-1 ml-2 placeholder:text-gray-200"
                            placeholder="Entrer votre adresse email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
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
                className=' w-full h-72  rounded-tl-lg rounded-tr-lg '
                style={{ borderTopRightRadius: 50, borderTopLeftRadius: 50 }}
            >
                <ImageBackground
                    source={require('../../assets/images/loggingImg.png')}
                    resizeMode='cover'
                    className="flex-1 h-72  justify-center items-center object-cover rounded-tl-lg rounded-tr-lg"
                >
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
                            <TouchableOpacity>
                                <Text className="text-lg text-blue-600 font-extrabold">S'inscrire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                <View className=' h-[8vh] bg-black'>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
