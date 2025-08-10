'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import type { Kind, Post } from '@/data/type';
import { storage } from '@/lib/firebase';
import { getPosts, savePosts, deleteImageFromStorage } from '@/lib/api';

interface PostFormProps {
    kind: Kind;
    title: string;
}

export default function PostForm({ kind, title }: PostFormProps) {
    const router = useRouter();

    const [postId] = useState<string>(() => uuidv4());

    const [postTitle, setPostTitle] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [mainImageUrls, setMainImageUrls] = useState<string[]>([]);

    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [uploadingMain, setUploadingMain] = useState(false);

    // 썸네일 업로드 (단일)
    async function handleUploadThumbnail(file: File | null) {
        if (!file) return;
        setUploadingThumb(true);
        try {
            const storageRef = ref(storage, `${kind}/${postId}/thumbnail/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setThumbnailUrl(url);
        } catch (e) {
            console.error(e);
            toast.error('썸네일 업로드 실패');
        } finally {
            setUploadingThumb(false);
        }
    }

    // 썸네일 삭제
    async function handleRemoveThumbnail() {
        if (!thumbnailUrl) return;
        try {
            await deleteImageFromStorage(thumbnailUrl);
            setThumbnailUrl('');
        } catch (e) {
            console.error(e);
        }
    }

    async function handleUploadMain(files: FileList | null) {
        if (!files || files.length === 0) return;
        setUploadingMain(true);
        try {
            const uploadedUrls: string[] = [];
            for (const file of Array.from(files)) {
                const storageRef = ref(storage, `${kind}/${postId}/main/${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                uploadedUrls.push(url);
            }
            setMainImageUrls((prev) => [...prev, ...uploadedUrls]);
        } catch (e) {
            console.error(e);
        } finally {
            setUploadingMain(false);
        }
    }

    async function handleRemoveMain(url: string) {
        try {
            await deleteImageFromStorage(url);
            setMainImageUrls((prev) => prev.filter((u) => u !== url));
        } catch (e) {
            console.error(e);
        }
    }

    // 검증 & 저장
    function validate() {
        if (!postTitle.trim()) {
            toast.error('제목을 입력하세요.');
            return false;
        }
        if (!thumbnailUrl) {
            toast.error('썸네일을 업로드하세요.');
            return false;
        }
        return true;
    }

    async function handleSubmit() {
        if (!validate()) return;

        const now = Date.now();

        const newPost: Post = {
            id: postId,
            title: postTitle.trim(),
            thumbnailUrl,
            imageUrls: mainImageUrls,
            createdAt: now,
            updatedAt: now,
        };

        const current = await getPosts(kind);
        const updated = [...current, newPost];
        await savePosts(kind, updated);
        router.replace('/admin');
    }

    const routerButtonDisabled = uploadingThumb || uploadingMain;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-10">
            <Toaster position="top-center" />

            {/* 상단 액션 */}
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {title}{' '}
                    <span className="text-sm text-gray-500">
            ({kind} #{postId.slice(0, 8)})
          </span>
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.replace('/admin')}
                        disabled={routerButtonDisabled}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-500 hover:cursor-pointer disabled:opacity-50"
                    >
                        목록으로
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={routerButtonDisabled}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400 hover:cursor-pointer disabled:opacity-50"
                    >
                        저장
                    </button>
                </div>
            </header>

            {/* 1) 제목 div */}
            <section className="space-y-2">
                <label className="block text-md font-medium">제목</label>
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="제목"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />
            </section>

            {/* 2) 썸네일 div (미리보기 포함) */}
            <section className="space-y-3">
                <label className="block text-md font-medium">썸네일</label>
                <div className="flex items-center gap-3">
                    <input
                        id="thumbUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadThumbnail(e.target.files?.[0] ?? null)}
                        className="hidden"
                    />
                    <label
                        htmlFor="thumbUpload"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition"
                    >
                        이미지 선택
                    </label>
                    {uploadingThumb && (
                        <p className="text-gray-500 text-sm">업로드 중...</p>
                    )}
                    {thumbnailUrl && (
                        <button
                            onClick={handleRemoveThumbnail}
                            className="px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-500"
                        >
                            썸네일 삭제
                        </button>
                    )}
                </div>

                {/* 미리보기 자리 */}
                <div>
                    {thumbnailUrl ? (
                        <div className="w-48 h-32 border overflow-hidden">
                            <Image src={thumbnailUrl} alt={thumbnailUrl} fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="text-md text-gray-400">
                            썸네일을 등록해주세요.
                        </div>
                    )}
                </div>
            </section>

            {/* 3) 상세 이미지 div */}
            <section className="space-y-3">
                <label className="block text-md font-medium">상세 이미지</label>
                <input
                    id="mainUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleUploadMain(e.target.files)}
                    className="hidden"
                />
                <label
                    htmlFor="mainUpload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition"
                >
                    이미지 선택
                </label>
                {uploadingMain && <p className="text-gray-500 text-sm">업로드 중...</p>}

                {mainImageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mainImageUrls.map((url) => (
                            <div key={url} className="relative rounded-lg border overflow-hidden">
                                <Image
                                    src={url}
                                    alt={url}
                                    width={300}
                                    height={300}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-2 bg-black/40 text-white text-xs flex items-center justify-end">
                                    <button
                                        onClick={() => handleRemoveMain(url)}
                                        className="px-2 py-1 rounded bg-white/20 hover:bg-white/30"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-md text-gray-400">
                        상세 이미지가 없습니다.
                    </div>
                )}
            </section>
        </div>
    );
}
