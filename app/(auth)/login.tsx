import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
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
        /** possible to fetch projects from here once the agent code is added. and set them to start project component directly. */
        // await getAllAssignedProjects(userCode);



        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                return router.push("/select-chapter");
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
        <SafeAreaView className="flex-1">
            <View className="h-auto justify-center  p-4 flex-1">
                <View className="items-center mb-8 ">
                    <Image
                        source={require('../../assets/images/adaptive-icon.png')}
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


                <TouchableOpacity className="my-4">
                    <Text className=" text-blue-600 mb-4 text-center font-semibold">Mot de passe oublié ?</Text>
                </TouchableOpacity>

            </View>
            <View style={{ flex: 1, position: "relative", width: "100 %" }}>
                <View className="flex-1 z-10">
                    <Image
                        source={require('../../assets/images/1riche1povreloginimg.png')}
                        style={{ flex: 1, width: " 100 %", height: "100 %", borderTopRightRadius: 50, borderTopLeftRadius: 50 }}
                    />
                    <View
                        className='bg-transparent'
                        style={{ position: 'absolute', top: 50, left: 80, }}
                    >
                        <TouchableOpacity
                            className="bg-blue-600 rounded-sm p-3 my-4 "
                            onPress={() => router.push('/accueil')}
                        >
                            <Text className="text-white text-center font-bold ">CONNEXION</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center mt-2" >
                            <Text className=" text-primaryMuted font-extrabold">Vous n'avez pas de compte ? </Text>
                            <TouchableOpacity>
                                <Text className="text-base text-blue-700 font-extrabold">S'inscrire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View className=' h-[10vh] bg-black'>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
