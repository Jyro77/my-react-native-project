import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image,
} from "react-native";
import React, { useState } from "react";
import { ResizeMode, Video } from "expo-av";
//import Video, { VideoRef } from "react-native-video";

import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";

const zoomIn = {
    0: {
        scale: 0.9,
    },
    1: {
        scale: 1.1,
    },
};
const zoomOut = {
    0: {
        scale: 1.1,
    },
    1: {
        scale: 0.9,
    },
};
//@ts-ignore
const TrendingItem = ({ activeItem, item }) => {
    const [play, setPlay] = useState(false);

    return (
        <Animatable.View
            className='mr-5'
            //@ts-ignore
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}>
            {play ? (
                <Video
                    source={{
                        uri: item.video,
                        //uri: assets[0].uri
                    }}
                    className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={status => {
                        //@ts-ignore
                        if (status.didJustFinish) {
                            setPlay(false);
                        }
                    }}
                />
            ) : (
                <TouchableOpacity
                    className='relative justify-center items-center'
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}>
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
                        resizeMode='cover'
                    />
                    <Image
                        source={icons.play}
                        className='w-12 h-12 absolute'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
};

//@ts-ignore
const Trending = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[0]);

    //@ts-ignore
    const viewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key);
        }
    };

    return (
        <FlatList
            data={posts}
            keyExtractor={item => item.$id}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
            //@ts-ignore
            contentOffset={{ x: 0 }}
            horizontal
        />
    );
};

export default Trending;