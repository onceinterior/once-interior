"use client";

import PostForm from "@/components/postForm";
import {useParams} from "next/navigation";
import type {Kind} from "@/data/type";

export default function NewPostPage() {
    const { kind } = useParams<{ kind: Kind }>();
    return <PostForm kind={kind} />;
}
