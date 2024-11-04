
// // import * as React from 'react'
// // import { TextInput, View, ScrollView, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native'
// // import { useRouter } from 'expo-router'
// // import { SafeAreaView } from "react-native-safe-area-context";

// // // local components
// // import FormField from "../../components/form-field";
// // import CustomButton from "../../components/custom-button";
// // import { Link, router } from "expo-router";
// // import { Image } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { createUserAccount } from '@/lib/api';
// // import { tokenCache } from '@/store/persist-token-cache';

// // export default function SignUpScreen() {
// //     const router = useRouter()

// //     // const [username, setUsername] = React.useState('')
// //     const [nomUser, setNomUser] = React.useState('')
// //     const [mdpUser, setMdpUser] = React.useState('')
// //     const [username, setUsername] = React.useState('')
// //     const [isSubmitting, setIsSubmitting] = React.useState(false)

// //     const onSignUpPress = async () => {
// //         setIsSubmitting(true);
// //         console.log(
// //             "nomUser", nomUser,
// //             "mdpUser", mdpUser,
// //             "isSubmitting", isSubmitting
// //         )
// //         try {
// //             const newUser = await createUserAccount(
// //                 mdpUser,
// //                 username,
// //                 'User',
// //                 nomUser,
// //             );

// //             if (typeof newUser != 'undefined') {
// //                 tokenCache.saveToken('currentUser', newUser);
// //                 Alert.alert('Success', 'account created successfully');
// //                 console.log("from register: ", newUser)
// //                 router.replace('/accueil')
// //             }
// //         } catch (err: any) {
// //             console.error(JSON.stringify(err, null, 2))
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     }


// //     return (
// //         <SafeAreaView className="flex-1 mt-5 bg-green-400">
// //             {/* <ScrollView> */}
// //             <View className="w-full justify-center   mb-6">
// //                 <View className="items-center mb-8 ">
// //                     <Image
// //                         source={require('../../assets/images/favicon.png')}
// //                         resizeMode='contain'
// //                         className="w-10 h-10 mb-2"
// //                     />
// //                     <Text className="text-3xl font-bold text-blue-600">Creer son compte !</Text>
// //                 </View>
// //                 <Text className="text-center mb-8  px-4 text-gray-600">
// //                     Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
// //                 </Text>

// //                 <>
// //                     <View className="h-auto justify-center  px-4 flex-1">
// //                         <View className="mb-2">
// //                             <Text className=" text-gray-700">Full name</Text>
// //                             <View className="flex-row items-center border border-gray-300 rounded-lg p-2">

// //                                 <TextInput
// //                                     className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
// //                                     placeholder="Entrer votre nom"
// //                                     value={nomUser}
// //                                     onChangeText={(text: string) => setNomUser(text)}
// //                                     keyboardType="email-address"
// //                                 />

// //                             </View>
// //                         </View>
// //                         <View className="mb-2">
// //                             <Text className=" text-gray-700">Username</Text>
// //                             <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
// //                                 <Ionicons name="mail" size={24} color="#2563eb" />
// //                                 <TextInput
// //                                     className="flex-1 ml-2 placeholder:text-gray-200  text-black-200"
// //                                     placeholder="Entrer votre UserName de connection"
// //                                     value={username}
// //                                     onChangeText={(text: string) => setUsername(text)}
// //                                     keyboardType="email-address"
// //                                 />

// //                             </View>
// //                         </View>
// //                         <View className="mb-2">
// //                             <Text className=" text-gray-700">Mot de passe</Text>
// //                             <FormField
// //                                 title={"Mot de pass"}
// //                                 value={mdpUser}
// //                                 placeholder="Enter votre mot de pass..."
// //                                 handleChangeText={(e: string) => setMdpUser(e)}
// //                                 inputStyle=" placeholder:text-gray-400  text-black-200"
// //                             />
// //                         </View>
// //                         <TouchableOpacity className="mt-4">
// //                             <Text className=" text-blue-600 mb-2 text-center font-semibold underline">Mot de passe oublié ?</Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                     <View
// //                         className=' w-full h-80 rounded-tr-[40px] rounded-tl-[40px] '

// //                     >
// //                         <View

