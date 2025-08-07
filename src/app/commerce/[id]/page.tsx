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
            <h1 className="text-3xl font-bold mb-6">{item.title}</h1>
            <div className="relative w-full h-96 mb-6">
                <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
