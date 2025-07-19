"use client"
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";

export default function KakaoHeader() {
    return (
        <div>
            <button
                onClick={() =>
                    window.open("https://open.kakao.com/me/once_interior", "_blank")
                }
                className="bg-[#FEE500] text-black px-4 py-2 rounded-xl text-xl font-semibold hover:bg-[#F5DC00] transition flex items-center gap-2 hover:cursor-pointer"
            >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-black" />
                문의하기
            </button>
        </div>
    )
}