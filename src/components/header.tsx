import Link from "next/link";
import Image from "next/image";
import KakaoHeader from "@/components/contact-header";

export default function Header() {
    return (
        <header className="w-full py-4 px-6 shadow-md bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/">
                    <Image
                        src="/image/watermark.png"
                        alt="logo"
                        width={200}
                        height={50}
                        className="cursor-pointer"
                    />
                </Link>
                <nav className="flex items-center text-xl space-x-10 font-bold">
                    <div className="px-1 py-2">
                        <Link href="/about" className="hover:text-[#a68b5b] transition-colors">About Once</Link>
                    </div>
                    <div className="px-2 py-2">
                        <Link href="/residence" className="hover:text-[#a68b5b] transition-colors">주거공간</Link>
                    </div>
                    <div className="px-2 py-2">
                        <Link href="/commerce" className="hover:text-[#a68b5b] transition-colors">상업공간</Link>
                    </div>
                    <KakaoHeader />
                </nav>
            </div>
        </header>
    );
}