import { VideoResponse } from "@/interfaces/response";
import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    Platform: "com.truejyro.aora",
    projectId: "66aaeca800165bc2e1f6",
    databaseId: "66aaedd3001500c68859",
    userCollectionId: "66aaee02001ad0a7640f",
    videoCollectionId: "66aaee30000aa29b480c",
    storageId: "66aaef900004616dd277",
};

const {
    endpoint,
    Platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(Platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(
    email: string,
    password: string,
    username: string,
): Promise<any> {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            },
        );

        return newUser;
    } catch (error) {
        console.error(error);
        throw new Error("Sign Up Error");
    }
}

export async function signIn(email: string, password: string): Promise<any> {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password,
        );

        return session;
    } catch (error) {
        console.error(error);
        throw new Error("Sign In Error");
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("accountId", currentAccount.$id)],
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.error(error);
    }
}

export async function getAllPosts(): Promise<VideoResponse[]> {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
        );

        return posts.documents as VideoResponse[];
    } catch (error) {
        console.error(error);
        throw new Error("Error getting all videos");
    }
}

export async function getLatestPosts(): Promise<VideoResponse[]> {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            //@ts-ignore
            [Query.orderDesc("$createdAt", Query.limit(7))],
        );

        return posts.documents as VideoResponse[];
    } catch (error) {
        console.error(error);
        throw new Error("Error getting all videos");
    }
}
