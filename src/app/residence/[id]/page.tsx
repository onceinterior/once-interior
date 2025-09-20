import { notFound } from "next/navigation";
import DetailPage from "@/components/detailPage";
import {getPost} from "@/lib/api";
import {Kind} from "@/data/type";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ResidenceDetail({ params }: Props) {
    const { id } = await params;
    const post = await getPost("residence" as Kind, id);

    if (!post) return notFound();

    return <DetailPage backHref="/residence" post={post} />;
}
