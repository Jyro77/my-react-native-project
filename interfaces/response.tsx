export interface VideoResponse {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: any[]; // Puedes ajustar el tipo según las necesidades
    $tenant: string;
    $updatedAt: string;
    creator: {
        username: string;
        email: string;
        avatar: string;
        accountId: string;
        $id: string;
        $tenant: string;
        $createdAt: string;
        $updatedAt: string;
        $permissions: any[]; // Puedes ajustar el tipo según las necesidades
        $databaseId: string;
        // ... otros campos específicos del creador ...
    };
    prompt: string;
    thumbnail: string;
    title: string;
    video: string;
}
