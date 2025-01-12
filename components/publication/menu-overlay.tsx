import React, { memo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Post } from '@/lib/types';

// MenuOverlay component for the dropdown
const MenuOverlay = memo(({
    isVisible,
    onClose,
    onShare,
    onViewDetails,
    post
}: {
    isVisible: boolean;
    onClose: () => void;
    onShare: () => void;
    onViewDetails: () => void;
    post: Post;
}) => {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                className="flex-1"
                activeOpacity={1}
                onPress={onClose}
            >
                <View className="absolute top-12 right-4 bg-white rounded-lg shadow-lg w-48">
                    <TouchableOpacity
                        onPress={onViewDetails}
                        className="flex-row items-center px-4 py-3 border-b border-gray-200"
                    >
                        <Ionicons name="document-text-outline" size={20} color="black" />
                        <Text className="ml-2 text-black">View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onShare}
                        className="flex-row items-center px-4 py-3"
                    >
                        <Ionicons name="share-social-outline" size={20} color="black" />
                        <Text className="ml-2 text-black">Share</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
});

export { MenuOverlay };