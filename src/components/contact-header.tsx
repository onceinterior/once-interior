"use client"
import Image from "next/image";

export default function KakaoHeader() {
    return (
        <div>
            <button
                onClick={() =>
                    window.open("https://open.kakao.com/me/once_interior", "_blank")
                }
                className="bg-[#FEE500] text-black px-4 py-2 rounded-xl text-xl font-semibold hover:bg-[#F5DC00] transition flex items-center gap-2 hover:cursor-pointer"
            >
                <Image
                    width="100"
                    height="100"
                    src="/icons/kakaotalk.png"
                    alt="카카오톡 아이콘"
                    className="w-6 h-6 object-contain"
                />
                문의하기
            </button>
        </div>
    )
}