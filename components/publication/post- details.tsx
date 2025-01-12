import {
    View, Text,
    ScrollView, ActivityIndicator,
    Image, TouchableOpacity
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Comment, Jaime, Post, User } from '@/lib/types'
import { getAllResourcesByTarget, getSingleResource, uploadResourceData } from '@/lib/api'
import { Colors } from '@/constants'
import { formatTimeAgo } from '@/lib/api'
import { Ionicons } from '@expo/vector-icons'

import useUserGlobal from '@/hooks/use-user-hook'
import * as SecureStore from 'expo-secure-store'
import { EnhancedCommentSection, ExtendedComment } from '../custom-comment-components'
import { SafeAreaView } from 'react-native-safe-area-context'

const PostDetails = () => {
    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<Post | null>(null);
    const [postAuthor, setPostAuthor] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isliked, setIsLiked] = useState(false);
    const { currentUser } = useUserGlobal();


    console.log("\n\n from post detail id: ", id)
    // Fetch post details
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const fetchedPost = await getSingleResource('Publication', Number(id));
                setPost(fetchedPost);

                if (fetchedPost?.idUser) {
                    const author = await getSingleResource('User', fetchedPost.idUser);
                    setPostAuthor(author);
                }

                // Fetch likes and comments
                const [fetchedLikes, fetchedComments] = await Promise.all([
                    getAllResourcesByTarget('Jaime', Number(id), 'idPub'),
                    getAllResourcesByTarget('Commentaire', Number(id), 'idPub')
                ]);

                setLikes(fetchedLikes?.length || 0);
                setComments(fetchedComments || []);
            } catch (error) {
                console.error('Error fetching post details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPostDetails();
        }
    }, [id]);

    const handleLike = useCallback(async () => {
        if (!post?.id || !currentUser?.IdUser) return;

        const newLikedState = !isliked;
        setIsLiked(newLikedState);
        setLikes(prev => prev + (newLikedState ? 1 : -1));

        if (newLikedState) {
            const likeObj = {
                idPub: post.id,
                idUser: Number(currentUser.IdUser),
                libleJaime: "I like this post",
                dateJaime: new Date().toISOString(),
            };

            try {
                await uploadResourceData(likeObj, 'Jaime');
            } catch (error) {
                console.error('Error liking post:', error);
                // Revert optimistic update on error
                setIsLiked(!newLikedState);
                setLikes(prev => prev - 1);
            }
        }
    }, [post?.id, isliked, currentUser]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!post) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-600">Aucun rêve publié</Text>
            </View>
        );
    }

    return (
        // <SafeAreaView>
        <ScrollView className="flex-1 bg-gray-900">
            <View className="p-4">
                {/* Author Header */}
                <View className="flex-row items-center mb-4">
                    <Image
                        source={{
                            uri: postAuthor?.photoUser || 'https://via.placeholder.com/40'
                        }}
                        className="w-12 h-12 rounded-full mr-3"
                    />
                    <View>
                        <Text className="text-white font-semibold text-lg">
                            {postAuthor?.nomUser?.includes('@')
                                ? postAuthor?.nomUser?.split('@')[0]
                                : postAuthor?.nomUser}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                            {formatTimeAgo(new Date(post.timeAgo))}
                        </Text>
                    </View>
                </View>

                {/* Post Content */}
                <View className="bg-gray-800 rounded-xl p-4 mb-4">
                    <Text className="text-white text-base mb-4">
                        {post.content}
                    </Text>
                    {post.imageUrl && (
                        <Image
                            source={{ uri: post.imageUrl }}
                            className="w-full h-72 rounded-lg mb-4"
                            resizeMode="cover"
                        />
                    )}

                    {/* Engagement Stats */}
                    <View className="flex-row items-center justify-between mt-4 pb-2 border-b border-gray-700">
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={handleLike}
                                className="flex-row items-center mr-6"
                            >
                                <Ionicons
                                    name={isliked ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isliked ? Colors.primary : "white"}
                                />
                                <Text className="text-white ml-2">{likes}</Text>
                            </TouchableOpacity>
                            <View className="flex-row items-center">
                                <Ionicons name="chatbox-outline" size={24} color="white" />
                                <Text className="text-white ml-2">{comments.length}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-full"
                            onPress={() => {/* Handle contribute */ }}
                        >
                            <Text className="text-white font-medium">Contribuer</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Comments Section */}
                <View className="mt-4">
                    <Text className="text-white text-lg font-semibold mb-4">Commentaires</Text>
                    <EnhancedCommentSection
                        post={post}
                        currentUser={currentUser}
                        onAddComment={async (newComment) => {
                            try {
                                const result = await uploadResourceData(newComment, 'Commentaire');
                                if (result) {
                                    setComments(prev => [result as Comment, ...prev]);
                                }
                                return result;
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
                                if (result) {
                                    // Update comments locally
                                    setComments(prevComments => {
                                        return prevComments.map(comment => {
                                            if (comment.idCom === parentId) {
                                                return {
                                                    ...comment,
                                                    replies: [...(comment.replies || []), result as ExtendedComment]
                                                };
                                            }
                                            return comment;
                                        });
                                    });
                                }
                                return result;
                            } catch (error) {
                                console.error('Error adding reply:', error);
                                throw error;
                            }
                        }}
                        initialComments={comments}
                    />
                </View>
            </View>
        </ScrollView>
        // </SafeAreaView>
    );
};

export default PostDetails;