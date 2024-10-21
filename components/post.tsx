import {
    View, Text,
    TouchableOpacity, Alert, FlatList
} from 'react-native'
import React, { useState } from 'react';
import { Jaime, Post } from '@/lib/types';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllResourcesById, updateResource, uploadResourceData } from '@/lib/api';
import { useUser } from '@clerk/clerk-expo';
import useApiOps from '@/hooks/use-api';
import CommentPost from './publication/comment';

type TPost = {
    post: Post;
}

const PublicationPost = ({ post }: TPost) => {

    const {
        data: initialLikes, // get all the likes for this pub, by its ID
        refetch,
        isLoading
    } = useApiOps<Jaime>(() => getAllResourcesById(
        'Jaime', post?.id) as Promise<Jaime[]>);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isliked, setIsliked] = useState(false);
    const [likes, setLikes] = useState(initialLikes?.length);

    const { user } = useUser();
    // write a logic to like a post
    const likePost = async () => {
        // no post, no like

        // Optimistically update the UI
        const newLikedState = !isliked;
        setIsliked(newLikedState);
        setLikes(likes + (newLikedState ? 1 : -1));

        if (!post.id || !isliked) return console.log("post must be liked or there should be a post for a like");
        const likeObj = {
            idPub: post?.id,
            idUser: Number(user?.id),
            libleJaime: "like this post",
            dateJaime: new Date(Date.now()).toISOString(),
        }

        try {
            const newLike = await uploadResourceData<Jaime>(likeObj, 'Jaime')
            if (newLike)
                Alert.alert('Sucess', 'Post liked');
            else return console.error("fail to like the the post.")
        } catch (error) {
            console.error("error liking post: ", error)
        }
    }

    // set ths pub as favorite
    const favoritePost = async () => {
        // no post, no like
        setIsFavorite(!isFavorite);
        if (!post.id || !isFavorite) return console.log("post must be favorite");

        const pubObj = {
            idPub: post.id,
            idUser: Number(user?.id),
            favories: isFavorite
        }

        try {
            const newLike = await updateResource('Publication', post?.id, pubObj)
            if (newLike)
                Alert.alert('Sucess', 'Post favored');
            else return console.error("fail to set post favorite.")
        } catch (error) {
            console.error("error liking post: ", error)
        }
    }

    // comment a post
    const commentPost = async () => {
        // no post , no comment
        if (!post?.id) return console.log("there is no pub for this comment.");
        const commentObj = {
            idPub: post.id,
            idUser: Number(user?.id),
            etatCom: false,
            libeleCom: "comment this post",
            dateCom: new Date(Date.now()).toISOString(),
        }
    }

    // realise a pub, through a pop-pup communication presentation
    const realisePub = async () => {
        // no post , no comment
        if (!post.id) return;

    }
    // contribute to a post, open a paypal payment SDK
    const contributeToPub = async () => {
        // no post , no comment
        if (!post.id) return;

    }
    console.log("isFavorite: ", isFavorite)
    return (
        <>
            <View className="flex-row items-center mb-1 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl">
                <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }}
                    className="w-10 h-10 rounded-full mr-2"
                />
                <View className='flex justify-center items-center'>
                    <Text className="text-white font-medium">{post.author}</Text>
                    <Text className="text-gray-400 text-xs">{post.location}</Text>
                </View>
                <Text className="text-gray-400 text-sm ml-auto">{post.timeAgo}</Text>
            </View>
            <View className="bg-gray-800 rounded-lg rounded-tl-none  rounded-tr-none p-4 mb-4">

                <Text className="text-white mb-2">
                    {post.content}
                </Text>
                <Image source={post.imageUrl ? { uri: post.imageUrl } : require('../assets/images/appdonateimg.jpg')} className="w-full h-48 rounded-lg mb-2" />
                <View className="flex-row justify-between">
                    <TouchableOpacity
                        className="bg-gray-900 px-4 py-1 rounded-3xl
                         border-blue-400 border-2"
                        onPress={realisePub}
                    >

                        <Text className="text-white text-[12px]">Réaliser</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-gray-900 px-4 py-1 rounded-3xl
                         border-blue-400 border-2"
                        onPress={contributeToPub}
                    >
                        <Text className="text-white text-[12px]">Contribuer</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center mt-2 px-2 py-1 bg-white rounded-2xl justify-between">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={commentPost}
                            className="flex flex-row items-center
                             bg-gray-300 p-2 py-1 rounded-full justify-center"
                        >
                            <Ionicons name="chatbox-ellipses" size={25} color="gray" />
                            <Text className="text-black ml-1 mr-4">{post?.comments?.length ? post.comments.length : 0}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={likePost}
                            className="flex flex-row items-center bg-gray-300 p-2 py-0.5 rounded-full justify-center"
                        >
                            <Image source={require('../assets/images/heart.png')} className="w-8 h-8" />
                            <Text className="text-black ml-0.5">{likes ? likes : 0}</Text>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity
                        className="flex bg-blue-300 rounded-full p-1 justify-center items-center"
                        onPress={favoritePost}
                    >
                        {isFavorite ?
                            <Image source={require('../assets/images/heart.png')} className="w-7 h-7" />
                            :
                            <Ionicons name="heart" size={22} color="white" />}
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={post?.comments}
                    renderItem={({ item: comment }) => (
                        <CommentPost comment={comment} />
                    )}
                    keyExtractor={(item) => item?.idCom.toString()}

                />
            </View>
        </>

    )
}

export default PublicationPost;
