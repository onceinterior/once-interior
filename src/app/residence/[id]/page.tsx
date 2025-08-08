import { notFound } from "next/navigation";
import Image from "next/image";
import { residenceItems } from "@/data/residenceData";
import Link from "next/link";

interface Props {
    params: {  id: string };
}

export default async function ResidenceDetail({ params }: Props) {
    const { id } = await params;
    const item = residenceItems.find((item) => item.id.toString() === id);

    if (!item) return notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-10">
            <div>
                <Link href="/residence" className="bg-[#666666] text-white p-2 rounded-lg hover:bg-[#777777] hover:cursor-pointer">
                    ⬅ 목록으로
                </Link>
            </div>
            
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

            <div className="w-28 h-1 bg-gray-400 rounded-xl mb-6 mx-auto" />

            <div className="flex space-y-5 justify-center pt-5">
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
