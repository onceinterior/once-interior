import { notFound } from "next/navigation";
import { residenceItems } from "@/data/residenceData";
import DetailPage from "@/components/detailPage";

interface Props {
    params: {  id: string };
}

export default async function ResidenceDetail({ params }: Props) {
    const { id } = await params;
    const item = residenceItems.find((item) => item.id === id);

    if (!item) return notFound();

    return <DetailPage backHref="/residence" item={item} />;
}
