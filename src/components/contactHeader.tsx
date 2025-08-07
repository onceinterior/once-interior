"use client"
import Image from "next/image";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";

export function KakaoHeader() {
    return (
        <div>
            <button
                onClick={() =>
                    window.open("https://open.kakao.com/me/once_interior", "_blank")
                }
                className="bg-[#FEE500] text-black px-2 py-2 text-xl rounded-xl flex items-center gap-2 hover:cursor-pointer"
            >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-black" />
            </button>
        </div>
    )
}

export function BlogHeader() {
    return (
        <div>
            <button
                onClick={() =>
                    window.open("https://blog.naver.com/once_interior", "_blank")
                }
                className="bg-[#03C75A] flex items-center gap-2 hover:cursor-pointer"
            >
                <Image
                    src="/icon/naver-blog.png"
                    alt="블로그 아이콘"
                    width={36}
                    height={36}
                    className="rounded-lg"
                />
            </button>
        </div>
    );
}