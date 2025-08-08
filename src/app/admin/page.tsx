"use client"

import { useEffect, useState } from 'react';
import type {Post, Kind} from '@/data/type';
import Image from 'next/image';
import {deleteImageFromStorage, getPosts, savePosts} from '@/lib/api';
import Link from "next/link";
import {CheckIcon, TrashIcon} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export default function AdminLinksPage() {
    const [mode, setMode] = useState<Kind>('commerce');
    const [items, setItems] = useState<Post[]>([]);

    useEffect(() => {
        (async  () => {
            const posts = await getPosts(mode);
            setItems(posts);
        })();
    }, [mode]);

    async function handleSave(updated: Post[]) {
        await savePosts(mode, updated);
        setItems(updated);
    }

    async function handleDelete(index: number) {
        const itemToDelete = items[index];
        const updated = items.filter((_, i) => i !== index);

        await handleSave(updated);
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

        </div>
    );
}