
import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import useUserGlobal from '@/hooks/use-user-hook';
import LoginScreen from './(auth)/login';

const IndexPage = () => {

    return <LoginScreen />
}

export default IndexPage;
