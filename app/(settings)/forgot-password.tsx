import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import useUserGlobal from '@/hooks/use-user-hook';
import { Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';


interface ForgotPasswordFormData {
  email: string;
}

// Profile Edit Screen
const ForgotPassword: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailStatus, setResetEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');



  const { currentUser } = useUserGlobal();

  const { control: forgotPasswordControl, handleSubmit: handleForgotPasswordSubmit, formState: { errors: forgotPasswordErrors } } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange'
  });

  const router = useRouter();



  const onForgotPasswordPress = async (data: ForgotPasswordFormData) => {
    setResetEmailStatus('loading');


    try {
      const res = await fetch(`https://unrichunpauvre-rest-api.onrender.com/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.email,
          // mdpUser: data.confirmPassword
        }),
      });

      if (!res.ok) {
        throw new Error('Password reset request failed');
      }

      setResetEmailStatus('success');
      Alert.alert(
        "Email envoyé",
        "Votre email de récupération de mot de passe a été envoyé avec succès.",
        // [{ text: "OK", onPress: () => setShowForgotPassword(false) }]
      );
    } catch (err) {
      console.error(err);
      setResetEmailStatus('error');
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de l'envoi de l'email'.",
        [{ text: "OK" }]
      );
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
            {/* <View className="items-center mb-5">
              <TouchableOpacity
                onPress={() => setShowForgotPassword(false)}
                className="self-start mb-4"
              >
                <Ionicons name="arrow-back" size={24} color="#2563eb" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-blue-600">Mot de passe oublié</Text>
            </View> */}
            <Text className="text-center mb-8 text-gray-600">
              Entrez votre adresse email pour reinitialiser votre compte
            </Text>

            <View className="mb-4">
              <Controller
                control={forgotPasswordControl}
                name="email"
                rules={{
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <View className={`flex-row items-center border rounded-lg p-2 
                                    ${forgotPasswordErrors.email ? 'border-red-500' : 'border-gray-300'}`}>
                    <Ionicons name="mail" size={24} color="#2563eb" />
                    <TextInput
                      className="flex-1 ml-2 text-black-200"
                      placeholder="Entrer votre email"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                )}
              />
              {forgotPasswordErrors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {forgotPasswordErrors.email.message}
                </Text>
              )}
            </View>


            <TouchableOpacity
              // className={`rounded-lg p-3 ${resetEmailStatus === 'loading' ? 'bg-blue-400' : 'bg-blue-600'}`}
              onPress={handleForgotPasswordSubmit(onForgotPasswordPress)}
              // disabled={resetEmailStatus === 'loading'}
              className={`rounded-lg p-3 ${getSubmitButtonStyle()}`}
              disabled={submitStatus === 'loading' || submitStatus === 'success'}
            >
              {resetEmailStatus === 'loading' ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center font-bold">ENVOYER</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}



export default ForgotPassword;

// https://play.google.com/store/apps/details?id=com.senima.senwisetool