'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Kind, Post } from '@/data/type';
import { getPosts } from '@/lib/api';

interface GalleryGridProps {
    kind: Kind;
}

export default function GalleryGrid({ kind }: GalleryGridProps) {
    const [items, setItems] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await getPosts(kind);
                if (!cancelled) setItems(data);
            } catch (e) {
                if (!cancelled) setError('목록을 불러오지 못했습니다.');
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [kind]);

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
                <Link key={index} href={`/${kind}/${item.id}`}>
                    <div key={index} className="group">
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
            ))}
        </div>
    );
}