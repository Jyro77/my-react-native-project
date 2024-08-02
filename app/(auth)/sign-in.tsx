import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // @ts-ignore
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const submit = async () => {
        if (form.email === "" || form.password === "") {
            Alert.alert("Error", "Please, fill in all the fields");
        }

        setIsSubmitting(true);

        try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();
            setUser(result);
            setIsLoggedIn(true);

            Alert.alert("Success", "User sigend in successfully");

            router.replace("/home");
        } catch (error) {
            console.error(error);
            throw new Error("The account could not be created");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView>
                <View className='w-full min-h-[90vh] justify-center px-4 my-6'>
                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className='w-[115px] h-35px'
                    />
                    <Text className='text-2xl font-psemibold text-white mt-10'>
                        Login to Aora
                    </Text>

                    <FormField
                        title='Email'
                        value={form.email}
                        handlerChangeText={e => setForm({ ...form, email: e })}
                        otherStyles='mt-7'
                        keyboardType='email-address'
                        placeholder='Email'
                    />
                    <FormField
                        title='Password'
                        value={form.password}
                        handlerChangeText={e =>
                            setForm({ ...form, password: e })
                        }
                        otherStyles='mt-7'
                        placeholder='Password'
                    />

                    <CustomButton
                        title='Sign in'
                        handlePress={submit}
                        containerStyles='mt-7'
                        isLoading={isSubmitting}
                    />
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Don't have account?
                        </Text>
                        <Link
                            href='/sign-up'
                            className='text-lg font-psemibold text-secondary-100'>
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
