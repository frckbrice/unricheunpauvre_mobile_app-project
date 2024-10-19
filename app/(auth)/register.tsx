
import * as React from 'react'
import { TextInput, Button, View, ScrollView, Text } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";
//constants
import { images } from "../../constants";

// local components
import FormField from "../../components/form-field";
import CustomButton from "../../components/custom-button";
import { Link, router } from "expo-router";

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
                router.replace('/home')
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
                    {!pendingVerification && (
                        <>
                            <FormField
                                title={"Email"}
                                value={emailAddress}
                                placeholder="Enter your username"
                                handleChangeText={(email: string) => setEmailAddress(email)}
                                inputStyle="mt-10"
                            />
                            <FormField
                                title={"Password"}
                                value={password}
                                placeholder="Enter your password"
                                handleChangeText={(pass: string) => setPassword(pass)}
                                inputStyle="mt-7"
                            />
                            <CustomButton
                                title="Sign Up"
                                handlePress={onSignUpPress}
                                isLoading={isSubmitting}
                                containerStyles="my-6 bg-black  rounded-xl min-h-[62px] justify-center items-center p-4"
                                textStyles='text-white font-bold text-xl '
                            />
                            <View className="flex-row justify-center items-center my-10 gap-2">
                                <Text className="text-lg text-gray-700 font-pregular">
                                    Have an account already?
                                </Text>
                                <Link
                                    href="/sign-in"
                                    className="text-lg font-psemibold text-blue-700"
                                >
                                    Sign In
                                </Link>
                            </View>
                        </>
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