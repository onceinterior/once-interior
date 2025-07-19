import Image from "next/image";

export default function About() {
    return (
        <div>
            {/* 상단 헤더 */}
            <section className="relative w-full h-[300px]">
                <Image
                    src="/image/about-banner.jpg"
                    alt="회사 배너 이미지"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
                    <h1
                        className="text-4xl font-bold mb-4"
                        style={{
                            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        회사 소개
                    </h1>
                </div>
            </section>

            {/* 소개 본문 */}
            <section className="bg-[#fafafa]">
                <div className="max-w-2xl mx-auto px-6 py-20 text-lg text-[#444] space-y-10">
                    {/* 헤드라인 */}
                    <h2 className="text-3xl font-bold text-center text-gray-800">
                        &#34;당신의 공간을 더 특별하게, 더 편안하게&#34;
                    </h2>

                    {/* 구분선 */}
                    <div className="w-16 h-1 bg-[#444] mx-auto rounded-full"></div>

                    {/* 본문 내용 */}
                    <div className="space-y-6 leading-relaxed">
                        <p>
                            저희는 <strong className="text-[#222]">주거 및 상업 공간 인테리어</strong>를 전문으로 하는 인테리어 업체입니다. <br />
                            디자인부터 시공까지 전 과정을 책임지고, <br />
                            고객의 라이프스타일과 취향에 맞춘 <strong className="text-[#222]">맞춤형 공간</strong>을 제안합니다.
                        </p>
                        <p>
                            작은 변화로 큰 만족을 드리는 것이 저희의 목표입니다. <br />
                            오랜 경험과 꼼꼼한 시공, <strong className="text-[#222]">책임감 있는 A/S</strong>로 신뢰받는 파트너가 되겠습니다.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}