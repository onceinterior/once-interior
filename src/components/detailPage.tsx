import Image from "next/image";
import Link from "next/link";
import ExtendingDivider from "@/components/extendingDivider";
import FadeUpWrapper from "@/components/fadeUpWrapper";

export interface DetailItem {
    id: number | string;
    title: string;
    thumbnailUrl: string;
    imageUrls?: string[];
}

interface DetailPageProps {
    backHref: string;
    item: DetailItem;
}

export default function DetailPage({ backHref, item }: DetailPageProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-10">
            {/* 목록으로 */}
            <div>
                <Link
                    href={backHref}
                    className="group inline-flex items-center gap-3 text-gray-700"
                >
                    <svg
                        viewBox="0 0 60 12"
                        className="h-3 w-14 overflow-visible"
                        aria-hidden="true"
                    >
                        {/* 직선 */}
                        <line
                            x1="2"
                            y1="6"
                            x2="58"
                            y2="6"
                            className="stroke-gray-700 transition-transform duration-200 ease-out group-hover:-translate-x-1"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        {/* 위쪽 화살촉 */}
                        <polyline
                            points="10,2 2,6 10,10"
                            className="fill-none stroke-gray-700 transition-transform duration-200 ease-out group-hover:-translate-x-1"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* 텍스트 */}
                    <span className="text-lg font-bold tracking-tight">목록으로</span>
                </Link>
            </div>

            {/* 썸네일 + 타이틀 */}
            <div className="mb-6 flex flex-col items-center space-y-7">
                <div className="relative">
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        height={600}
                        width={600}
                        className="object-cover rounded"
                    />
                </div>
                <h1 className="text-4xl font-bold">{item.title}</h1>
            </div>

            {/* 구분선 */}
            <ExtendingDivider />

            {/* 본문 이미지들 */}
            <div className="flex flex-col space-y-5 justify-center pt-5 items-center">
                {item.imageUrls?.map((img, i) => (
                    <FadeUpWrapper key={i}>
                        <div key={i} className="relative">
                            <Image
                                src={img}
                                alt={`${item.title} - ${i + 1}`}
                                height={400}
                                width={500}
                                className="object-cover rounded-xl"
                            />
                        </div>
                    </FadeUpWrapper>
                ))}
            </div>
        </div>
    );
}