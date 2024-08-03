import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { useState } from "react";

import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

interface SearchQueryProps {
    initialQuery?: string;
}

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
const SearchInput: React.FC<SearchQueryProps> = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || "");

    return (
        <View className='flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center space-x-4'>
            <TextInput
                className='text-base mt-0.5 text-white flex-1 font-pregular'
                value={query}
                placeholder='Search for a video topic'
                placeholderTextColor='#cdcde0'
                //@ts-ignore
                onChangeText={e => setQuery(e)}
            />

            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert(
                            "missing query",
                            "Plase input something to search results across database",
                        );
                    }

                    if (pathname.startsWith("/search"))
                        router.setParams({ query });
                    else router.push(`/search/${query}`);
                }}>
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
