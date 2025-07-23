import Image from "next/image";
import {residenceGalleryItems} from "@/data/residenceData";
import {commerceGalleryItems} from "@/data/commerceData";
import FadeUpWrapper from "@/components/fade-up-animation";

export default function Home() {
    const combinedGalleryItems = [...residenceGalleryItems, ...commerceGalleryItems];

    return (
        <div>
            {/* Hero Section */}
            <section className="relative w-full h-[800px]">
                <Image
                    src="/image/main-banner.jpg"
                    alt="메인 배너 이미지"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
                    <FadeUpWrapper>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            ONCE INTERIOR
                        </h1>
                    </FadeUpWrapper>
                    <FadeUpWrapper delay={50}>
                        <h3 className="text-2xl md:text-3xl">
                            고객님을 위한 단 하나의 인테리어
                        </h3>
                    </FadeUpWrapper>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="max-w-6xl mx-auto px-4 py-20 space-y-10">
                <h2 className="text-3xl font-bold text-center mb-10">시공 갤러리</h2>

                {/* 구분선 */}
                <div className="w-16 h-1 bg-[#444] mx-auto rounded-full"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {combinedGalleryItems.map((item, index) => (
                        <FadeUpWrapper delay={index * 50}>
                            <div key={index} className="group">
                                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md cursor-pointer">
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition duration-300 group-hover:brightness-110"
                                    />
                                </div>
                            </div>
                        </FadeUpWrapper>
                    ))}
                </div>
            </section>

            {/* Description Section */}
            <section className="relative h-[500px] w-full">
                <Image
                    src="/image/main-middle.jpg"
                    alt="메인 중앙"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-4 text-white text-center">
                    <div>
                        <FadeUpWrapper>
                            <h2 className="text-4xl font-bold mb-4">원스인테리어는</h2>
                        </FadeUpWrapper>
                        <FadeUpWrapper delay={100}>
                            <p className="text-xl leading-relaxed max-w-xl">
                                공간의 가치를 높이고<br />
                                고객의 삶을 더 아름답게 만드는<br />
                                프리미엄 인테리어 브랜드입니다.
                            </p>
                        </FadeUpWrapper>
                    </div>
                </div>
            </section>

        </div>
    );
}