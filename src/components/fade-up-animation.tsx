'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeUpWrapperProps {
    children: React.ReactNode;
    delay?: number; // ms
}
export default function FadeUpWrapper({ children, delay = 0 }: FadeUpWrapperProps) {
    const ref = useRef<HTMLDivElement>(null!);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out transform ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
            }`}
        >
            {children}
        </div>
    );
}