import {
    View, Text,
    TouchableOpacity, ScrollView, Alert, FlatList,
    ActivityIndicator
} from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Comment, Jaime, Post, User } from '@/lib/types';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllResourcesByTarget, getSingleResource, updateResource, uploadResourceData } from '@/lib/api';
import useApiOps from '@/hooks/use-api';
import CommentPost from './publication/comment';
import CommentInput from './publication/comment-input';
import useUserGlobal from '@/hooks/use-user-hook';
import { AppError } from '@/utils/error-class';
import { comments } from '@/constants/constants';
import { useRouter } from 'expo-router';

import * as SecureStore from 'expo-secure-store'
import { Colors } from '@/constants';
import { EnhancedCommentSection } from './custom-comment-components';

type TPost = {
    post: Post;
    postAuthor?: User | null;
}

const PublicationPost = ({ post }: TPost) => {

    const mounted = useRef(false);
    const {
        data: initialLikes, // get all the likes for this pub, by its ID
        refetch: refetchLikes,
        isLoading
    } = useApiOps<Jaime>(() => {
        return getAllResourcesByTarget(
            'Jaime', post?.id, 'idPub') as Promise<Jaime[]>

    });

    const {
        data: postAuthor,
        isLoading: isLoadingPostAuthor,
        refetch: refetchPostAuthor
    } = useApiOps<User>(() => {
        return getSingleResource('User', post?.idUser as number);
    });

    const [isFavorite, setIsFavorite] = useState(false);
    const [isliked, setIsliked] = useState(false);
    const [likes, setLikes] = useState(initialLikes?.length ?? 0);
    const [currentCom, setCurrentCom] = useState("");
    const [startComment, setStartComment] = useState<boolean>(false);

    const { currentUser } = useUserGlobal();
    const router = useRouter();




    console.log("currrent post author: ", postAuthor);

    useEffect(() => {
        if (!postAuthor)
            refetchPostAuthor();
        // store the cuurent post to the local store
        SecureStore.setItemAsync('post', JSON.stringify(post));

        // store the post author to local store
        SecureStore.setItemAsync('postAuthor', JSON.stringify(postAuthor));
    }, [post]);

    // write a logic to like a post
    const likePost = useCallback(async () => {

        // Optimistically update the UI
        const newLikedState = !isliked;
        setIsliked(newLikedState);
        setLikes(likes + (newLikedState ? 1 : -1));

        // no post, no like
        if (!post.id || !isliked || !currentUser) return console.log("post must be liked or there should be a post for a like");
        const likeObj = {
            idPub: post?.id,
            idUser: Number(currentUser?.IdUser),
            libleJaime: "I like this post",
            dateJaime: new Date(Date.now()).toISOString(),
        }
        console.log("post a like: ", likeObj)
        try {
            const newLike = await uploadResourceData<Jaime>(likeObj, 'Jaime')
            if (newLike)
                Alert.alert('Sucess', 'Post liked');
            else return console.error("fail to like the the post.")
        } catch (error) {
            console.error("error liking post: ", error)
        }
    }, [uploadResourceData, post?.id, isliked, currentUser])

    // set ths pub as favorite
    const favoritePost = useCallback(async () => {
        // no post, no like
        setIsFavorite(!isFavorite);
        if (!post.id || !isFavorite || !currentUser) return console.log("post must be favorite");

        const pubObj = {
            idPub: post.id,
            idUser: Number(currentUser?.IdUser),
            favories: isFavorite
        }

        try {
            const newLike = await updateResource('Publication', post?.id, pubObj)
            if (typeof newLike != 'undefined')
                refetchLikes();
            else return console.error("fail to set post favorite.")
        } catch (error) {
            console.error("error liking post: ", error)
        }
    }, [updateResource, post, isFavorite, currentUser]
    )

    // contribute to a post, open a paypal payment SDK
    const contributeToPub = async () => {
        // no post , no comment
        if (!post.id)
            return Alert.alert("there is no pub for this contribution.");
        else return router.push(`/contribute/${post?.id}`)
    }

    // commnet a post
    const handleAddComment = useCallback(async () => {

        // no post , no comment
        if (!post?.id) return console.log("there is no pub for this comment.");

        const newComment: Partial<Comment> = {
            idCom: comments.length + 1, // set the comment id as the length of the comments array + 1.
            idPub: post?.id,
            idUser: currentUser?.IdUser as number,
            dateCom: new Date(Date.now()).toISOString(),
            etatCom: false,
            libeleCom: currentCom, // set the current comment.
        }

        post?.comments.unshift(newComment as Comment);

        console.log("post is about to run comment: ", newComment)
        try {
            // upload a resource to comment table
            const newComt = await uploadResourceData(newComment, 'Commentaire');
            if (typeof newComt != 'undefined') {
                post?.comments.filter((com) => com.idCom !== post?.comments.length + 1)
                post?.comments.unshift(newComt as Comment);
            } else return console.error("fail to set post favorite.")

        } catch (error) {
            // console.error(` Failed to to comment the post with ID ${post?.id}: `, error);
            throw new Error(`failed to comment on post with Id ${post?.id}`);
        }

    }, [post?.comments, uploadResourceData, post?.id, currentCom, currentUser?.IdUser])


    // enable comment list
    const toggleComment = () => {
        setStartComment(!startComment)
    }

    return (
        <ScrollView className={'mb-5'}>
            <View className="flex-row items-center 
            mb-1 bg-gray-800 p-2  rounded-tl-xl rounded-tr-xl">
                <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }}
                    className="w-10 h-10 rounded-full mr-2"
                />
                <View className='flex justify-center items-center'>
                    <Text className="text-white font-medium">
                        {isLoadingPostAuthor ?
                            <ActivityIndicator size="large" color={Colors.primary} />
                            : postAuthor?.nomUser}
                    </Text>
                    <Text className="text-gray-400 text-xs">{post?.location}</Text>
                </View>
                <Text className="text-gray-400 text-xs ml-auto mr-2">{new Date(post?.timeAgo).toDateString()}</Text>
            </View>
            <View className="bg-gray-800 rounded-lg rounded-tl-none  rounded-tr-none p-4 mb-4">

                <Text className="text-white mb-2 text-[13px]">
                    {post?.content}
                </Text>
                <Image source={post.imageUrl ? { uri: post?.imageUrl } : require('../assets/images/appdonateimg.jpg')} className="w-full h-48 rounded-lg mb-2" />
                <View className="flex-row justify-end">

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
                            onPress={toggleComment}
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
                {/* {!!startComment && <View>
                    <CommentInput
                        currentCom={currentCom}
                        setCurrentCom={setCurrentCom}
                        handleAddComment={handleAddComment} />
                    <FlatList
                        initialNumToRender={3}

                        className='mt-1 overflow-scroll bg-red-400'
                        data={post?.comments}
                        renderItem={({ item: comment }) => (
                            <View className='bg-gray-800 space-y-2'>
                                <CommentPost comment={comment} />

                            </View>
                        )}
                        keyExtractor={(item) => item?.idCom.toString()}

                    />
                </View>} */}
                {/* {!!startComment && (
                    <EnhancedCommentSection
                        post={post}
                        currentUser={currentUser}
                        onAddComment={async (newComment: Partial<Comment>) => {
                            try {
                                const result = await uploadResourceData(newComment, 'Commentaire');
                                if (result)
                                    return result;
                            } catch (error) {
                                console.error('Error adding comment:', error);
                                throw error;
                            }
                        }}
                    />
                )} */}

                {!!startComment && (
                    <EnhancedCommentSection
                        post={post}
                        currentUser={currentUser}
                        onAddComment={async (newComment) => {
                            try {
                                const result = await uploadResourceData(newComment, 'Commentaire');
                                if (result) {
                                    // increase the number of comments by 1 (new created comment.)
                                    post?.comments?.unshift({
                                        idCom: comments.length + 1, // set the comment id as the length of the comments array + 1.
                                        idPub: result?.idPub as number,
                                        idUser: result?.idUser as number,
                                        dateCom: result?.dateCom as string,
                                        etatCom: result?.etatCom as boolean,
                                        libeleCom: result?.libeleCom as string, //   
                                    });
                                    return result;
                                }
                                return null;
                            } catch (error) {
                                console.error('Error adding comment:', error);
                                throw error;
                            }
                        }}
                        onAddReply={async (parentId, text) => {
                            try {
                                const replyData = {
                                    idPub: post.id,
                                    idUser: currentUser?.IdUser,
                                    parentId: parentId,
                                    libeleCom: text,
                                    dateCom: new Date().toISOString(),
                                    etatCom: false,
                                };
                                const result = await uploadResourceData(replyData, 'Commentaire');
                                return result;
                            } catch (error) {
                                console.error('Error adding reply:', error);
                                throw error;
                            }
                        }}
                    />
                )}

            </View>
        </ScrollView>

    )
}

export default memo(PublicationPost);