// //                             style={{ borderTopRightRadius: 50, borderTopLeftRadius: 50 }}
// //                             className=" h-fit w-full "
// //                         >
// //                             <Image source={require('../../assets/images/loggingImg.png')}
// //                                 resizeMode='cover' className="w-[100%] h-80 rounded-tr-[40px] rounded-tl-[40px]" />
// //                             <View
// //                                 className='bg-transparent justify-center '
// //                                 style={{ position: 'absolute', top: 50, left: 35, }}
// //                             >
// //                                 <TouchableOpacity
// //                                     className="bg-blue-600 rounded-lg p-3 my-4"
// //                                     onPress={onSignUpPress}
// //                                 >
// //                                     <Text className="text-white text-center font-bold  ">CONNEXION</Text>
// //                                 </TouchableOpacity>
// //                                 <View className="flex-row justify-center items-center mt-2" >
// //                                     <Text className=" text-primaryMuted font-extrabold">Vous n'avez pas de compte ? </Text>
// //                                     <TouchableOpacity onPress={() => router.replace('/login')}>
// //                                         <Text className="text-lg text-blue-600 font-extrabold">Se connecter</Text>
// //                                     </TouchableOpacity>
// //                                 </View>
// //                             </View>
// //                         </View>
// //                         {/* <View className=' h-[10vh] bg-black' /> */}

// //                     </View>
// //                 </ >
// //             </View>

// //             {/* </ScrollView> */}

// //         </SafeAreaView>
// //     )
// // }

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import FormField from '@/components/form-field';
// import { createUserAccount } from '@/lib/api';
// import { tokenCache } from '@/store/persist-token-cache';
// import { KeyboardAvoidingView } from 'react-native';
// import { Platform } from 'react-native';
// import { ScrollView } from 'react-native';

// // Login Screen
// const LoginScreen: React.FC = () => {
// const router = useRouter()

// // const [username, setUsername] = React.useState('')
// const [nomUser, setNomUser] = React.useState('')
// const [mdpUser, setMdpUser] = React.useState('')
// const [username, setUsername] = React.useState('')
// const [isSubmitting, setIsSubmitting] = React.useState(false)

// const onSignUpPress = async () => {
//     setIsSubmitting(true);
//     console.log(
//         "nomUser", nomUser,
//         "mdpUser", mdpUser,
//         "isSubmitting", isSubmitting
//     )
//     try {
//         const newUser = await createUserAccount(
//             mdpUser,
//             username,
//             'User',
//             nomUser,
//         );

//         if (typeof newUser != 'undefined') {
//             tokenCache.saveToken('currentUser', newUser);
//             Alert.alert('Success', 'account created successfully');
//             console.log("from register: ", newUser)
//             router.replace('/accueil')
//         }
//     } catch (err: any) {
//         console.error(JSON.stringify(err, null, 2))
//     } finally {
//         setIsSubmitting(false);
//     }
// }


//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={{ flex: 1 }}
//         >
//             <SafeAreaView className="h-full ">
//                 <View className="px-4 justify-center flex-1">
//                     <View className="items-center mb-5 ">
//                         <Image
//                             source={require('../../assets/images/favicon.png')}
//                             resizeMode='contain'
//                             className="w-10 h-10 mb-4"
//                         />
//                         <Text className="text-3xl font-bold text-blue-600">Creer son compte !</Text>
//                     </View>
//                     <Text className="text-center mb-8 text-gray-600">
//                         Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
//                     </Text>
//                     <View className="mb-2">
//                         <Text className=" text-gray-700">Full name</Text>
//                         <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
//                             <Ionicons name="person" size={24} color="#2563eb" />
//                             <TextInput
//                                 className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
//                                 placeholder="Entrer votre nom"
//                                 value={nomUser}
//                                 onChangeText={(text: string) => setNomUser(text)}
//                                 keyboardType="email-address"
//                             />

//                         </View>
//                     </View>
//                     <View className="mb-4">
//                         <Text className="mb-2 text-gray-700">Adresse username</Text>
//                         <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
//                             <Ionicons name="mail" size={24} color="#2563eb" />
//                             <TextInput
//                                 className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
//                                 placeholder="Entrer votre adresse username"
//                                 value={username}
//                                 onChangeText={(text: string) => setUsername(text)}
//                                 keyboardType="email-address"
//                             />

//                         </View>
//                     </View>
//                     <View className="mb-4">
//                         <Text className="mb-2 text-gray-700">Mot de passe</Text>
//                         <FormField
//                             title={"Mot de passe"}
//                             value={mdpUser}
//                             placeholder="Enter your password"
//                             handleChangeText={(e: string) => setMdpUser(e)}
//                             inputStyle=" placeholder:text-gray-400 text-black-200"
//                         />
//                     </View>


