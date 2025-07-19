import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white text-[#444] text-sm leading-relaxed">
            <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
                <div className="flex items-center justify-center w-full">
                    <Image src="/image/logo.jpg" alt="footer_logo" width={500} height={400} />
                </div>

                <div className="text-[13px] text-[#666] space-y-1">
                    <div>등록번호 : 865-10-01104</div>
                    <div>
                        E-mail : <a href="mailto:once_interior@naver.com" className="hover:underline">once_interior@naver.com</a>
                    </div>
                    <div>Office. 서울특별시 도봉구 방학로 183 1층 (거구빌딩)</div>
                    <div>Tel. 010-3633-1874</div>
                </div>
            </div>

            <div className="text-center text-xs text-[#aaa] py-4 border-t border-gray-200">
                © 2025 원스인테리어. All rights reserved.
            </div>
        </footer>
    );
}