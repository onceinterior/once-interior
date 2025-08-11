'use client';

import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import type { Kind, Post } from '@/data/type';
import {
    createPost,
    updatePost,
    getPost,
    insertImageToStorage,
    deleteImageFromStorage,
} from '@/lib/api';

type Mode = 'create' | 'edit';

interface PostFormProps {
    kind: Kind;
    mode?: Mode;               // default: 'create'
    postIdForEdit?: string;    // edit 모드일 때 필수
}

export default function PostForm({ kind, mode = 'create', postIdForEdit }: PostFormProps) {
    const router = useRouter();
    const isEdit = mode === 'edit';

    // 생성 모드면 새 uuid, 수정 모드면 기존 id 사용
    const postId = useMemo(
        () => (isEdit && postIdForEdit ? postIdForEdit : uuidv4()),
        [isEdit, postIdForEdit]
    );

    // 폼 상태
    const [postTitle, setPostTitle] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [mainImageUrls, setMainImageUrls] = useState<string[]>([]);

    // 편집 전 원본(비교용)
    const [original, setOriginal] = useState<Post | null>(null);
    const [loadingEdit, setLoadingEdit] = useState<boolean>(isEdit);

    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [uploadingMain, setUploadingMain] = useState(false);

    // EDIT: 문서 로드
    useEffect(() => {
        if (!isEdit) return;
        if (!postIdForEdit) {
            toast.error('잘못된 접근입니다.');
            router.replace('/admin');
            return;
        }
        (async () => {
            try {
                setLoadingEdit(true);
                const loaded = await getPost(kind, postIdForEdit);
                if (!loaded) {
                    toast.error('게시글을 찾을 수 없어요.');
                    router.replace('/admin');
                    return;
                }
                setOriginal(loaded);
                // 상태 주입
                setPostTitle(loaded.title ?? '');
                setThumbnailUrl(loaded.thumbnailUrl ?? '');
                setMainImageUrls(loaded.imageUrls ?? []);
            } catch (e) {
                console.error(e);
                toast.error('불러오기에 실패했습니다.');
                router.replace('/admin');
            } finally {
                setLoadingEdit(false);
            }
        })();
    }, [isEdit, kind, postIdForEdit, router]);

    // 썸네일 업로드
    async function handleUploadThumbnail(file: File | null) {
        if (!file) return;
        setUploadingThumb(true);
        try {
            const url = await insertImageToStorage(kind, postId, 'thumbnail', file);
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

    // 본문 이미지 업로드
    async function handleUploadMain(files: FileList | null) {
        if (!files || files.length === 0) return;
        setUploadingMain(true);
        try {
            const uploadedUrls: string[] = [];
            for (const file of Array.from(files)) {
                const url = await insertImageToStorage(kind, postId, 'main', file);
                uploadedUrls.push(url);
            }
            setMainImageUrls((prev) => [...prev, ...uploadedUrls]);
        } catch (e) {
            console.error(e);
        } finally {
            setUploadingMain(false);
        }
    }

    // 본문 이미지 삭제(미리보기/상태만)
    async function handleRemoveMain(url: string) {
        try {
            await deleteImageFromStorage(url);
            setMainImageUrls((prev) => prev.filter((u) => u !== url));
        } catch (e) {
            console.error(e);
        }
    }

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

    // 저장
    async function handleSubmit() {
        if (!validate()) return;
        const now = Date.now();

        if (!isEdit) {
            // CREATE
            const newPost: Post = {
                id: postId,
                title: postTitle.trim(),
                thumbnailUrl,
                imageUrls: mainImageUrls,
                createdAt: now,
                updatedAt: now,
            };
            await createPost(kind, newPost);
            router.replace('/admin');
            return;
        }

        // EDIT
        if (!original) {
            toast.error('원본 데이터를 불러오지 못했습니다.');
            return;
        }

        try {
            // 1) 썸네일 변경되었으면 이전 썸네일 삭제
            if (original.thumbnailUrl && thumbnailUrl !== original.thumbnailUrl) {
                try {
                    await deleteImageFromStorage(original.thumbnailUrl);
                } catch {}
            }

            // 2) 본문 이미지: 제거된 것만 스토리지에서 삭제
            const prevSet = new Set(original.imageUrls || []);
            const nextSet = new Set(mainImageUrls || []);
            const removed = [...prevSet].filter((u) => !nextSet.has(u));
            await Promise.all(removed.map((u) => deleteImageFromStorage(u).catch(() => {})));

            // 3) Firestore 업데이트
            await updatePost(kind, postId, {
                title: postTitle.trim(),
                thumbnailUrl,
                imageUrls: mainImageUrls,
                // updatedAt은 updatePost에서 자동 세팅
            });

            router.replace('/admin');
        } catch (e) {
            console.error(e);
        }
    }

    const disabled = uploadingThumb || uploadingMain || (isEdit && loadingEdit);

    if (isEdit && loadingEdit) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <Toaster position="top-center" />
                불러오는 중…
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-10">
            <Toaster position="top-center" />

            {/* 상단 액션 */}
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {isEdit ? (kind === 'residence' ? '주거공간 수정' : '상업공간 수정')
                        : (kind === 'residence' ? '주거공간 추가' : '상업공간 추가')}
                    <span className="text-sm text-gray-500"> ({kind} #{postId.slice(0, 8)})</span>
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.replace('/admin')}
                        disabled={disabled}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
                    >
                        목록으로
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={disabled}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400 disabled:opacity-50"
                    >
                        {isEdit ? '수정 저장' : '저장'}
                    </button>
                </div>
            </header>

            {/* 1) 제목 */}
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

            {/* 2) 썸네일 */}
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
                    {uploadingThumb && <p className="text-gray-500 text-sm">업로드 중...</p>}
                    {thumbnailUrl && (
                        <button
                            onClick={handleRemoveThumbnail}
                            className="px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-500"
                        >
                            썸네일 삭제
                        </button>
                    )}
                </div>

                {/* 썸네일 미리보기 */}
                {thumbnailUrl ? (
                    <div className="overflow-hidden">
                        <Image src={thumbnailUrl} alt={thumbnailUrl} width={400} height={300} className="object-cover" />
                    </div>
                ) : (
                    <div className="text-md text-gray-400">썸네일을 등록해주세요.</div>
                )}
            </section>

            {/* 3) 상세 이미지 */}
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
                    <div className="w-100">
                        {mainImageUrls.map((url) => (
                            <div key={url} className="relative rounded-lg border overflow-hidden">
                                <Image src={url} alt={url} width={400} height={300} className="object-cover" />
                                <div className="absolute inset-x-0 top-0 p-2 text-white text-xs flex items-center justify-end">
                                    <button
                                        onClick={() => handleRemoveMain(url)}
                                        className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-600/30"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-md text-gray-400">상세 이미지가 없습니다.</div>
                )}
            </section>
        </div>
    );
}
