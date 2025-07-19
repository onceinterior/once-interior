"use client"

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

export default function ConsultHoverButton() {

    return (
        <button
            onClick={() =>
                window.open("https://open.kakao.com/me/once_interior", "_blank")
            }
            className="fixed bottom-6 right-6 bg-yellow-300 p-5 rounded-full shadow-lg cursor-pointer"
        >
            <ChatBubbleLeftRightIcon className="w-7 h-7 text-black" />
        </button>
    );
}