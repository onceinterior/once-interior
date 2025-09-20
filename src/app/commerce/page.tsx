import Image from "next/image";
import GalleryGrid from "@/components/galleryGrid";

export default function Commerce() {
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

                    <GalleryGrid kind='commerce' />
                </div>
            </section>
        </div>
    );
}