export interface Post {
    title: string;
    thumbnailUrl: string;
    imagesUrl: string[];
    createdAt: number;
    updatedAt?: number;
}