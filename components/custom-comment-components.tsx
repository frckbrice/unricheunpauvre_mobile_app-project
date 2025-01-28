
import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comment, User } from '@/lib/types';
import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import useApiOps from '@/hooks/use-api';
import { getResourceByItsId } from '@/lib/api';
import * as SecureStore from 'expo-secure-store'

// Extended Comment type to handle replies
export interface ExtendedComment extends Comment {
    replies?: ExtendedComment[];
    idParent?: string | null;
    userName?: string;
    photoUser?: string;
    replyToUser?: string;
    likes?: number;
    isReplied?: boolean;
    createdAt: string;
}

// Single Comment Component with Replies
const CommentItem = memo(({
    comment,
    currentUser,
    onReply,
    onLike,
    onAddReply,
    depth = 0,
    maxDepth = 3,
    commentDone
}: {
    comment: ExtendedComment;
    currentUser: any | null;
    onReply: (comment: ExtendedComment) => void;
    onLike: (commentId: string) => void;
    onAddReply: (idParent: string, text: string) => Promise<{ idPub: string; idUser: string; idParent: string; libeleCom: string; createdAt: string; etatCom: boolean; } | null>;
    depth?: number;
    maxDepth?: number;
    commentDone?: Partial<ExtendedComment> | null
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [commentAuthor, setCommentAuthor] = useState<User | null>(null)

    const { // fetch the author of parent comment.
        data: commentDoneUser
    } = useApiOps(() => getResourceByItsId(commentDone?.idUser as string, "users", "CommentItem"));

    useEffect(() => {
        if (commentDoneUser) {
            setCommentAuthor(commentDoneUser)
        }
    }, [commentDone])

    const handleLike = () => {
        setIsLiked(!isLiked);
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start();
        onLike(comment?.id as string);
    };

    const handleReplyPress = () => {
        setIsReplying(true);
        onReply(comment);
    };

    const handleSubmitReply = async () => {
        if (!replyText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAddReply(comment?.id as string, replyText);
            setReplyText('');
            setIsReplying(false);
            setShowReplies(true);
        } catch (error) {
            Alert.alert('Erreur', 'Failed to add reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log("inside the comment Item: currentUser: ", currentUser)
    console.log("inside the comment Item: the current commment: ", comment)

    return (
        <View className={`flex-row mb-2 ${depth > 0 ? 'ml-8' : ''}`}>
            <Image
                source={{ uri: currentUser?.photoUser || 'https://via.placeholder.com/40' }}
                className="w-8 h-8 rounded-full mr-2"
            />
            {/* comment input */}
            <View className="flex-1">
                <View className="bg-gray-700 rounded-2xl px-3 py-2">
                    <Text className="text-gray-400 font-medium text-[11px]">
                        {currentUser?.nomUser || 'User'}
                    </Text>
                    {comment?.replyToUser && (
                        <Text className="text-blue-400 text-xs mb-1">
                            Répondre à @{commentAuthor?.nomUser ?? 'auteur du commentaire'}
                        </Text>
                    )}
                    <Text className="text-white text-sm mt-1">{comment?.libeleCom}</Text>
                </View>

                {/* comment section icons: like and rely */}
                <View className="flex-row items-center mt-1 ml-2 space-x-4">
                    <TouchableOpacity
                        onPress={handleLike}
                        className="flex-row items-center space-x-1"
                    >
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={16}
                                color={isLiked ? "#EF4444" : "#9CA3AF"}
                            />
                        </Animated.View>
                        <Text className={`text-xs ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                            {(comment?.likes || 0) + (isLiked ? 1 : 0)}
                        </Text>
                    </TouchableOpacity>
                    {depth < maxDepth && (
                        <TouchableOpacity
                            onPress={handleReplyPress}
                            className="flex-row items-center space-x-1"
                        >
                            <Ionicons name="chatbubble-outline" size={16} color="#9CA3AF" />
                            <Text className="text-xs text-gray-400">Répondre</Text>
                        </TouchableOpacity>
                    )}
                    <Text className="text-xs text-gray-500">
                        {new Date(comment?.createdAt).toLocaleString()}
                    </Text>
                </View>

                {/* Reply and send Input and button */}
                {isReplying && (
                    <View className="mt-2">
                        <View className="flex-row items-center bg-gray-600 rounded-full px-3 py-1">
                            <TextInput
                                value={replyText}
                                onChangeText={setReplyText}
                                placeholder={`Répondre à${comment?.userName}...`}
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 text-white text-sm"
                            />
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#60A5FA" className="ml-2" />
                            ) : (
                                <TouchableOpacity
                                    onPress={handleSubmitReply}
                                    disabled={!replyText?.trim() || isSubmitting}
                                    className="ml-2"
                                >
                                    <Ionicons
                                        name="send"
                                        size={20}
                                        color={replyText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Nested Replies */}
                {comment?.replies && comment?.replies.length > 0 && (
                    <View className="mt-2">
                        {!showReplies ? (
                            <TouchableOpacity
                                onPress={() => setShowReplies(true)}
                                className="flex-row items-center"
                            >
                                <View className="w-8 h-0.5 bg-gray-600" />
                                <Text className="text-blue-400 text-sm ml-2">
                                    Voir {comment?.replies?.length} réponses
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View>
                                {comment?.replies.map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        currentUser={currentUser}
                                        onReply={onReply}
                                        onLike={onLike}
                                        onAddReply={onAddReply}
                                        depth={depth + 1}
                                        maxDepth={maxDepth}
                                    />
                                ))}
                                {comment?.replies.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => setShowReplies(false)}
                                        className="mt-1"
                                    >
                                        <Text className="text-blue-400 text-sm">cacher les réponses</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
});


const EnhancedCommentSection = memo(({
    post,
    currentUser,
    onAddComment,
    onAddReply,
    initialComments = []
}: {
    post: any;
    currentUser: JWTBody<JWTDefaultBody> | null;
    onAddComment: (comment: Partial<ExtendedComment>) => Promise<Partial<ExtendedComment> | null>;
    onAddReply: (idParent: string, text: string) => Promise<{ idPub: string; idUser: string; idParent: string; libeleCom: string; createdAt: string; etatCom: boolean; } | null>;
    initialComments?: ExtendedComment[];
}) => {
    const [comments, setComments] = useState<ExtendedComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<ExtendedComment | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // console.log("\n\n from EnhancedCommentSection current post: ", post);

    useEffect(() => {
        const loadComments = async () => {
            setIsLoading(true);
            try {
                // Retrieve comments specifically for this publication from local storage
                const storedComments = await SecureStore.getItemAsync(`comments-${post.id}`);
                if (storedComments) {
                    const parsedComments = JSON.parse(storedComments);
                    setComments(parsedComments);
                } else setIsLoading(false);
            } catch (error) {
                console.error('Error loading comments:', error);
            } finally {
                setIsLoading(false);
            }
        };
        console.log("\n\n from EnhancedCommentSection commentaires 3: ", initialComments);

        if (initialComments?.length || post?.comments) {
            console.log("\n\n incoming comments: ", post?.comments);
            setComments(initialComments ?? post?.comments);
        }
        else loadComments();


    }, [post.id]);


    const handleAddComment = useCallback(async () => {
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const newComment: Partial<ExtendedComment> = {
            idPub: post?.id || post?.idPub,
            idUser: currentUser?.userId as string,
            etatCom: false,
            libeleCom: commentText,
            createdAt: new Date(Date.now()).toISOString(),
            idParent: replyingTo?.id || null,
            isReplied: !!replyingTo
        };

        try {
            const result = await onAddComment(newComment);

            if (result) {
                const comment = {
                    idCom: result?.id as string,
                    idPub: result?.idPub as string,
                    idUser: result?.idUser as string,
                    createdAt: result?.createdAt as string,
                    etatCom: result?.etatCom as boolean,
                    libeleCom: result?.libeleCom as string,
                };
                // If it's a reply comment
                if (replyingTo) {
                    const updatedComments = comments.map(rootComment => {
                        if (rootComment.id === replyingTo.id) {
                            return {
                                ...rootComment,
                                replies: [
                                    ...(rootComment.replies || []),
                                    // comment as ExtendedComment
                                    comment
                                ]
                            };
                        }
                        return rootComment;
                    });

                    setComments(updatedComments);
                } else {
                    // If it's a new root comment
                    const updatedComments = [comment as ExtendedComment, ...comments];
                    setComments(updatedComments);
                }

                // Update local storage with publication-specific comments
                await SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(comments));
            }

            setCommentText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error', 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    }, [commentText, post?.id, currentUser, replyingTo, comments]);

    const handleReply = useCallback((comment: ExtendedComment) => {
        setReplyingTo(comment);
    }, []);

    const handleLike = useCallback((commentId: string) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likes: (comment.likes || 0) + 1
                };
            }
            return comment;
        });

        setComments(updatedComments);
        // Optionally update local storage
        SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(updatedComments));
    }, [comments, post.id]);

    // console.log("\n\n from EnhancedCommentSection post is: ", post.author);

    return (
        <View className="bg-gray-800 rounded-sm py-2">
            {/* Main Comment Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="mb-4"
            >
                <View className="flex-row items-center bg-gray-700 rounded-[14px] w-full px-2 py-2">
                    {post?.author?.photUser ? <Image
                        source={{ uri: post?.author?.username.slice(0, 2) as string }}
                        className="w-8 h-8 rounded-full mr-2"
                    />
                        : <View className='w-8 h-8 rounded-full mr-2 bg-gray-500 text-white flex items-center justify-center'>
                            <Text className='text-white text-bold text-[20px]'>
                                {post?.author?.nomUser?.slice(0, 2)}
                            </Text>
                        </View>
                    }
                    <TextInput
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholder={replyingTo ? `Repondre a ${replyingTo.userName || 'commentaire'}...` : "Laisser un commentaire..."}
                        placeholderTextColor="#9CA3AF"
                        multiline
                        className="flex-1 text-white text-sm mr-2"
                    />
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#60A5FA" />
                    ) : (
                        <TouchableOpacity
                            onPress={handleAddComment}
                            disabled={!commentText?.trim() || isSubmitting}
                        >
                            <Ionicons
                                name="send"
                                size={24}
                                color={commentText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Comments List */}
            {isLoading && !comments?.length ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (comments.length || post?.comments) ? (
                (comments || post?.comments).map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={post?.author || currentUser}
                        onReply={handleReply}
                        onLike={handleLike}
                        onAddReply={onAddReply}
                        depth={0}
                        maxDepth={3}
                    />
                ))
            ) : null}
        </View>
    );
});


export { EnhancedCommentSection };