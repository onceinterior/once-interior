import {EnvelopeIcon, PhoneIcon} from "@heroicons/react/16/solid";

export default function Footer() {
    return (
        <footer className="bg-[#f6f6f6] text-[#444] text-sm leading-relaxed">
            <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 text-base">
                {/* 왼쪽 영역 */}
                <div className="space-y-2">
                    <div className="flex">
                        <span className="w-28 font-semibold">상호명</span>
                        <span> 원스인테리어</span>
                    </div>
                    <div className="flex">
                        <span className="w-28 font-semibold">대표자</span>
                        <span> 원기봉</span>
                    </div>
                    <div className="flex">
                        <span className="w-28 font-semibold">사업자등록번호</span>
                        <span> 000-0000-00000</span>
                    </div>
                    <div className="flex">
                        <span className="w-28 font-semibold">영업시간</span>
                        <span> 월~토 08:00 ~ 20:00</span>
                    </div>
                    <div className="flex">
                        <span className="w-28 font-semibold">주소</span>
                        <span> 서울 도봉구 방학로 183 (유덕기내과 상가 1층)</span>
                    </div>
                </div>

                {/* 오른쪽 영역 */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-[#444]" />
                        <span>010-3633-1874</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-[#444]" />
                        <span>once_interior@naver.com</span>
                    </div>
                </div>
            </div>

            {/* 하단 중앙 */}
            <div className="text-center text-xs text-[#888] py-4 border-t border-gray-200">
                © 2025 원스인테리어. All rights reserved.
            </div>
        </footer>
    )
}