
import React from 'react'
import LoginScreen from './(auth)/login';
import useUserGlobal from '@/hooks/use-user-hook';
import { useRouter } from 'expo-router';

const IndexPage = () => {
    const { currentUser } = useUserGlobal();
    const router = useRouter();

    console.log("inside index page: currentUser: ", currentUser);

    if (currentUser && currentUser?.name) {
        setTimeout(() => {
            router.push('/(tabulate)/accueil');
        }, 2000);
    }

    return <LoginScreen />
}

export default IndexPage;

/**
 * @gorhom/bottom-sheet
react-i18next
i18next": "20.2.1",
geolib

 */