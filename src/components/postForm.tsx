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
    mode?: Mode;            // default: 'create'
    postIdForEdit?: string; // edit 모드일 때 필수
}

export default function PostForm({ kind, mode = 'create', postIdForEdit }: PostFormProps) {
    const router = useRouter();
    const isEdit = mode === 'edit';

    // 생성 모드면 새 uuid, 수정 모드면 기존 id 사용
    const postId = useMemo(
        () => (isEdit && postIdForEdit ? postIdForEdit : uuidv4()),
        [isEdit, postIdForEdit]
    );

    // 공통 상태
    const [postTitle, setPostTitle] = useState('');
    const [postAddress, setPostAddress] = useState('');

    // === 썸네일 (저장 시 업로드) ===
    const [originalThumbUrl, setOriginalThumbUrl] = useState<string>('');
    const [removeOriginalThumb, setRemoveOriginalThumb] = useState(false);
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [thumbPreview, setThumbPreview] = useState<string>(''); // Object URL

    // === 본문 BEFORE 이미지 (저장 시 업로드) ===
    const [originalBeforeUrls, setOriginalBeforeUrls] = useState<string[]>([]);
    const [removedOriginalBeforeUrls, setRemovedOriginalBeforeUrls] = useState<Set<string>>(new Set());
    const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
    const [beforePreviews, setBeforePreviews] = useState<string[]>([]);

    // === 본문 AFTER 이미지 (저장 시 업로드) ===
    const [originalAfterUrls, setOriginalAfterUrls] = useState<string[]>([]);
    const [removedOriginalAfterUrls, setRemovedOriginalAfterUrls] = useState<Set<string>>(new Set());
    const [afterFiles, setAfterFiles] = useState<File[]>([]);
    const [afterPreviews, setAfterPreviews] = useState<string[]>([]);

    // 기타 상태
    const [original, setOriginal] = useState<Post | null>(null);
    const [loadingEdit, setLoadingEdit] = useState<boolean>(isEdit);
    const [saving, setSaving] = useState(false);

    // ====== EDIT 모드: 문서 로드 ======
    useEffect(() => {
        if (!isEdit) return;
        if (!postIdForEdit) {
            router.replace('/admin');
            return;
        }
        (async () => {
            try {
                setLoadingEdit(true);
                const loaded = await getPost(kind, postIdForEdit);
                if (!loaded) {
                    toast.error('게시글을 찾을 수 없습니다.');
                    await new Promise((r) => setTimeout(r, 2000));
                    router.replace('/admin');
                    return;
                }
                setOriginal(loaded);
                setPostTitle(loaded.title ?? '');
                setPostAddress(loaded.address ?? '');
                setOriginalThumbUrl(loaded.thumbnailUrl ?? '');
                setOriginalBeforeUrls(loaded.beforeImageUrls ?? []);
                setOriginalAfterUrls(loaded.afterImageUrls ?? []);
            } catch (e) {
                console.error(e);
                await new Promise((r) => setTimeout(r, 2000));
                router.replace('/admin');
            } finally {
                setLoadingEdit(false);
            }
        })();
    }, [isEdit, kind, postIdForEdit, router]);

    // ====== Object URL 정리 ======
    useEffect(() => {
        return () => {
            if (thumbPreview) URL.revokeObjectURL(thumbPreview);
            beforePreviews.forEach((u) => URL.revokeObjectURL(u));
            afterPreviews.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [thumbPreview, beforePreviews, afterPreviews]);

    // ====== 핸들러: 썸네일 선택/취소 ======
    function onPickThumb(file: File | null) {
        if (thumbPreview) URL.revokeObjectURL(thumbPreview);

        if (!file) {
            setThumbFile(null);
            setThumbPreview('');
            setRemoveOriginalThumb(false);
            return;
        }
        setThumbFile(file);
        setThumbPreview(URL.createObjectURL(file));
        if (originalThumbUrl) setRemoveOriginalThumb(true);
    }

    function onRemovePickedThumb() {
        if (thumbPreview) URL.revokeObjectURL(thumbPreview);
        setThumbFile(null);
        setThumbPreview('');
        setRemoveOriginalThumb(false);
    }

    function onRemoveOriginalThumbClick() {
        setRemoveOriginalThumb(true);
    }

    // ====== 핸들러: BEFORE 이미지 선택/삭제 ======
    function onPickBefore(files: FileList | null) {
        if (!files || files.length === 0) return;
        const arr = Array.from(files);
        const newPreviews = arr.map((f) => URL.createObjectURL(f));
        setBeforeFiles((prev) => [...prev, ...arr]);
        setBeforePreviews((prev) => [...prev, ...newPreviews]);
    }

    function onRemovePickedBefore(index: number) {
        const preview = beforePreviews[index];
        if (preview) URL.revokeObjectURL(preview);
        setBeforeFiles((prev) => prev.filter((_, i) => i !== index));
        setBeforePreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function onRemoveOriginalBefore(url: string) {
        setRemovedOriginalBeforeUrls((prev) => {
            const next = new Set(prev);
            next.add(url);
            return next;
        });
    }

    // ====== 핸들러: AFTER 이미지 선택/삭제 ======
    function onPickAfter(files: FileList | null) {
        if (!files || files.length === 0) return;
        const arr = Array.from(files);
        const newPreviews = arr.map((f) => URL.createObjectURL(f));
        setAfterFiles((prev) => [...prev, ...arr]);
        setAfterPreviews((prev) => [...prev, ...newPreviews]);
    }

    function onRemovePickedAfter(index: number) {
        const preview = afterPreviews[index];
        if (preview) URL.revokeObjectURL(preview);
        setAfterFiles((prev) => prev.filter((_, i) => i !== index));
        setAfterPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function onRemoveOriginalAfter(url: string) {
        setRemovedOriginalAfterUrls((prev) => {
            const next = new Set(prev);
            next.add(url);
            return next;
        });
    }

    // ====== 검증 ======
    function validate() {
        const hasThumb =
            (!!thumbFile) || (!!originalThumbUrl && !removeOriginalThumb);

        if (!postTitle.trim()) {
            toast.error('제목을 입력하세요.');
            return false;
        }
        if (!postAddress.trim()) {
            toast.error('주소를 입력하세요.');
            return false;
        }
        if (!hasThumb) {
            toast.error('썸네일을 등록하세요.');
            return false;
        }
        return true;
    }

    // ====== 저장 ======
    async function handleSubmit() {
        if (!validate()) return;
        setSaving(true);
        try {
            const now = Date.now();

            // 1) 썸네일 업로드(or 유지/삭제)
            let finalThumbUrl = originalThumbUrl;
            if (thumbFile) {
                finalThumbUrl = await insertImageToStorage(kind, postId, 'thumbnail', thumbFile);
            } else if (removeOriginalThumb) {
                finalThumbUrl = '';
            }

            // 2) BEFORE 이미지 처리
            const keptOriginalBefore = originalBeforeUrls.filter((u) => !removedOriginalBeforeUrls.has(u));
            const uploadedBefore: string[] = [];
            for (const f of beforeFiles) {
                const url = await insertImageToStorage(kind, postId, 'before', f);
                uploadedBefore.push(url);
            }
            const finalBeforeUrls = [...keptOriginalBefore, ...uploadedBefore];

            // 3) AFTER 이미지 처리
            const keptOriginalAfter = originalAfterUrls.filter((u) => !removedOriginalAfterUrls.has(u));
            const uploadedAfter: string[] = [];
            for (const f of afterFiles) {
                const url = await insertImageToStorage(kind, postId, 'after', f);
                uploadedAfter.push(url);
            }
            const finalAfterUrls = [...keptOriginalAfter, ...uploadedAfter];

            if (!isEdit) {
                // CREATE
                const newPost: Post = {
                    id: postId,
                    title: postTitle,
                    address: postAddress,
                    thumbnailUrl: finalThumbUrl,
                    beforeImageUrls: finalBeforeUrls,
                    afterImageUrls: finalAfterUrls,
                    createdAt: now,
                    updatedAt: now,
                } as Post;
                await createPost(kind, newPost);
            } else {
                // EDIT
                if (!original) {
                    console.error('원본 데이터를 불러오지 못했습니다.');
                    return;
                }
                await updatePost(kind, postId, {
                    title: postTitle,
                    address: postAddress,
                    thumbnailUrl: finalThumbUrl,
                    beforeImageUrls: finalBeforeUrls,
                    afterImageUrls: finalAfterUrls,
                });
            }

            // === 저장 성공 이후 스토리지 정리 ===
            // (1) 썸네일
            if (isEdit && originalThumbUrl && (removeOriginalThumb || (thumbFile && originalThumbUrl !== finalThumbUrl))) {
                try { await deleteImageFromStorage(originalThumbUrl); } catch {}
            }
            // (2) BEFORE 삭제 예정
            if (removedOriginalBeforeUrls.size > 0) {
                const targets = [...removedOriginalBeforeUrls.values()];
                await Promise.all(targets.map((u) => deleteImageFromStorage(u).catch(() => {})));
            }
            // (3) AFTER 삭제 예정
            if (removedOriginalAfterUrls.size > 0) {
                const targets = [...removedOriginalAfterUrls.values()];
                await Promise.all(targets.map((u) => deleteImageFromStorage(u).catch(() => {})));
            }

            router.replace('/admin');
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    }

    const disabled = saving || (isEdit && loadingEdit);

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
            <header className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">
                    {isEdit ? (kind === 'residence' ? '주거공간 수정' : '상업공간 수정')
                        : (kind === 'residence' ? '주거공간 추가' : '상업공간 추가')}
                    <span className="text-sm text-gray-500"> ({kind} #{postId.slice(0, 8)})</span>
                </h1>

                {isEdit && original && (
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        생성일: {new Date(original.createdAt).toLocaleString()}<br />
                        수정일: {new Date(original.updatedAt).toLocaleString()}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={() => router.replace('/admin')}
                        disabled={disabled}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50 hover:cursor-pointer"
                    >
                        목록으로
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={disabled}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400 disabled:opacity-50 hover:cursor-pointer"
                    >
                        {saving ? '저장 중…' : '저장'}
                    </button>
                </div>
            </header>

            {/* 제목 */}
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

            {/* 주소 */}
            <section className="space-y-2">
                <label className="block text-md font-medium">주소</label>
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="주소"
                    value={postAddress}
                    onChange={(e) => setPostAddress(e.target.value)}
                />
            </section>

            {/* 썸네일 */}
            <section className="space-y-3">
                <label className="block text-md font-medium">썸네일</label>
                <div className="flex items-center gap-3">
                    <input
                        id="thumbUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => onPickThumb(e.target.files?.[0] ?? null)}
                        className="hidden"
                    />
                    <label
                        htmlFor="thumbUpload"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition hover:cursor-pointer"
                    >
                        이미지 선택
                    </label>

                    {thumbFile && (
                        <button
                            onClick={onRemovePickedThumb}
                            className="px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-500 hover:cursor-pointer"
                        >
                            선택 취소
                        </button>
                    )}

                    {isEdit && originalThumbUrl && !thumbFile && !removeOriginalThumb && (
                        <button
                            onClick={onRemoveOriginalThumbClick}
                            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-500 hover:cursor-pointer"
                        >
                            기존 썸네일 삭제
                        </button>
                    )}
                </div>

                {thumbPreview ? (
                    <div className="overflow-hidden">
                        <Image src={thumbPreview} alt="thumb-preview" width={400} height={300} className="object-cover" />
                    </div>
                ) : (isEdit && originalThumbUrl && !removeOriginalThumb) ? (
                    <div className="overflow-hidden">
                        <Image src={originalThumbUrl} alt="thumb-original" width={400} height={300} className="object-cover" />
                    </div>
                ) : (
                    <div className="text-md text-gray-400">썸네일을 등록해주세요.</div>
                )}
            </section>

            {/* BEFORE 이미지 */}
            <section className="space-y-3">
                <label className="block text-md font-medium">Before 이미지</label>

                <input
                    id="beforeImageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPickBefore(e.target.files)}
                    className="hidden"
                />
                <label
                    htmlFor="beforeImageUpload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition hover:cursor-pointer"
                >
                    이미지 선택
                </label>

                {/* (수정모드) 기존 BEFORE 이미지 */}
                {isEdit && originalBeforeUrls.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {originalBeforeUrls.map((url) => {
                            const removed = removedOriginalBeforeUrls.has(url);
                            return (
                                <div key={url} className={`relative rounded-lg border overflow-hidden ${removed ? 'opacity-40' : ''}`}>
                                    <Image
                                        src={url}
                                        alt="original-before"
                                        width={1200}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-x-0 top-0 p-2 text-white text-xs flex items-center justify-end">
                                        {!removed ? (
                                            <button
                                                onClick={() => onRemoveOriginalBefore(url)}
                                                className="px-3 py-2 rounded bg-red-500/20 hover:bg-red-600/30 hover:cursor-pointer"
                                            >
                                                삭제
                                            </button>
                                        ) : (
                                            <span className="px-3 py-2 rounded bg-gray-700/50">삭제예정</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 새로 고른 BEFORE */}
                {beforePreviews.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {beforePreviews.map((url, i) => (
                            <div key={url} className="relative rounded-lg border overflow-hidden">
                                <Image
                                    src={url}
                                    alt={`before-new-${i}`}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-x-0 top-0 p-2 text-white text-xs flex items-center justify-end">
                                    <button
                                        onClick={() => onRemovePickedBefore(i)}
                                        className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-600/30 hover:cursor-pointer"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 비어있을 때 */}
                {!isEdit && beforePreviews.length === 0 && (
                    <div className="text-md text-gray-400">이미지가 없습니다.</div>
                )}
                {isEdit && beforePreviews.length === 0 && originalBeforeUrls.length === 0 && (
                    <div className="text-md text-gray-400">이미지가 없습니다.</div>
                )}
            </section>

            {/* AFTER 이미지 */}
            <section className="space-y-3">
                <label className="block text-md font-medium">After 이미지</label>

                <input
                    id="afterImageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPickAfter(e.target.files)}
                    className="hidden"
                />
                <label
                    htmlFor="afterImageUpload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition hover:cursor-pointer"
                >
                    이미지 선택
                </label>

                {/* (수정모드) 기존 AFTER 이미지 */}
                {isEdit && originalAfterUrls.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {originalAfterUrls.map((url) => {
                            const removed = removedOriginalAfterUrls.has(url);
                            return (
                                <div key={url} className={`relative rounded-lg border overflow-hidden ${removed ? 'opacity-40' : ''}`}>
                                    <Image
                                        src={url}
                                        alt="original-after"
                                        width={1200}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-x-0 top-0 p-2 text-white text-xs flex items-center justify-end">
                                        {!removed ? (
                                            <button
                                                onClick={() => onRemoveOriginalAfter(url)}
                                                className="px-3 py-2 rounded bg-red-500/20 hover:bg-red-600/30 hover:cursor-pointer"
                                            >
                                                삭제
                                            </button>
                                        ) : (
                                            <span className="px-3 py-2 rounded bg-gray-700/50">삭제예정</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 새로 고른 AFTER */}
                {afterPreviews.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {afterPreviews.map((url, i) => (
                            <div key={url} className="relative rounded-lg border overflow-hidden">
                                <Image
                                    src={url}
                                    alt={`after-new-${i}`}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-x-0 top-0 p-2 text-white text-xs flex items-center justify-end">
                                    <button
                                        onClick={() => onRemovePickedAfter(i)}
                                        className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-600/30 hover:cursor-pointer"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 비어있을 때 */}
                {!isEdit && afterPreviews.length === 0 && (
                    <div className="text-md text-gray-400">이미지가 없습니다.</div>
                )}
                {isEdit && afterPreviews.length === 0 && originalAfterUrls.length === 0 && (
                    <div className="text-md text-gray-400">이미지가 없습니다.</div>
                )}
            </section>
        </div>
    );
}
