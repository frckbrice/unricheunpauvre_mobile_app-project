import { View, Text } from 'react-native'
import React from 'react'
import { Comment } from '@/lib/types'

const CommentPost = ({ comment }: { comment: Comment }) => {
  return (
    <View className=' w-full p-2 bg-white'>
      <Text className=' text-black-100'>{comment.libeleCom}</Text>
    </View>
  )
}

export default CommentPost;
