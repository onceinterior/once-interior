import { notFound } from "next/navigation";
import {commerceItems} from "@/data/commerceData";
import DetailPage from "@/components/detailPage";

interface Props {
    params: {  id: string };
}

export default async function CommerceDetail({ params }: Props) {
    const { id } = await params;
    const item = commerceItems.find((item) => item.id.toString() === id);

    if (!item) return notFound();

    return <DetailPage backHref="/commerce" item={item} />;
}
