import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";

const SignUp = () => {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submit = async () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert("Error", "Please, fill in all the fields");
        }

        setIsSubmitting(true);
        try {
            await createUser(form.email, form.password, form.username);

            // set it to global state...

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
                        title='Username'
                        value={form.username}
                        handlerChangeText={e =>
                            setForm({ ...form, username: e })
                        }
                        otherStyles='mt-7'
                        keyboardType='username'
                        placeholder='Username'
                    />
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
                        title='Sign up'
                        handlePress={submit}
                        containerStyles='mt-7'
                        isLoading={isSubmitting}
                    />
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Have an account already?
                        </Text>
                        <Link
                            href='/sign-in'
                            className='text-lg font-psemibold text-secondary-100'>
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
