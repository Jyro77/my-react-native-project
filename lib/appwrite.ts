import { VideoResponse } from "@/interfaces/response";
import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
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
const storage = new Storage(client);

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
            [Query.orderDesc("$createdAt")],
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

export async function searchPost(query: string): Promise<VideoResponse[]> {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            //@ts-ignore
            [Query.search("title", query)],
        );

        return posts.documents as VideoResponse[];
    } catch (error) {
        console.error(error);
        throw new Error("Error getting all videos");
    }
}

export async function getUserPosts(userId: string): Promise<VideoResponse[]> {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            //@ts-ignore
            [Query.equal("creator", userId)],
        );

        return posts.documents as VideoResponse[];
    } catch (error) {
        console.error(error);
        throw new Error("Error getting all videos");
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        console.error(error);
        throw new Error("Cannot be log out correctly");
    }
};

//@ts-ignore
export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000,
                2000,
                //@ts-ignore
                "top",
                100,
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.error(error);
        throw new Error("Error trying set the new post");
    }
};

//@ts-ignore
export const uploadFile = async (file, type) => {
    if (!file) return;

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset,
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
    } catch (error) {
        console.error(error);
        throw new Error("Error trying upload the new video to the storage");
    }
};

//@ts-ignore
export const createVideo = async form => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            },
        );

        return newPost;
    } catch (error) {
        console.error(error);
        throw new Error("Error trying upload the new post");
    }
};
