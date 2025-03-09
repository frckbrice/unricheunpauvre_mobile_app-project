

// import PublicationPost from '@/components/publication/post';
// import { getSingleResource } from '@/lib/api';
// import { useQuery } from '@tanstack/react-query';
// import { useLocalSearchParams } from 'expo-router';
// import React, { useCallback } from 'react';
// import { ActivityIndicator, View, Text } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';


// const PublicationPostDetails = () => {
//     const { id } = useLocalSearchParams();


//     const fetchPost = useCallback(async () => {
//         if (!id) {
//             return console.error("No publication id provided.");
//         }
//         try {
//             const response = await getSingleResource('publications', id as string);
//             return response;
//         } catch (error) {
//             console.error('Error fetching post:', error);
//         }
//     }, [id]);

//     const { data: post, isLoading: isFetching, error } = useQuery({

//         queryKey: ['publication', id],
//         queryFn: fetchPost,
//         enabled: !!id,
//         staleTime: Infinity, // set staleTime to Infinity to disable refetching after staleTime
//         refetchOnMount: true, // refetch when the component mounts
//         refetchOnWindowFocus: false, // disable refetching on window focus (when the use come back again)
//         refetchOnReconnect: false, // disable refetching on reconnect
//     })


//     if (error) {
//         return (
//             <SafeAreaView className="flex-1 bg-gray-800">
//                 <View className="flex-1 items-center justify-center p-4">
//                     <Text className="text-red-500 text-center">{error?.message}</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     if (isFetching || !post) {
//         return (
//             <SafeAreaView className="flex-1 bg-gray-800">
//                 <View className="flex-1 items-center justify-center">
//                     <ActivityIndicator size="large" color="white" />
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <View className="flex-1 bg-red-500 dark:bg-gray-800">
//             <PublicationPost post={post} isPostDetail={true} />
//         </View>
//     );
// };

// export default PublicationPostDetails;

import PublicationPost from '@/components/publication/post';
import { getSingleResource } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, View, Text, ScrollView, RefreshControl, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const PublicationPostDetails = () => {
    const { id } = useLocalSearchParams();
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchPost = useCallback(async () => {
        if (!id) {
            throw new Error("No publication ID provided");
        }
        try {
            const response = await getSingleResource('publications', id as string);
            return response;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    }, [id]);

    const {
        data: post,
        isLoading: isFetching,
        error,
        refetch
    } = useQuery({
        queryKey: ['publication', id],
        queryFn: fetchPost,
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes instead of Infinity for better UX
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true, // Enable for better mobile experience
    });

    // Refresh when screen comes into focus (important for mobile navigation)
    useFocusEffect(
        useCallback(() => {
            if (id) {
                refetch();
            }
            return () => { };
        }, [id, refetch])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetch();
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    // Handle platform-specific status bar
    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('#1f2937'); // dark gray for dark mode
            StatusBar.setBarStyle('light-content');
        }
    }, []);

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#1f2937' }} edges={['top', 'left', 'right']}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
                    }
                >
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#ef4444', textAlign: 'center', fontSize: 16 }}>
                            {error?.message || "An error occurred while loading the post"}
                        </Text>
                        <Text
                            style={{
                                color: '#ffffff',
                                marginTop: 12,
                                textAlign: 'center',
                                padding: 10,
                                backgroundColor: '#374151',
                                borderRadius: 8
                            }}
                            onPress={onRefresh}
                        >
                            Tap to try again
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (isFetching || !post) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#1f2937' }} edges={['top', 'left', 'right']}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{ color: '#d1d5db', marginTop: 12 }}>Loading publication...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#1f2937' }} >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
                }
            >
                <PublicationPost post={post} isPostDetail={true} />
            </ScrollView>
        </View>
    );
};

export default PublicationPostDetails;