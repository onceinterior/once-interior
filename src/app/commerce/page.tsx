import Image from "next/image";

export default function Commerce() {
    // 예시 이미지 배열 (실제 이미지로 교체하세요)
    const galleryItems = [
        { src: "/image/commercial1.jpg", title: "유성 장대동 LXzin명인테리어대리점 전경" },
        { src: "/image/commercial2.jpg", title: "롤링파스타 유성점" },
        { src: "/image/commercial3.jpg", title: "세종시 초월홍삼" },
        { src: "/image/commercial4.jpg", title: "둔산동 롤링파스타" },
        { src: "/image/commercial5.jpg", title: "천안 인사이트" },
        { src: "/image/commercial6.jpg", title: "소방서 감염관리실" },
    ];

    return (
        <div>
            {/* 상단 헤더 */}
            <section className="bg-gray-300 py-24 text-center px-4 text-white">
                <h1
                    className="text-4xl font-bold mb-4"
                    style={{
                        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    상업 공간
                </h1>
            </section>

            {/* 갤러리 */}
            <section className="max-w-6xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">시공 사례</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
                    {galleryItems.map((item, index) => (
                        <div key={index} className="group">
                            <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
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
            </section>
        </div>
    );
}