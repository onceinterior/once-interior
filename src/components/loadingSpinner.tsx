"use client";

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

export default function LoadingSpinner({
                                           size = 40,
                                           color = "#6b7280",
                                       }: LoadingSpinnerProps) {
    return (
        <div
            className="border-4 border-solid border-t-transparent rounded-full animate-spin"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor: color,
                borderTopColor: "transparent",
            }}
        />
    );
}