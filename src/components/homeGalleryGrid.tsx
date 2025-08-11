'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FadeUpWrapper from '@/components/fadeUpWrapper';
import type { Kind, Post } from '@/data/type';
import { getRecentPosts } from '@/lib/api';

type HomeItem = Post & { kind: Kind };

export default function HomeGalleryGrid() {
    const [items, setItems] = useState<HomeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                // 주거/상업 각각 6개씩 병렬 조회
                const [residence, commerce] = await Promise.all([
                    getRecentPosts('residence', 6),
                    getRecentPosts('commerce', 6),
                ]);

                if (cancelled) return;

                // kind 정보를 붙여 하나의 배열로 합치기
                const merged: HomeItem[] = [
                    ...residence.map(p => ({ ...p, kind: 'residence' as const })),
                    ...commerce.map(p => ({ ...p, kind: 'commerce' as const })),
                ];

                // kind 구분 없이 섞기
                merged.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

                setItems(merged);
            } catch (e) {
                console.error(e);
                if (!cancelled) setError('갤러리를 불러오지 못했습니다.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="w-full h-64 rounded-lg bg-gray-200" />
                        <div className="mt-4 h-4 w-2/3 mx-auto bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (items.length === 0) {
        return <p className="text-center text-gray-500">갤러리에 등록된 공간이 없습니다.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {items.map((item, index) => (
                <FadeUpWrapper key={`${item.kind}-${item.id}`} delay={index * 50}>
                    <Link href={`/${item.kind}/${item.id}`}>
                        <div className="group">
                            <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md cursor-pointer">
                                <Image
                                    src={item.thumbnailUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition duration-300 group-hover:brightness-110"
                                />
                            </div>
                            <p className="mt-4 text-center text-lg text-gray-900">{item.title}</p>
                        </div>
                    </Link>
                </FadeUpWrapper>
            ))}
        </div>
    );
}
