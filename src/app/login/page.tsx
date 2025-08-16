"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {FirebaseError} from "@firebase/app";
import {login} from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            await login(email, password);
            router.push("/admin");
        } catch (err) {
            const errorMessage = err instanceof FirebaseError ? err.message : "알 수 없는 오류";
            setError("로그인 실패: " + errorMessage);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">관리자 로그인</h1>
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block mb-1 font-medium">이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-gray-500 text-white font-bold text-xl py-3 rounded hover:bg-gray-400 hover:cursor-pointer transition-colors duration-500 ease-in-out"
                >
                    로그인
                </button>
            </form>
        </div>
    );
}