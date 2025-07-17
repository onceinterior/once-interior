import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-4 px-6 shadow-md bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">ONCE INTERIOR</h1>
                <nav className="text-xl space-x-16 font-bold">
                    <Link href="/about" className="hover:text-[#a68b5b] transition-colors">회사소개</Link>
                    <Link href="/residence" className="hover:text-[#a68b5b] transition-colors">주거공간</Link>
                    <Link href="/commerce" className="hover:text-[#a68b5b] transition-colors">상업공간</Link>
                    <Link href="/contact" className="hover:text-[#a68b5b] transition-colors">문의하기</Link>
                </nav>
            </div>
        </header>
    );
}