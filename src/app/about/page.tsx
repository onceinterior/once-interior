import Image from "next/image";

export default function About() {
    return (
        <div>
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
        </div>
    );
}