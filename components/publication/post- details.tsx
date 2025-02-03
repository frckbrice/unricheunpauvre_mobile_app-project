import PublicationPost from '@/components/post';
import { getSingleResource } from '@/lib/api';
import { Post } from '@/lib/types';
import { useLocalSearchParams, usePathname, } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const PublicationPostDetails = () => {

    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<Post | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    React.useEffect(() => {
        fetchPost();
    }, [id]);


    const fetchPost = useCallback(async () => {
        if (!id) return;
        setIsFetching(true);
        try {
            const response = await getSingleResource('publications', id as string);
            console.log('\n\n fetched post details:', response);
            setPost(response);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setIsFetching(false);
        }
    }, []);

    if (!post)
        return console.log('Aucun rêve trouvé');

    // display activity indicator
    if (isFetching)
        return (
            <View className='bg-gray-900 items-center justify-center '>
                <ActivityIndicator size="small" color={'white'} />
            </View>
        );

    return (<SafeAreaView className="h-full bg-gray-900">
        <PublicationPost post={post as Post} isPostDetail={true} />

    </SafeAreaView>
    );
};

export default PublicationPostDetails;
