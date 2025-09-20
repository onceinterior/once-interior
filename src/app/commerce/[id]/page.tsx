import { notFound } from "next/navigation";
import DetailPage from "@/components/detailPage";
import {getPost} from "@/lib/api";
import {Kind} from "@/data/type";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function CommerceDetail({ params }: Props) {
    const { id } = await params;
    const post = await getPost("commerce" as Kind, id);

    if (!post) return notFound();

    return <DetailPage backHref="/commerce" post={post} />;
}
