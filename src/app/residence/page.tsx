import Image from "next/image";

export default function Residence() {
    // 예시 이미지 배열 (실제 이미지로 교체하세요)
    const galleryItems = [
        { src: "/image/residence1.jpg", title: "유성구 신성동 삼성한울아파트 37평" },
        { src: "/image/residence2.jpg", title: "유성구 장대동 월드컵패밀리타운 34평" },
        { src: "/image/residence3.jpg", title: "유성구 어은동 한빛아파트 38평" },
        { src: "/image/residence4.jpg", title: "유성구 원신흥동 양우내안애 33평" },
        { src: "/image/residence5.jpg", title: "유성구 반석동 반석마을7단지 34평" },
        { src: "/image/residence6.jpg", title: "대덕구 법동 보람아파트 30평" },
    ];

    return (
        <div>
            {/* 상단 헤더 */}
            <section className="relative w-full h-[300px]">
                <Image
                    src="/image/residence-banner.jpg"
                    alt="주거공간 배너 이미지"
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
                        주거 공간
                    </h1>
                </div>
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