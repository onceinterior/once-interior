"use client";

import { useEffect, useState } from "react";
import type { Post, Kind } from "@/data/type";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { CheckIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

import { getPosts, deletePost, deleteImageFromStorage } from "@/lib/api";

export default function AdminPage() {
    const [mode, setMode] = useState<Kind>("commerce");
    const [items, setItems] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // 목록 로드 (최신순)
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const posts = await getPosts(mode); // orderBy("createdAt","desc")
                setItems(posts);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [mode]);

    // 삭제
    async function handleDelete(post: Post) {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        setDeletingId(post.id);
        try {
            // 1) Storage 이미지들 먼저 삭제
            const allUrls = [post.thumbnailUrl, ...(post.imageUrls || [])];
            await Promise.all(allUrls.map((url) => deleteImageFromStorage(url)));

            // 2) Firestore 문서 삭제
            await deletePost(mode, post.id);

            // 3) UI 반영
            setItems((prev) => prev.filter((p) => p.id !== post.id));
            toast.success("삭제되었습니다.");
        } catch (e) {
            console.error(e);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                {/* 상단 카테고리 선택 */}
                <div className="flex space-x-2 sm:space-x-4">
                    {(["commerce", "residence"] as Kind[]).map((kind) => {
                        const isSelected = mode === kind;
                        return (
                            <button
                                key={kind}
                                onClick={() => setMode(kind)}
                                disabled={loading}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 hover:cursor-pointer
                                ${isSelected
                                    ? "bg-gray-700 text-white shadow-lg scale-105 font-bold"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {isSelected && <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                                <span>{kind === "commerce" ? "상업공간" : "주거공간"}</span>
                            </button>
                        );
                    })}
                </div>

                {/* 새 링크 추가 */}
                <Link
                    href={`/admin/new/${mode}`}
                    className="bg-blue-600 text-white px-3 py-2 sm:px-5 rounded-lg text-sm sm:text-base hover:bg-blue-400 transition-all duration-200"
                >
                    {mode === "residence" ? "주거공간 추가" : "상업공간 추가"}
                </Link>
            </div>

            {/* 리스트 */}
            <div className="space-y-4">
                {loading && <div className="text-gray-500">불러오는 중...</div>}
                {!loading && items.length === 0 && (
                    <div className="text-gray-500">등록된 공간이 없습니다.</div>
                )}

                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg"
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

                        {/* 제목 & 생성일/수정일 & 메인 이미지 */}
                        <div className="flex-1">
                            {/* 제목 */}
                            <p className="font-bold">{item.title}</p>

                            {/* 생성일/수정일 */}
                            <div className="text-xs text-gray-500 mt-1 space-x-3">
                                <span>생성일: {new Date(item.createdAt).toLocaleString()}</span>
                                <span>수정일: {new Date(item.updatedAt).toLocaleString()}</span>
                            </div>

                            {/* 메인 이미지 */}
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                                {item.imageUrls.slice(0, 3).map((url, i) => (
                                    <div key={i} className="relative w-16 h-16 flex-shrink-0">
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

                        {/* 액션: 데스크톱은 오른쪽, 모바일은 아래로 */}
                        <div className="flex gap-2 justify-end md:justify-start flex-shrink-0 md:self-center md:ml-2 mt-3 md:mt-0">
                            <Link
                                href={`/admin/edit/${mode}/${item.id}`}
                                className="p-2 rounded-full hover:bg-blue-100"
                                title="수정"
                            >
                                <PencilSquareIcon className="w-6 h-6 text-blue-500 hover:cursor-pointer" />
                            </Link>

                            <button
                                onClick={() => handleDelete(item)}
                                disabled={deletingId === item.id}
                                className="p-2 rounded-full hover:bg-red-100 disabled:opacity-50"
                                title="삭제"
                            >
                                <TrashIcon className="w-6 h-6 text-red-500 hover:cursor-pointer" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
