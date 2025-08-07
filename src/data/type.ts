export interface Post {
    id: number;
    title: string;
    thumbnailUrl: string;
    imagesUrl: string[];
    createdAt: number;
    updatedAt?: number;
}