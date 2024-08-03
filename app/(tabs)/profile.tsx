import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import EmptyState from "@/components/EmptyState";
import { getUserPosts, signOut } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
    //@ts-ignore
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    //@ts-ignore
    const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);

        router.replace("/sign-in");
    };

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
                    <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
                        <TouchableOpacity
                            className='w-full items-end mb-10'
                            onPress={logout}>
                            <Image
                                source={icons.logout}
                                className='w-6 h-6'
                                resizeMode='contain'
                            />
                        </TouchableOpacity>

                        <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
                            <Image
                                source={{ uri: user?.avatar }}
                                className='w-[90%] h-[90%] rounded-lg'
                                resizeMode='contain'
                            />
                        </View>
                        <InfoBox
                            title={user?.username}
                            containerStyles='mt-5'
                            titleStyles='text-lg'
                        />

                        <View className='mt-5 flex-row'>
                            <InfoBox
                                //@ts-ignore
                                title={posts.length || 0}
                                subtitle='Posts'
                                containerStyles='mr-10'
                                titleStyles='text-xl'
                            />
                            <InfoBox
                                title='1.2k'
                                subtitle='Followers'
                                titleStyles='text-xl'
                            />
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

export default Profile;
