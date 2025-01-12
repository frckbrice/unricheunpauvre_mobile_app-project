import {
    View, Text,
    TouchableOpacity, ScrollView, Alert,
    ActivityIndicator, Modal
} from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Comment, Jaime, Post, User } from '@/lib/types';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTimeAgo, getAllResourcesByTarget, getSingleResource, updateResource, uploadResourceData } from '@/lib/api';
import useApiOps from '@/hooks/use-api';
import useUserGlobal from '@/hooks/use-user-hook';

import { useRouter } from 'expo-router';

import * as SecureStore from 'expo-secure-store'
import { Colors } from '@/constants';
import { EnhancedCommentSection, ExtendedComment } from './custom-comment-components';

import Share from 'react-native-share';
import { ProfileClickArea, ProfileModal } from './profile/components/profile-details';
import { MenuOverlay } from './publication/menu-overlay';

type TPost = {
    post: Post;
    postAuthor?: User | null;
}

const PublicationPost = ({ post }: TPost) => {

    const mounted = useRef(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const {
        data: postAuthor,
        isLoading: isLoadingPostAuthor,
        refetch: refetchPostAuthor
    } = useApiOps<User>(() => {
        return getSingleResource('User', post?.idUser as number);
    });
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const menuButtonRef = useRef(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isliked, setIsliked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState(post?.comments || []);
    const [startComment, setStartComment] = useState<boolean>(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);


    const { currentUser } = useUserGlobal();
    const router = useRouter();

    const getALlCommentsForthisPub = useCallback(async () => {
        try {
            const allComments = await getAllResourcesByTarget(
                'Commentaire', post?.id, 'idPub') as ExtendedComment[];

            // Group comments by their parent
            const commentMap = new Map();
            const rootComments: ExtendedComment[] = [];

            allComments.forEach(comment => {
                const extendedComment: ExtendedComment = {
                    ...comment,
                    replies: comment.isReplied ? [] : undefined,
                    userName: '', // You might want to fetch username
                    photoUser: '', // You might want to fetch user photo
                };

                if (comment.idParent) {
                    // This is a reply
                    const parentComment = commentMap.get(comment.idParent);
                    if (parentComment) {
                        if (!parentComment.replies?.length) {
                            parentComment.replies = [];
                        }
                        parentComment.replies.push(extendedComment);
                        commentMap.set(comment.idParent, parentComment);
                    }
                } else {
                    // This is a root comment   
                    rootComments.push(extendedComment);
                    commentMap.set(comment.idCom, extendedComment);
                }
            });

            // Sort root comments by date (most recent first)
            rootComments.sort((a, b) =>
                new Date(b.dateCom).getTime() - new Date(a.dateCom).getTime()
            );

            // Store comments specifically for this publication
            await SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(rootComments));

            return rootComments;
        } catch (error) {
            console.error('Failed to get all comments:', error);
            return [];
        }
    }, [post?.id]);

    // Modify your existing useEffect to use this function
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const fetchedComments = await getALlCommentsForthisPub();
                console.log("\n\n root comments", fetchedComments);
                const filterCommentForCurrentPost = fetchedComments?.filter((c) => c.idPub === post?.id);
                setComments(filterCommentForCurrentPost || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
        getAllLikes();

        if (!postAuthor)
            refetchPostAuthor();

        // Store the current post to local store
        SecureStore.setItemAsync('post', JSON.stringify(post));
    }, [post]);


    const getAllLikes = useCallback(async () => {
        try {
            const allLikes = await getAllResourcesByTarget(
                'Jaime', post?.id, 'idPub') as Jaime[];
            // console.log("all likes: ", allLikes);
            const filterLikesForCurrentPost = allLikes?.filter((l) => l.idPub === post?.id);
            setLikes(filterLikesForCurrentPost?.length);
        } catch (error) {
            console.error('Failed to get all likes:', error);
        }
    }, [getAllResourcesByTarget, setLikes]);

    // console.log("\n\n initialLikes: ", likes);

    // write a logic to like a post
    const likePost = useCallback(async () => {

        // try {
        console.log('\n isliked: ', isliked)
        // Optimistically update the UI
        const newLikedState = !isliked;
        setIsliked(newLikedState);
        // increase/decrease the number of likes for this publication.
        setLikes(likes + (newLikedState ? 1 : -1));

        // no post, no like
        if (!post.id || !newLikedState || !currentUser?.IdUser)
            return console.error("post must be liked or there should be a post for a like", { postID: post?.id, isliked: newLikedState, currentUser });
        const likeObj = {
            idPub: post?.id,
            idUser: Number(currentUser?.IdUser),
            libleJaime: "I like this post",
            dateJaime: new Date(Date.now()).toISOString(),
        };
        console.log("post a like : ", likeObj)

        await uploadResourceData<Jaime>(likeObj, 'Jaime');
        setLikes(likes + 1);
        // if (newLike)
        //     Alert.alert('Sucess', 'Post liked');

        // } catch (error) {
        //     console.error("error liking post: ", error)
        // } finally {
        setIsliked(!isliked);
        // }
    }, [uploadResourceData, post?.id, isliked, currentUser])

    // set ths pub as favorite
    const favoritePost = useCallback(async () => {
        // no post, no like
        setIsFavorite(prev => !prev);
        // if (!isFavorite) {
        //     return console.error("The post should be favorite", { isFavorite });
        // }

        if (!post.id || !currentUser)
            return console.error("Post must exist or there should be a current user");

        const pubObj = {
            idPub: post.id,
            idUser: Number(currentUser?.IdUser),
            dateAjout: new Date(Date.now()).toISOString(),
        };

        console.log("\n\n favorite object: ", pubObj);

        try {
            const newLike = await uploadResourceData(pubObj, 'Favorie')
            if (typeof newLike != 'undefined')
                console.log("\n\n post set as favorite: ", newLike);
            else
                return console.error("fail to set post favorite.");
        } catch (error) {
            console.error("error liking post: ", error)
        } finally {
            setIsFavorite(false);
        }
    }, [updateResource, post, isFavorite, currentUser]
    );

    // contribute to a post, open a paypal payment SDK
    const contributeToPub = async () => {
        // no post , no comment
        if (!post.id)
            return Alert.alert("there is no pub for this contribution.");
        return router.push(`/contribute/${post?.id}`)
    }

    // Add menu toggle function
    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    // enable comment list
    const toggleComment = () => {
        setStartComment(!startComment)
    };




    // handle share function
    const handleShare = async () => {
        const shareOptions = {
            title: 'Partager cette publication',
            message: `${postAuthor?.nomUser} a partagé: ${post.content.substring(0, 50)}...`,
            url: post.imageUrl,
            type: 'image/*'
        };

        try {
            const result = await Share.open(shareOptions);
            console.log("\n\n result: " + result);
        } catch (error) {
            console.error('Error sharing:', error);
        } finally {
            setIsMenuVisible(false); // Close menu after sharing
        }
    };

    console.log("\n\n post", post)

    return (
        <ScrollView className={'mb-5'}>
            <View className="flex-row items-center mb-1 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl">
                {/* <Image source={{ uri: postAuthor?.photoUser || 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }}
                    className="w-10 h-10 rounded-full mr-2"
                />
                <View className='flex justify-center items-start'>
                    <Text className="text-white font-medium">
                        {isLoadingPostAuthor ?
                            <ActivityIndicator size="large" color={Colors.primary} />
                            : postAuthor?.nomUser?.includes('@') ?
                                postAuthor?.nomUser?.substring(0, postAuthor?.nomUser?.indexOf('@'))
                                : postAuthor?.nomUser}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                        {formatTimeAgo(new Date(post?.timeAgo))}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                        {post?.location}
                    </Text>
                </View> */}
                <ProfileClickArea
                    user={postAuthor}
                    onPress={() => setIsProfileModalVisible(true)}
                />
                {/* <View className="ml-auto mr-2">
                    <TouchableOpacity
                        onPress={toggleMenu}
                        className="p-2"
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>

                    
                    <Modal
                        visible={isMenuVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setIsMenuVisible(false)}
                    >
                        <TouchableOpacity
                            className="flex-1"
                            activeOpacity={1}
                            onPress={() => setIsMenuVisible(false)}
                        >
                            <View className="absolute top-12 right-4 bg-white rounded-lg shadow-lg">
                                <TouchableOpacity
                                    onPress={handleShare}
                                    className="flex-row items-center px-4 py-3"
                                >
                                    <Ionicons name="share-social-outline" size={20} color="black" />
                                    <Text className="ml-2 text-black">Partager</Text>
                                </TouchableOpacity>
                               
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View> */}
                <View className="ml-auto mr-2">
                    <TouchableOpacity
                        onPress={toggleMenu}
                        className="p-2"
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>

                    <MenuOverlay
                        isVisible={isMenuVisible}
                        onClose={() => setIsMenuVisible(false)}
                        onShare={handleShare}
                        onViewDetails={() => router.push(`/post/${post.id}`)}
                        post={post}
                    />
                </View>

                <ProfileModal
                    isVisible={isProfileModalVisible}
                    onClose={() => setIsProfileModalVisible(false)}
                    user={postAuthor}
                />
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
                            <Text className="text-black ml-1 mr-4">{comments?.length ? comments.length : 0}</Text>
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
                        {!isFavorite ?
                            <Ionicons name="heart" size={22} color="white" />
                            : <Image source={require('../assets/images/heart.png')} className="w-7 h-7" />
                        }
                    </TouchableOpacity>
                </View>
                {!!startComment && (
                    <EnhancedCommentSection
                        post={post}
                        currentUser={currentUser}
                        onAddComment={async (newComment) => {
                            try {
                                const result = await uploadResourceData(newComment, 'Commentaire');
                                if (result) {
                                    // Modify to only update comments for this specific publication
                                    const updatedComments = [
                                        {
                                            idCom: result?.idCom as number,
                                            idPub: result?.idPub as number,
                                            idUser: result?.idUser as number,
                                            dateCom: result?.dateCom as string,
                                            etatCom: result?.etatCom as boolean,
                                            libeleCom: result?.libeleCom as string,
                                        },
                                        ...comments
                                    ];

                                    // Update local storage for this specific publication
                                    await SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(updatedComments));

                                    setComments(updatedComments);
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
                                    idParent: parentId,
                                    libeleCom: text,
                                    dateCom: new Date().toISOString(),
                                    etatCom: false,
                                    isReplied: true
                                };
                                const result = await uploadResourceData(replyData, 'Commentaire');

                                // Update comments locally if reply is successful
                                if (result) {
                                    const updatedComments = comments.map(comment => {
                                        if (comment.idCom === parentId) {
                                            return {
                                                ...comment,
                                                replies: [
                                                    ...(comment.replies || []),
                                                    result as ExtendedComment
                                                ]
                                            };
                                        }
                                        return comment;
                                    });

                                    // Update local storage for this specific publication
                                    await SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(updatedComments));

                                    setComments(updatedComments);
                                }

                                return result;
                            } catch (error) {
                                console.error('Error adding reply:', error);
                                throw error;
                            }
                        }}
                        initialComments={comments}
                    />
                )}
            </View>
        </ScrollView>

    )
}

export default memo(PublicationPost);
