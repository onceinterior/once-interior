"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import {BlogHeader, KakaoHeader} from "@/components/contact-header";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

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

                {/* PC GNB */}
                <nav className="hidden md:flex items-center text-xl space-x-8 font-bold">
                    <Link href="/about" className="hover:text-[#a68b5b] transition-colors">About Once</Link>
                    <Link href="/residence" className="hover:text-[#a68b5b] transition-colors">주거공간</Link>
                    <Link href="/commerce" className="hover:text-[#a68b5b] transition-colors">상업공간</Link>
                    <KakaoHeader />
                    <BlogHeader />
                </nav>

                {/* Mobile Hamburger Button */}
                <button className="md:hidden text-gray-800" onClick={toggleMenu}>
                    <Bars3Icon className="w-8 h-8" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-opacity-40 z-10" onClick={toggleMenu}>
                    <div
                        className="absolute w-full bg-white shadow-2xl rounded-b-xl p-6 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 닫기 버튼 */}
                        <div className="flex justify-end">
                            <button onClick={toggleMenu} className="p-2 rounded hover:bg-gray-100">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* 메뉴 항목 */}
                        <nav className="mt-4 flex flex-col gap-6 text-xl font-semibold text-gray-800">
                            <Link href="/about" onClick={toggleMenu} className="hover:text-[#a68b5b] transition-colors">
                                About Once
                            </Link>
                            <Link href="/residence" onClick={toggleMenu} className="hover:text-[#a68b5b] transition-colors">
                                주거공간
                            </Link>
                            <Link href="/commerce" onClick={toggleMenu} className="hover:text-[#a68b5b] transition-colors">
                                상업공간
                            </Link>
                        </nav>

                    </div>
                </div>
            )}
        </header>
    );
}