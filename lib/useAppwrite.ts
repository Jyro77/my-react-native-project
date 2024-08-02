import React, { useEffect, useState } from "react";
import { VideoResponse } from "@/interfaces/response";
import { Alert } from "react-native";

//@ts-ignore
export const useAppwrite = fn => {
    const [data, setData] = useState<VideoResponse | []>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response: VideoResponse[] = await fn();

            //@ts-ignore
            setData(response);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Videos can't be loaded");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return { data, isLoading, refetch };
};
