import { notFound } from "next/navigation";
import Image from "next/image";
import {commerceItems} from "@/data/commerceData";

interface Props {
    params: {  id: string };
}

export default async function CommerceDetail({ params }: Props) {
    const { id } = await params;
    const item = commerceItems.find((item) => item.id.toString() === id);

    if (!item) return notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
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

            <div className="w-125 h-1 bg-gray-400 rounded-xl mb-6 mx-auto" />

            <div className="flex space-y-5 justify-center pt-5">
                {item.imageUrls?.map((img, i) => (
                    <div key={i} className="relative w-full h-60">
                        <Image
                            src={img}
                            alt={`${item.title} - ${i + 1}`}
                            fill
                            className="object-cover rounded"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
