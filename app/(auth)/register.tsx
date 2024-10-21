
import * as React from 'react'
import { TextInput, Button, View, ScrollView, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";

// local components
import FormField from "../../components/form-field";
import CustomButton from "../../components/custom-button";
import { Link, router } from "expo-router";
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserAccount } from '@/lib/api';
import { tokenCache } from '@/store/persist-token-cache';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    // const [username, setUsername] = React.useState('')
    const [nomUser, setNomUser] = React.useState('')
    const [mdpUser, setMdpUser] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const onSignUpPress = async () => {
        setIsSubmitting(true);
        console.log(
            "nomUser", nomUser,
            "mdpUser", mdpUser,
            "isSubmitting", isSubmitting
        )
        try {
            const newUser = await createUserAccount(
                nomUser,
                mdpUser,
                username,
                'User'
            );

            if (newUser) {
                tokenCache.saveToken('token', newUser.token);
                Alert.alert('Success', 'account created successfully');
                console.log("from register: ", newUser)
                router.replace('/accueil')
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <SafeAreaView className="h-full mt-4 ">
            <ScrollView>
                <View className="w-full justify-center   mb-6">
                    <View className="items-center mb-8 ">
                        <Image
                            source={require('../../assets/images/favicon.png')}
                            resizeMode='contain'
                            className="w-10 h-10 mb-2"
                        />
                        <Text className="text-3xl font-bold text-blue-600">Creer son compte !</Text>
                    </View>
                    <Text className="text-center mb-8  px-4 text-gray-600">
                        Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
                    </Text>

                    <>
                        <View className="h-auto justify-center  px-4 flex-1">
                            <View className="mb-2">
                                <Text className=" text-gray-700">Full name</Text>
                                <View className="flex-row items-center border border-gray-300 rounded-lg p-2">

                                    <TextInput
                                        className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
                                        placeholder="Entrer votre nom"
                                        value={nomUser}
                                        onChangeText={(text) => setNomUser(text)}
                                        keyboardType="email-address"
                                    />

                                </View>
                            </View>
                            <View className="mb-2">
                                <Text className=" text-gray-700">Username</Text>
                                <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                                    <Ionicons name="mail" size={24} color="#2563eb" />
                                    <TextInput
                                        className="flex-1 ml-2 placeholder:text-gray-200  text-black-200"
                                        placeholder="Entrer votre UserName de connection"
                                        value={username}
                                        onChangeText={(text) => setUsername(text)}
                                        keyboardType="email-address"
                                    />

                                </View>
                            </View>
                            <View className="mb-2">
                                <Text className=" text-gray-700">Mot de passe</Text>
                                <FormField
                                    title={"Mot de pass"}
                                    value={mdpUser}
                                    placeholder="Enter votre mot de pass..."
                                    handleChangeText={(e: string) => setMdpUser(e)}
                                    inputStyle=" placeholder:text-gray-400  text-black-200"
                                />
                            </View>
                            <TouchableOpacity className="mt-4">
                                <Text className=" text-blue-600 mb-2 text-center font-semibold underline">Mot de passe oublié ?</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            className=' w-full h-80 rounded-tr-[40px] rounded-tl-[40px] '

                        >
                            <View

                                style={{ borderTopRightRadius: 50, borderTopLeftRadius: 50 }}
                                className=" h-fit w-full "
                            >
                                <Image source={require('../../assets/images/loggingImg.png')}
                                    resizeMode='cover' className="w-[100%] h-80 rounded-tr-[40px] rounded-tl-[40px]" />
                                <View
                                    className='bg-transparent justify-center '
                                    style={{ position: 'absolute', top: 50, left: 35, }}
                                >
                                    <TouchableOpacity
                                        className="bg-blue-600 rounded-lg p-3 my-4"
                                        onPress={onSignUpPress}
                                    >
                                        <Text className="text-white text-center font-bold  ">CONNEXION</Text>
                                    </TouchableOpacity>
                                    <View className="flex-row justify-center items-center mt-2" >
                                        <Text className=" text-primaryMuted font-extrabold">Vous n'avez pas de compte ? </Text>
                                        <TouchableOpacity onPress={() => router.replace('/login')}>
                                            <Text className="text-lg text-blue-600 font-extrabold">Se connecter</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {/* <View className=' h-[10vh] bg-black' /> */}

                        </View>
                    </ >
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}