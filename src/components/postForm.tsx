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
    // 편집 중 원본(있을 수도 있음)
    const [originalThumbUrl, setOriginalThumbUrl] = useState<string>('');
    // 새로 선택한 파일/미리보기
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [thumbPreview, setThumbPreview] = useState<string>(''); // Object URL
    // 기존 썸네일을 지우기로 했는지 플래그(수정 모드)
    const [removeOriginalThumb, setRemoveOriginalThumb] = useState(false);

    // === 본문 이미지 (저장 시 업로드) ===
    // 편집 전 원본들
    const [originalMainUrls, setOriginalMainUrls] = useState<string[]>([]);
    // 원본 중 삭제하기로 한 항목
    const [removedOriginalMainUrls, setRemovedOriginalMainUrls] = useState<Set<string>>(new Set());
    // 새로 추가한 파일/미리보기
    const [mainFiles, setMainFiles] = useState<File[]>([]);
    const [mainPreviews, setMainPreviews] = useState<string[]>([]); // Object URLs

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
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    router.replace('/admin');
                    return;
                }
                setOriginal(loaded);
                setPostTitle(loaded.title ?? '');
                setOriginalThumbUrl(loaded.thumbnailUrl ?? '');
                setOriginalMainUrls(loaded.imageUrls ?? []);
            } catch (e) {
                console.error(e);
                await new Promise((resolve) => setTimeout(resolve, 2000));
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
            mainPreviews.forEach((u) => URL.revokeObjectURL(u));
        };
    }, []);

    // ====== 핸들러: 썸네일 선택/취소 ======
    function onPickThumb(file: File | null) {
        // 기존 프리뷰 정리
        if (thumbPreview) URL.revokeObjectURL(thumbPreview);

        if (!file) {
            setThumbFile(null);
            setThumbPreview('');
            // 기존 썸네일이 있으면 그대로 유지 (removeOriginalThumb=false 유지)
            return;
        }
        setThumbFile(file);
        setThumbPreview(URL.createObjectURL(file));
        // 새 파일을 선택했다면 기존 썸네일은 교체되는 것이므로 제거 플래그 on
        if (originalThumbUrl) setRemoveOriginalThumb(true);
    }

    function onRemovePickedThumb() {
        if (thumbPreview) URL.revokeObjectURL(thumbPreview);
        setThumbFile(null);
        setThumbPreview('');
        // 기존 썸네일은 유지(수정 모드) — 사용자가 명시적으로 "기존 삭제"를 누르면 removeOriginalThumb을 true로 만들 수 있게 별도 버튼 제공 가능
        setRemoveOriginalThumb(false);
    }

    function onRemoveOriginalThumbClick() {
        // 수정 모드에서 기존 썸네일만 제거(새 파일 없이)
        setRemoveOriginalThumb(true);
        // 미리보기는 없음
    }

    // ====== 핸들러: 본문 이미지 선택/삭제 ======
    function onPickMain(files: FileList | null) {
        if (!files || files.length === 0) return;
        const arr = Array.from(files);
        const newPreviews = arr.map((f) => URL.createObjectURL(f));
        setMainFiles((prev) => [...prev, ...arr]);
        setMainPreviews((prev) => [...prev, ...newPreviews]);
    }

    function onRemovePickedMain(index: number) {
        const preview = mainPreviews[index];
        if (preview) URL.revokeObjectURL(preview);
        setMainFiles((prev) => prev.filter((_, i) => i !== index));
        setMainPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function onRemoveOriginalMain(url: string) {
        setRemovedOriginalMainUrls((prev) => {
            const next = new Set(prev);
            next.add(url);
            return next;
        });
    }

    // ====== 검증 ======
    function validate() {
        const hasThumb =
            // 새로 고른 파일이 있거나
            (!!thumbFile) ||
            // (수정 모드) 기존 썸네일을 삭제하지 않았고 기존이 남아있거나
            (!!originalThumbUrl && !removeOriginalThumb);

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
                // 새 파일 업로드
                finalThumbUrl = await insertImageToStorage(kind, postId, 'thumbnail', thumbFile);
            } else if (removeOriginalThumb) {
                // 기존 것 삭제 예정(성공 후)
                finalThumbUrl = '';
            }

            // 2) 본문 이미지: 기존 유지 + 기존 중 제거 제외 + 새 파일 업로드
            const keptOriginalMain = originalMainUrls.filter((u) => !removedOriginalMainUrls.has(u));
            const uploadedMain: string[] = [];
            for (const f of mainFiles) {
                const url = await insertImageToStorage(kind, postId, 'main', f);
                uploadedMain.push(url);
            }
            const finalMainUrls = [...keptOriginalMain, ...uploadedMain];

            if (!isEdit) {
                // CREATE
                const newPost: Post = {
                    id: postId,
                    title: postTitle,
                    address: postAddress,
                    thumbnailUrl: finalThumbUrl,
                    imageUrls: finalMainUrls,
                    createdAt: now,
                    updatedAt: now,
                };
                await createPost(kind, newPost);
            } else {
                // EDIT
                if (!original) {
                    console.error('원본 데이터를 불러오지 못했습니다.')
                    return;
                }
                await updatePost(kind, postId, {
                    title: postTitle,
                    address: postAddress,
                    thumbnailUrl: finalThumbUrl,
                    imageUrls: finalMainUrls,
                });
            }

            // === 저장 성공 이후에만 실제 스토리지 정리 ===
            // (1) 썸네일 교체/삭제
            if (isEdit && originalThumbUrl && (removeOriginalThumb || (thumbFile && originalThumbUrl !== finalThumbUrl))) {
                try { await deleteImageFromStorage(originalThumbUrl); } catch {}
            }
            // (2) 본문 원본 중 제거 표시된 것들 삭제
            if (removedOriginalMainUrls.size > 0) {
                const targets = [...removedOriginalMainUrls.values()];
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

            {/* 1) 주소 */}
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

            {/* 2) 썸네일 (저장 시 업로드) */}
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

                    {/* 새로 고른 썸네일 취소 */}
                    {thumbFile && (
                        <button
                            onClick={onRemovePickedThumb}
                            className="px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-500 hover:cursor-pointer"
                        >
                            선택 취소
                        </button>
                    )}

                    {/* (수정모드) 기존 썸네일 제거 */}
                    {isEdit && originalThumbUrl && !thumbFile && !removeOriginalThumb && (
                        <button
                            onClick={onRemoveOriginalThumbClick}
                            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-500 hover:cursor-pointer"
                        >
                            기존 썸네일 삭제
                        </button>
                    )}
                </div>

                {/* 썸네일 미리보기: 새로 고른 것 > 기존 것(수정 모드) */}
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

            {/* 3) 상세 이미지 (저장 시 업로드) */}
            <section className="space-y-3">
                <label className="block text-md font-medium">상세 이미지</label>
                <input
                    id="mainUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPickMain(e.target.files)}
                    className="hidden"
                />
                <label
                    htmlFor="mainUpload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 transition hover:cursor-pointer"
                >
                    이미지 선택
                </label>

                {/* (수정모드) 기존 이미지들 미리보기 */}
                {isEdit && originalMainUrls.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {originalMainUrls.map((url) => {
                            const removed = removedOriginalMainUrls.has(url);
                            return (
                                <div
                                    key={url}
                                    className={`relative rounded-lg border overflow-hidden ${removed ? 'opacity-40' : ''}`}
                                >
                                    <Image
                                        src={url}
                                        alt="original-main"
                                        width={1200}     // 아무 값(비율 용). 실제로는 컨테이너 폭에 맞게 줄어듦
                                        height={800}
                                        className="w-full h-auto object-cover"  // 가로폭 채우고 세로는 자동
                                    />
                                    <div className="absolute inset-x-0 top-0 p-2 text-white text-xs flex items-center justify-end">
                                        {!removed ? (
                                            <button
                                                onClick={() => onRemoveOriginalMain(url)}
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

                {/* 새로 고른 이미지들 미리보기 */}
                {mainPreviews.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {mainPreviews.map((url, i) => (
                            <div key={url} className="relative rounded-lg border overflow-hidden">
                                <Image
                                    src={url}
                                    alt={`new-${i}`}
                                    width={1200}         // 임의 비율용 값
                                    height={800}
                                    className="w-full h-auto object-cover"  // 가로폭에 맞춰 세로 자동
                                />
                                <div className="absolute inset-x-0 top-0 p-2 text-white text-xs flex items-center justify-end">
                                    <button
                                        onClick={() => onRemovePickedMain(i)}
                                        className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-600/30 hover:cursor-pointer"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* 아무것도 없을 때 */}
                {!isEdit && mainPreviews.length === 0 && (
                    <div className="text-md text-gray-400">상세 이미지가 없습니다.</div>
                )}
                {isEdit && mainPreviews.length === 0 && originalMainUrls.length === 0 && (
                    <div className="text-md text-gray-400">상세 이미지가 없습니다.</div>
                )}
            </section>
        </div>
    );
}
