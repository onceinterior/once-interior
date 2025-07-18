import Image from "next/image";

export default function Residence() {
    // 예시 이미지 배열 (실제 이미지로 교체하세요)
    const galleryImages = [
        "/image/residence1.jpg",
        "/image/residence2.jpg",
        "/image/residence3.jpg",
        "/image/residence4.jpg",
        "/image/residence5.jpg",
        "/image/residence6.jpg",
    ];

    return (
        <div>
            <section className="bg-gray-300 py-24 text-center px-4 text-white">
                <h1
                    className="text-4xl font-bold mb-4"
                    style={{
                        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    주거 공간
                </h1>
            </section>

            {/* 갤러리 영역 */}
            <section className="max-w-6xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">시공 사례</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {galleryImages.map((src, index) => (
                        <div key={index} className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
                            <Image
                                src={src}
                                alt={`주거공간 이미지 ${index + 1}`}
                                width={600}
                                height={600}
                                className="object-cover transition-transform duration-300 hover:brightness-110"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}