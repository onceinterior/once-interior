"use client";

import PostForm from "@/components/postForm";
import { useParams } from "next/navigation";
import type { Kind } from "@/data/type";

export default function EditPostPage() {
    const { kind, id } = useParams<{ kind: Kind; id: string }>();

    return (
        <PostForm
            kind={kind}
            mode="edit"
            postIdForEdit={id}
        />
    );
}
