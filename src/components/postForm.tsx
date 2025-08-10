'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import type { Kind, Post } from '@/data/type';
import { storage } from '@/lib/firebase';
import { getPosts, savePosts, deleteImageFromStorage } from '@/lib/api';

type Uploaded = { url: string; name: string };

interface PostFormProps {
    kind: Kind;
    backHref: string;
    title: string;
}

export default function PostForm({
                                     kind,
                                     backHref,
                                     title
                                 }: PostFormProps) {
    const router = useRouter();

    // 게시글 id
    const [postId] = useState<string>(() => uuidv4());
    // 입력 상태
    const [postTitle, setPostTitle] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [images, setImages] = useState<Uploaded[]>([]);
    // 로딩 상태
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [uploadingMain, setUploadingMain] = useState(false);

    // 썸네일 업로드 (단일)
    async function handleUploadThumbnail(file: File | null) {
        if (!file) return;
        setUploadingThumb(true);
        try {
            const storageRef = ref(
                storage,
                `${kind}/${postId}/thumbnail/${file.name}`
            );
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
            toast.success('썸네일 삭제 완료');
        } catch (e) {
            console.error(e);
            toast.error('썸네일 삭제 실패');
        }
    }

    // 그 외 이미지 업로드 (다중)
    async function handleUploadMain(files: FileList | null) {
        if (!files || files.length === 0) return;
        setUploadingMain(true);
        try {
            const uploaded: Uploaded[] = [];
            for (const file of Array.from(files)) {
                const storageRef = ref(
                    storage,
                    `${kind}/${postId}/main/${file.name}`
                );
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                uploaded.push({ url, name: file.name });
            }
            setImages((prev) => [...prev, ...uploaded]);
            toast.success('이미지 업로드 완료');
        } catch (e) {
            console.error(e);
            toast.error('이미지 업로드 실패');
        } finally {
            setUploadingMain(false);
        }
    }

    // 메인 이미지 개별 삭제
    async function handleRemoveMain(url: string) {
        try {
            await deleteImageFromStorage(url);
            setImages((prev) => prev.filter((i) => i.url !== url));
            toast.success('이미지 삭제 완료');
        } catch (e) {
            console.error(e);
            toast.error('이미지 삭제 실패');
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
            id: postId!, // 확정된 ID
            title: postTitle.trim(),
            thumbnailUrl,
            imageUrls: images.map((i) => i.url),
            createdAt: now,
            updatedAt: now,
        };

        const current = await getPosts(kind);
        const updatedPost = [...current, newPost];
        await savePosts(kind, updatedPost);
        router.push(backHref);
    }

    const disabled = uploadingThumb || uploadingMain;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-10">
            <Toaster position="top-center" />

            {/* 상단 액션 */}
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {title}{' '}
                    <span className="text-sm text-gray-500">
            ({kind}{postId ? ` #${postId}` : ''})
          </span>
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push(backHref)}
                        disabled={disabled}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-500 hover:cursor-pointer disabled:opacity-50"
                    >
                        목록으로
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={disabled}
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
                    placeholder="게시글 제목"
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

                {/* 미리보기 자리 항상 유지 */}
                <div className="min-h-32">
                    {thumbnailUrl ? (
                        <div className="relative w-48 h-32 border rounded overflow-hidden">
                            <Image src={thumbnailUrl} alt="thumbnail" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-48 h-32 border rounded flex items-center justify-center text-xs text-gray-400">
                            썸네일 미리보기
                        </div>
                    )}
                </div>
            </section>

            {/* 3) 그 외 이미지 div */}
            <section className="space-y-3">
                <label className="block text-md font-medium">그 외 이미지</label>
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
                {uploadingMain && (
                    <p className="text-gray-500 text-sm">업로드 중...</p>
                )}

                {images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((img) => (
                            <div key={img.url} className="relative rounded-lg border overflow-hidden">
                                <Image
                                    src={img.url}
                                    alt={img.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-2 bg-black/40 text-white text-xs flex items-center justify-end">
                                    <button
                                        onClick={() => handleRemoveMain(img.url)}
                                        className="px-2 py-1 rounded bg-white/20 hover:bg-white/30"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border rounded p-6 text-sm text-gray-500">
                        업로드된 이미지가 없습니다.
                    </div>
                )}
            </section>
        </div>
    );
}
