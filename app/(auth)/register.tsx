
// import * as React from 'react'
// import { TextInput, Button, View, ScrollView, Text } from 'react-native'
// import { useSignUp } from '@clerk/clerk-expo'
// import { useRouter } from 'expo-router'
// import { SafeAreaView } from "react-native-safe-area-context";
// //constants
// import { images } from "../../constants";

// // local components
// import FormField from "../../components/form-field";
// import CustomButton from "../../components/custom-button";
// import { Link, router } from "expo-router";

// export default function SignUpScreen() {
//     const { isLoaded, signUp, setActive } = useSignUp()
//     const router = useRouter()

//     // const [username, setUsername] = React.useState('')
//     const [emailAddress, setEmailAddress] = React.useState('')
//     const [password, setPassword] = React.useState('')
//     const [pendingVerification, setPendingVerification] = React.useState(false)
//     const [code, setCode] = React.useState('')
//     const [isSubmitting, setIsSubmitting] = React.useState(false)

//     const onSignUpPress = async () => {
//         if (!isLoaded) {
//             return
//         }
//         console.log("emailAddress", emailAddress, "password", password)
//         try {
//             await signUp.create({
//                 emailAddress,
//                 password,
//             })

//             await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

//             setPendingVerification(true)
//         } catch (err: any) {
//             // See https://clerk.com/docs/custom-flows/error-handling
//             // for more info on error handling
//             console.error(JSON.stringify(err, null, 2))
//         }
//     }

//     const onPressVerify = async () => {
//         if (!isLoaded) {
//             return
//         }

//         try {
//             const completeSignUp = await signUp.attemptEmailAddressVerification({
//                 code,
//             })

//             if (completeSignUp.status === 'complete') {
//                 await setActive({ session: completeSignUp.createdSessionId })
//                 router.replace('/home')
//             } else {
//                 console.error(JSON.stringify(completeSignUp, null, 2))
//                 router.replace('/')
//             }
//         } catch (err: any) {
//             // See https://clerk.com/docs/custom-flows/error-handling
//             // for more info on error handling
//             console.error(JSON.stringify(err, null, 2))
//         }
//     }

//     return (
//         <SafeAreaView className="h-full p-2">
//             <ScrollView>
//                 <View className="w-full justify-center  px-4 my-6">
//                     {!pendingVerification && (
//                         <>
//                             <FormField
//                                 title={"Email"}
//                                 value={emailAddress}
//                                 placeholder="Enter your username"
//                                 handleChangeText={(email: string) => setEmailAddress(email)}
//                                 inputStyle="mt-10"
//                             />
//                             <FormField
//                                 title={"Password"}
//                                 value={password}
//                                 placeholder="Enter your password"
//                                 handleChangeText={(pass: string) => setPassword(pass)}
//                                 inputStyle="mt-7"
//                             />
//                             <CustomButton
//                                 title="Sign Up"
//                                 handlePress={onSignUpPress}
//                                 isLoading={isSubmitting}
//                                 containerStyles="my-6 bg-black  rounded-xl min-h-[62px] justify-center items-center p-4"
//                                 textStyles='text-white font-bold text-xl '
//                             />
//                             <View className="flex-row justify-center items-center my-10 gap-2">
//                                 <Text className="text-lg text-gray-700 font-pregular">
//                                     Have an account already?
//                                 </Text>
//                                 <Link
//                                     href="/sign-in"
//                                     className="text-lg font-psemibold text-blue-700"
//                                 >
//                                     Sign In
//                                 </Link>
//                             </View>
//                         </>
//                     )}
//                     {pendingVerification && (
//                         <>
//                             <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
//                             <Button title="Verify Email" onPress={onPressVerify} />
//                         </>
//                     )}
//                 </View>
//             </ScrollView>

//         </SafeAreaView>
//     )
// }



import * as React from 'react'
import { TextInput, Button, View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";

// local components
import FormField from "../../components/form-field";
import CustomButton from "../../components/custom-button";
import { Link, router } from "expo-router";
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    // const [username, setUsername] = React.useState('')
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }
        console.log("emailAddress", emailAddress, "password", password)
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.replace('/accueil')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
                router.replace('/')
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <SafeAreaView className="h-full p-2">
            <ScrollView>
                <View className="w-full justify-center  px-4 my-6">
                    <View className="items-center mb-8 ">
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
                    {!pendingVerification && (
                        <View>
                            {/* <FormField
                                title={"Email"}
                                value={emailAddress}
                                placeholder="Enter your username"
                                handleChangeText={(email: string) => setEmailAddress(email)}
                                inputStyle="mt-7"

                            />
                            <FormField
                                title={"Password"}
                                value={password}
                                placeholder="Enter your password"
                                handleChangeText={(pass: string) => setPassword(pass)}
                                inputStyle="mt-7"
                            /> */}
                            <View className="h-auto justify-center  p-4 flex-1">
                                <View className="mb-4">
                                    <Text className="mb-2 text-gray-700">Adresse email</Text>
                                    <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                                        <Ionicons name="mail" size={24} color="#2563eb" />
                                        <TextInput
                                            className="flex-1 ml-2 placeholder:text-gray-200"
                                            placeholder="Entrer votre adresse email"
                                            value={emailAddress}
                                            onChangeText={(text) => setEmailAddress(text)}
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
                            <View style={{ flex: 1, position: "relative", width: "100%" }}>
                                <View className="flex-1 z-10">
                                    <Image
                                        source={require('../../assets/images/loggingImg.png')}
                                        style={{
                                            flex: 1, width: " 100 %", height: "100 %",
                                            borderTopRightRadius: 50, borderTopLeftRadius: 50
                                        }}
                                    />
                                    <View
                                        className='bg-transparent'
                                    // style={{ position: 'absolute', top: 20, left: 20, }}
                                    >
                                        <TouchableOpacity
                                            className="bg-blue-400 rounded-lg p-3 my-4"
                                            onPress={onSignUpPress}
                                        >
                                            <Text className="text-gray-500 text-center font-bold ">CONNEXION</Text>
                                        </TouchableOpacity>
                                        <View className="flex-row justify-center items-center mt-2" >
                                            <Text className="  text-muted ">Vous n'avez pas de compte ? </Text>
                                            <TouchableOpacity>
                                                <Text className="text-lg text-blue-700 font-extrabold">S'inscrire</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                {/* <View className=' h-[10vh] bg-black' /> */}

                                {/* </View> */}
                            </View>
                            {/* <CustomButton
                                title="Sign Up"
                                handlePress={onSignUpPress}
                                isLoading={isSubmitting}
                                containerStyles="my-6 bg-black  rounded-xl min-h-[62px] justify-center items-center p-4"
                                textStyles='text-white font-bold text-xl '
                            /> */}
                            {/* <View className="flex-row justify-center items-center my-10 gap-2">
                                <Text className="text-lg text-gray-700 font-pregular">
                                    Have an account already?
                                </Text>
                                <Link
                                    href="/sign-in"
                                    className="text-lg font-psemibold text-blue-700"
                                >
                                    Sign In
                                </Link>
                            </View> */}
                        </View >
                    )}

                    {pendingVerification && (
                        <>
                            <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
                            <Button title="Verify Email" onPress={onPressVerify} />
                        </>
                    )}
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}