export interface Post {
    id: string;
    title: string;
    address: string;
    thumbnailUrl: string;
    imageUrls: string[];
    createdAt: number;
    updatedAt: number;
}

export type Kind = "residence" | "commerce";