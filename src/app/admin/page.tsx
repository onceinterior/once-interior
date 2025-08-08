"use client"

import { useEffect, useState } from 'react';
import type {Post, Kind} from '@/data/type';
import Image from 'next/image';
import {deleteImageFromStorage, getPosts, savePosts} from '@/lib/api';
import {TrashIcon} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export default function AdminPage() {
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

        await Promise.all(
            [itemToDelete.thumbnailUrl, ...itemToDelete.imageUrls].map((url) =>
                deleteImageFromStorage(url)
            )
        );

        const updated = items.filter((_, i) => i !== index);
        await handleSave(updated);
        toast.success("삭제되었습니다.");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* 상단 카테고리 선택 */}
            <div className="flex gap-4">
                {(["commerce", "residence"] as Kind[]).map((kind) => (
                    <button
                        key={kind}
                        onClick={() => setMode(kind)}
                        className={`px-4 py-2 rounded ${
                            mode === kind
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        {kind === "commerce" ? "상업공간" : "주거공간"}
                    </button>
                ))}
            </div>

            {/* 리스트 */}
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                        {/* 썸네일 */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                className="object-cover rounded"
                            />
                        </div>

                        {/* 텍스트 & 내부 이미지 */}
                        <div className="flex-1">
                            <p className="font-bold">{item.title}</p>
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                                {item.imageUrls.slice(0, 3).map((url, i) => (
                                    <div
                                        key={i}
                                        className="relative w-16 h-16 flex-shrink-0"
                                    >
                                        <Image
                                            src={url}
                                            alt={`이미지 ${i + 1}`}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                ))}
                                {item.imageUrls.length > 3 && (
                                    <span className="text-sm text-gray-500 self-center">
                                        +{item.imageUrls.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                            onClick={() => handleDelete(index)}
                            className="p-2 rounded-full hover:bg-red-100"
                        >
                            <TrashIcon className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}