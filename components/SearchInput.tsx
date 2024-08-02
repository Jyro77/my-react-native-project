import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

import { icons } from "@/constants";

/* por si hay props luego
interface SearchInputProps {
    title: string;
    value: string;
    handlerChangeText: (text: string) => void;
    otherStyles?: string;
}

: React.FC<SearchInputProps> = ({
    title,
    value,
    handlerChangeText,
    otherStyles,
    ...props
}

value={value}
onChangeText={handlerChangeText}

*/
const SearchInput = () => {
    return (
        <View className='flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center space-x-4'>
            <TextInput
                className='text-base mt-0.5 text-white flex-1 font-pregular'
                placeholder='Search for a video topic'
                placeholderTextColor='#7b7b8b'
            />

            <TouchableOpacity>
                <Image
                    source={icons.search}
                    className='w-5 h-5'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;
