import Image from "next/image";
import Link from "next/link";

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
                    className="bg-[#666666] text-white p-2 rounded-lg hover:bg-[#777777] hover:cursor-pointer"
                >
                    ⬅ 목록으로
                </Link>
            </div>

            {/* 썸네일 + 타이틀 */}
            <div className="mb-6 flex flex-col items-center space-y-4">
                <div className="relative">
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        height={300}
                        width={300}
                        className="object-cover rounded"
                    />
                </div>
                <h1 className="text-4xl font-bold">{item.title}</h1>
            </div>

            {/* 구분선 */}
            <div className="w-28 h-1 bg-gray-400 rounded-xl mb-6 mx-auto" />

            {/* 본문 이미지들 */}
            <div className="flex flex-col space-y-5 justify-center pt-5 items-center">
                {item.imageUrls?.map((img, i) => (
                    <div key={i} className="relative">
                        <Image
                            src={img}
                            alt={`${item.title} - ${i + 1}`}
                            height={400}
                            width={500}
                            className="object-cover rounded-xl"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}