import Image from "next/image";

export default function Residence() {
    const galleryItems = [
        { src: "/image/residence/금호2동_28평.jpg", title: "금호2동 28평" },
        { src: "/image/residence/신동아19동_40평.jpg", title: "신동아19동 40평" },
        { src: "/image/residence/쌍문_동익4동_24평.jpg", title: "쌍문 동익4동 24평" },
    ];

    return (
        <div>
            {/* 상단 헤더 */}
            <section className="relative w-full h-[400px]">
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
            <section>
                <div className="max-w-6xl mx-auto px-6 py-20 space-y-10">
                    <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">시공 사례</h2>

                    {/* 구분선 */}
                    <div className="w-16 h-1 bg-[#444] mx-auto rounded-full"></div>

                    {/* 갤러리 */}
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