//                     <TouchableOpacity className="mt-3">
//                         <Text className=" text-blue-600 mb-4 text-center font-semibold">Mot de passe oublié ?</Text>
//                     </TouchableOpacity>

//                 </View>

//                 <View
//                     className=' w-full rounded-tr-[40px] rounded-tl-[40px]'
//                 >
//                     <View

//                         style={{ borderTopRightRadius: 50, borderTopLeftRadius: 50 }}
//                         className=" h-fit w-full "
//                     >
//                         <Image source={require('../../assets/images/loggingImg.png')}
//                             resizeMode='cover' className="w-[100%] h-56 rounded-tr-[40px] rounded-tl-[40px]" />
//                         <View
//                             className='bg-transparent justify-center '
//                             style={{ position: 'absolute', top: 50, left: 80, }}
//                         >
//                             <TouchableOpacity
//                                 className="bg-blue-600 rounded-lg p-3 my-4"
//                                 onPress={onSignUpPress}
//                             >
//                                 <Text className="text-white text-center font-bold  ">CONNEXION</Text>
//                             </TouchableOpacity>
//                             <View className="flex-row justify-center items-center mt-2" >
//                                 <Text className=" text-primaryMuted font-extrabold">Vous n'avez pas de compte ? </Text>
//                                 <TouchableOpacity onPress={() => router.replace('/login')}>
//                                     <Text className="text-lg text-blue-600 font-extrabold">S'inscrire</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </View>

//                     {/* <View className=' h-[8vh] bg-black' /> */}
//                 </View>

//             </SafeAreaView>
//         </KeyboardAvoidingView>

//     );
// };

// export default LoginScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FormField from '@/components/form-field';
import { createUserAccount } from '@/lib/api';
import { tokenCache } from '@/store/persist-token-cache';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';

// Login Screen
const LoginScreen: React.FC = () => {
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
                mdpUser,
                username,
                'User',
                nomUser,
            );

            if (typeof newUser != 'undefined') {
                tokenCache.saveToken('currentUser', newUser);

                Alert.alert('Success', 'account created successfully');

                console.log("from register: ", newUser)
                setTimeout(() => {
                    router.replace('/login');
                }, 1000);
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="h-full">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="px-4 justify-center flex-1">
                        <View className="items-center mb-5 ">
                            <Image
                                source={require('../../assets/images/favicon.png')}
                                resizeMode='contain'
                                className="w-10 h-10 mb-4"
                            />
                            <Text className="text-3xl font-bold text-blue-600">Creer votre compte</Text>
                        </View>
                        <Text className="text-center mb-8 text-gray-600">
                            Veuillez saisir votre adresse e-mail et votre mot de passe pour vous connecter
                        </Text>
                        <View className="mb-2">
                            <Text className=" text-gray-700">Full name</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                                <Ionicons name="person" size={24} color="#2563eb" />
                                <TextInput
                                    className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
                                    placeholder="Entrer votre nom"
                                    value={nomUser}
                                    onChangeText={(text: string) => setNomUser(text)}
                                    keyboardType="email-address"
                                />

                            </View>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">username</Text>
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
                                value={mdpUser}
                                placeholder="Entrez votre mot de passe"
                                handleChangeText={(e: string) => setMdpUser(e)}
                                inputStyle="placeholder:text-gray-400 text-black-200"
                            />
                        </View>
                        <TouchableOpacity className="mt-3">
                            <Text className=" text-blue-600 mb-4 text-center font-semibold">Mot de passe oublié ?</Text>
                        </TouchableOpacity>
                    </View>
                    <View className='w-full h-80 rounded-tr-[40px] rounded-tl-[40px]'>
                        <Image source={require('../../assets/images/logo_image.png')}
                            resizeMode='cover' className="w-[100%] h-80 rounded-tr-[40px] rounded-tl-[40px]" />
                        <View
                            className='bg-transparent justify-center'
                            style={{ position: 'absolute', top: 50, left: 80 }}
                        >
                            <TouchableOpacity
                                className="bg-blue-600 rounded-lg p-3 my-4"
                                onPress={onSignUpPress}
                            >
                                {isSubmitting ? <ActivityIndicator size="large" color={Colors.primary} /> : <Text className="text-white text-center font-bold">CONNEXION</Text>}
                            </TouchableOpacity>
                            <View className="flex-row justify-center items-center mt-2">
                                <Text className=" text-primaryMuted font-extrabold">Vous n'avez pas de compte ? </Text>
                                <TouchableOpacity onPress={() => router.replace('/register')}>
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
