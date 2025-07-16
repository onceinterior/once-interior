import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-4 px-6 shadow-md bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">ONCE INTERIOR</h1>
                <nav className="space-x-6">
                    <Link href="/about" className="hover:underline">회사소개</Link>
                    <Link href="/house" className="hover:underline">주거공간</Link>
                    <Link href="/industry" className="hover:underline">상업공간</Link>
                    <Link href="/contact" className="hover:underline">문의하기</Link>
                </nav>
            </div>
        </header>
    )
}