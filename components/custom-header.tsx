import * as React from 'react';
import { Colors } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Href, Link, usePathname, useRouter } from 'expo-router';

const CustomHeader = () => {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const pathname = usePathname();
    return (
        <BlurView
            intensity={10}
            tint={'systemMaterialDark'}
            style={{ paddingTop: top }}
            className={`pb-1 bg-gray-900  border-b-0.5 border-gray-700`}
        >
            <View

                className='flex-row  justify-between items-center h-[60px] gap-[10px] px-[20px] bg-transparent'
            >
                <Link href={'/accueil' as Href<string>} asChild>
                    <TouchableOpacity

                        className='w-[40px] h-[40px] rounded-[20px] bg-[#626D77] justify-center items-center'
                    >
                        {
                            pathname.includes('accueil') ? null : <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>
                                <Ionicons name="arrow-back" size={20} color={'#fff'} />
                            </Text>
                        }
                    </TouchableOpacity>
                </Link>
                {/* <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.lightGray,
                        borderRadius: 30,
                    }}
                // className=' flex-1 flex-row justify-center items-center text-lightGray rounded-[30px]'
                >
                    <Ionicons
                        name="search"
                        size={20}
                        color={Colors.darkness}
                        className='text-darkness p-[10px]'
                    />
                    <TextInput

                        placeholder="Search"
                        // placeholderTextColor={Colors.dark}
                        className='
                        placeholder:text-darkness
                        py-[10px]
                        pl-0 pr-[10px]
                        bg-lightGray
                        text-darkness
                        rounded-[30px]
                        '
                    />
                </View> */}
                <TouchableOpacity onPress={() => router.push('/(settings)/parameters')}

                    className='w-[40px] h-[40px] rounded-[30px] bg-lightGray justify-center items-center'

                >
                    <Ionicons
                        name={'settings'}
                        size={30}
                        color={'white'}
                        className='text-darkness'
                    />
                </TouchableOpacity>
                {/* <View
                    className='w-[40px] h-[40px] rounded-[30px] bg-lightGray justify-center items-center'
                >
                    <Ionicons
                        name={'card'}
                        size={20}
                        color={Colors.darkness}
                        className='text-darkness'
                    />
                </View> */}
            </View>
        </BlurView>
    );
};

export default CustomHeader;
