import Image from "next/image";

export default function Home() {
    return (
        <div className="text-[#333]">

            {/* Hero Section */}
            <section className="relative w-full h-screen">
                <Image
                    src="/image/banner.jpg"
                    alt="Hero"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
                    <h1 className="text-5xl font-bold mb-4">ONCE INTERIOR</h1>
                    <h2 className="text-3xl">고객님을 위한 단 하나의 인테리어</h2>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="max-w-6xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-10">시공 갤러리</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* 실제 이미지로 교체 */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-300 rounded-xl overflow-hidden shadow">
                            {/*<Image*/}
                            {/*    src={`/gallery/img${i + 1}.jpg`}*/}
                            {/*    alt={`시공 이미지 ${i + 1}`}*/}
                            {/*    width={600}*/}
                            {/*    height={600}*/}
                            {/*    className="object-cover w-full h-full"*/}
                            {/*/>*/}
                        </div>
                    ))}
                </div>
            </section>

            {/* Menu Section */}
            <section className="relative h-[500px] w-full">
                <Image
                    src="/menu-bg.jpg" // 배경 이미지
                    alt="소개 배경"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-4 text-white text-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">원스인테리어는</h2>
                        <p className="text-lg leading-relaxed max-w-xl">
                            공간의 가치를 높이고<br />
                            고객의 삶을 더 아름답게 만드는<br />
                            프리미엄 인테리어 브랜드입니다.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}