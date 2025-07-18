"use client"

import Image from "next/image";

export default function Contact() {
    return (
        <div>
            {/* CTA 영역 */}
            <section className="bg-gray-300 py-24 text-center px-4 text-white">
                <h1
                    className="text-4xl font-bold mb-4"
                    style={{
                        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    고객상담 및 문의
                </h1>
            </section>

            {/* 정보 + 버튼 영역 */}
            <section className="bg-white py-20 px-4">
                <div>
                    {/* 카카오 버튼 */}
                    <div className="flex justify-center pt-6">
                        <button
                            onClick={() =>
                                window.open("https://open.kakao.com/o/random", "_blank") // TODO 수정 필요
                            }
                            className="bg-[#FEE500] text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#F5DC00] transition flex items-center gap-2 hover:cursor-pointer"
                        >
                            <Image
                                width="100"
                                height="100"
                                src="/icons/kakaotalk.png"
                                alt="카카오톡 아이콘"
                                className="w-6 h-6 object-contain"
                            />
                            카카오톡으로 상담하기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}