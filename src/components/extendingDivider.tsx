'use client';

import { useEffect, useState } from 'react';

export default function ExtendingDivider() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`h-1 bg-slate-600 rounded-xl mb-6 mx-auto transition-all duration-700 ease-out`}
            style={{
                width: isVisible ? '600px' : '100px',
            }}
        />
    );
}