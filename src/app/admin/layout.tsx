"use client";

import { useRouter } from "next/navigation";
import {logout, observeAuthState} from "@/lib/api";
import {useEffect, useState} from "react";
import LoadingSpinner from "@/components/loadingSpinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = observeAuthState((user) => {
            if (!user) {
                router.replace("/login");
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    async function handleLogout() {
        await logout();
        router.replace("/");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex justify-end p-4 bg-gray-100">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-400 text-shadow-md hover:cursor-pointer"
                >
                    로그아웃
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </>
    );
}