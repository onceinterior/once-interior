export interface Post {
    id: string;
    title: string;
    address: string;
    thumbnailUrl: string;
    beforeImageUrls: string[];
    afterImageUrls: string[];
    createdAt: number;
    updatedAt: number;
}

export type Kind = "residence" | "commerce";