export interface Post {
    id: number;
    title: string;
    thumbnailUrl: string;
    imageUrls: string[];
    createdAt: number;
    updatedAt?: number;
}