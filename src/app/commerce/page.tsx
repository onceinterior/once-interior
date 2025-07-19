import Image from "next/image";

export default function Commerce() {
    // 예시 이미지 배열 (실제 이미지로 교체하세요)
    const galleryItems = [
        { src: "/image/commerce/동두천_902댕스쿨.jpg", title: "동두천 902댕스쿨 애견시설" },
        { src: "/image/commerce/방학동_한평생교육원.jpg", title: "방학동 한평생교육원 사무실" },
        { src: "/image/commerce/조치원_JS영수학원.jpg", title: "조치원 JS영수학원" },
        { src: "/image/commerce/조치원_가장빛날너학원.jpg", title: "조치원 가장빛날너학원" },
        { src: "/image/commerce/창동_한평생교육원.jpg", title: "창동 한평생교육원 사무실" },
    ];

    return (
        <div>
            {/* 상단 헤더 */}
            <section className="relative w-full h-[400px]">
                <Image
                    src="/image/commerce-banner.jpg"
                    alt="상업공간 배너 이미지"
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
                        상업 공간
                    </h1>
                </div>
            </section>

            {/* 갤러리 */}
            <section>
                <div className="max-w-6xl mx-auto px-6 py-20 space-y-10">
                    <h2 className="text-3xl font-semibold mb-10 text-center">시공 사례</h2>

                    {/* 구분선 */}
                    <div className="w-16 h-1 bg-[#444] mx-auto rounded-full"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
                        {galleryItems.map((item, index) => (
                            <div key={index} className="group">
                                <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md cursor-pointer">
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition duration-300 group-hover:brightness-110"
                                    />
                                </div>
                                <p className="mt-4 text-center text-lg text-gray-900">{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}