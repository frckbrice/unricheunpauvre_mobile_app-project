import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react';

const CommentInput = ({ currentCom, setCurrentCom, handleAddComment }: {
    currentCom: string,
    setCurrentCom: React.Dispatch<React.SetStateAction<string>>,
    handleAddComment: () => void
}) => {
    return (
        <View className="w-full p-2 bg-gray-100">
            {/* Add Comment Input */}
            <TextInput
                className={`bg-gray-800 text-white p-2 rounded-lg flex-1`}
                placeholder="Add a comment"
                placeholderTextColor="gray"
                value={currentCom}
                onChangeText={setCurrentCom}
            />

            <TouchableOpacity onPress={handleAddComment} className='w-fit p-2'>
                <Text>Add Comment</Text>
            </TouchableOpacity>

        </View>

    )
}

export default CommentInput;
