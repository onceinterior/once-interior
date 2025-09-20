import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ConsultHoverButton from "@/components/hoverButton";

export const metadata = {
    title: '원스인테리어',
    description: '도봉구 인테리어 전문. 30년을 지켜 온 타협하지 않는 퀄리티',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body className="text-gray-900 bg-white">
                <Header />
                <main>{children}</main>
                <Footer />
                <ConsultHoverButton />
            </body>
        </html>
    )
}
