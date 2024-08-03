import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "@/components/SearchInput";
import { StatusBar } from "expo-status-bar";
import EmptyState from "@/components/EmptyState";
import { searchPost } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
    const { query } = useLocalSearchParams();
    //@ts-ignore
    const { data: posts, refetch } = useAppwrite(() => searchPost(query));

    useEffect(() => {
        refetch();
    }, [query]);

    return (
        <SafeAreaView className='bg-primary h-full'>
            <FlatList
                //@ts-ignore
                data={posts}
                //data={[]}
                //@ts-ignore
                keyExtractor={item => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className='my-6 px-4'>
                        <Text className='font-pmedium text-sm text-gray-100'>
                            Search Result
                        </Text>
                        <Text className='text-2xl font-psemibold text-white'>
                            {query}
                        </Text>
                        <View className='mt-6 mb-7'>
                            {/* @ts-ignore */}
                            <SearchInput initialQuery={query} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title='No Video Found'
                        subtitle='No videos found for this search query'
                    />
                )}
            />
            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
};

export default Search;
