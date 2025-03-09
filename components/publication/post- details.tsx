

// import PublicationPost from '@/components/publication/post';
// import { getSingleResource } from '@/lib/api';
// import { Post } from '@/lib/types';
// import { useLocalSearchParams } from 'expo-router';
// import React, { useCallback, useState } from 'react';
// import { ActivityIndicator, View, Text } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const PublicationPostDetails = () => {
//     const { id } = useLocalSearchParams();
//     const [post, setPost] = useState<Post | null>(null);
//     const [isFetching, setIsFetching] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const fetchPost = useCallback(async () => {
//         if (!id) {
//             setError("Aucun identifiant de rêve fourni");
//             return;
//         }

//         setIsFetching(true);
//         setError(null);

//         try {
//             const response = await getSingleResource('publications', id as string);
//             setPost(response);
//         } catch (error) {
//             console.error('Error fetching post:', error);
//             setError("Erreur de chargement du rêve. Veuillez réessayer.");
//         } finally {
//             setIsFetching(false);
//         }
//     }, [id]);

//     React.useEffect(() => {
//         fetchPost();
//     }, [fetchPost]);

//     if (error) {
//         return (
//             <SafeAreaView className="flex-1 bg-white">
//                 <View className="flex-1 items-center justify-center p-4">
//                     <Text className="text-red-500 text-center">{error}</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     if (isFetching || !post) {
//         return (
//             <SafeAreaView className="flex-1 bg-white">
//                 <View className="flex-1 items-center justify-center">
//                     <ActivityIndicator size="large" color="#0000ff" />
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView className="flex-1 bg-gray-800">
//             <PublicationPost post={post} isPostDetail={true} />
//         </SafeAreaView>
//     );
// };

// export default PublicationPostDetails;



import PublicationPost from '@/components/publication/post';
import { getSingleResource } from '@/lib/api';
import { Post } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { isLoading } from 'expo-font';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';





const PublicationPostDetails = () => {
    const { id } = useLocalSearchParams();


    const fetchPost = useCallback(async () => {
        if (!id) {
            return console.error("No publication id provided.");
        }
        try {
            const response = await getSingleResource('publications', id as string);
            return response;
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }, [id]);

    const { data: post, isLoading: isFetching, error } = useQuery({

        queryKey: ['publication', id],
        queryFn: fetchPost,
        enabled: !!id,
        staleTime: Infinity, // set staleTime to Infinity to disable refetching after staleTime
        refetchOnMount: true, // refetch when the component mounts
        refetchOnWindowFocus: false, // disable refetching on window focus (when the use come back again)
        refetchOnReconnect: false, // disable refetching on reconnect
    })


    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center p-4">
                    <Text className="text-red-500 text-center">{error?.message}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isFetching || !post) {
        return (
            <SafeAreaView className="flex-1 bg-gray-800">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="white" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-800">
            <PublicationPost post={post} isPostDetail={true} />
        </SafeAreaView>
    );
};

export default PublicationPostDetails;