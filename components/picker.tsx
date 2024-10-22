import SelectDropdown from 'react-native-select-dropdown'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category, Publication } from '@/lib/types';

type TPicker = {
    options: Category[];
    setCurrentCat: React.Dispatch<React.SetStateAction<Category | undefined>>
}
export function SelectItem({ options, setCurrentCat }: TPicker) {


    return (
        <SelectDropdown
            data={options}
            onSelect={(selectedItem, index) => {
                console.log("in select component: ", selectedItem, index);
                setCurrentCat(selectedItem);
            }}
            renderButton={(selectedItem, isOpened) => {
                return (
                    <View style={styles.dropdownButtonStyle}>
                        {/* {selectedItem && (
                            <Ionicons name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                        )} */}
                        <Text style={styles.dropdownButtonTxtStyle}>
                            {(selectedItem && selectedItem.name) || 'Selectionnez une categorie'}
                        </Text>
                        <Text className='text-xs'>▼</Text>
                        {/* <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} /> */}
                    </View>
                );
            }}
            renderItem={(item, index, isSelected) => {
                return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#6b7280' }) }}>
                        {/* <Ionicons name={item.icon} style={styles.dropdownItemIconStyle} /> */}
                        <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                    </View>
                );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
        />
    )
}



const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: '100%',
        height: 40,
        backgroundColor: '#1f2937',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginVertical: 10,
        marginTop: 0,

    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: '#fff',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        borderColor: '#6b7280',
        borderWidth: 0.5,
        marginTop: 0
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: '#111827',
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 14.5,
        fontWeight: '500',
        color: '#fff',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});