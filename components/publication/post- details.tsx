import PublicationPost from '@/components/post';
import { getSingleResource } from '@/lib/api';
import { Post } from '@/lib/types';
import { useLocalSearchParams, usePathname, } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const PublicationPostDetails = () => {

    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<Post | null>(null);

    React.useEffect(() => {
        fetchPost();
    }, [id]);


    const fetchPost = useCallback(async () => {
        if (!id) return;
        try {
            const response = await getSingleResource('publications', id as string);
            console.log('\n\n fetched post details:', response);
            setPost(response);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }, []);

    if (!post)
        return console.log('Post not found', id);

    return (<SafeAreaView className="flex-1 bg-gray-900">
        <PublicationPost post={post as Post} />

    </SafeAreaView>
    );
};

export default PublicationPostDetails;
