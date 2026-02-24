import React from 'react';
import { motion } from 'framer-motion';

interface MascotProps {
    className?: string;
    isAnimating?: boolean;
    feedback?: 'correct' | 'incorrect' | null;
}

export const Mascot = ({ className = '', isAnimating = false, feedback = null }: MascotProps) => {
    const getAnimationVariants = () => {
        if (!isAnimating) return { x: 0, y: 0 };
        if (feedback === 'incorrect') {
            return {
                x: [-15, 15, -15, 15, 0],
                transition: { duration: 0.4 }
            };
        }
        if (feedback === 'correct') {
            return {
                y: [0, -60, 0, -30, 0],
                transition: { duration: 0.5 }
            };
        }
        return { x: 0, y: 0 };
    };

    return (
        <motion.div
            className={`relative ${className}`}
            aria-hidden="true"
            animate={getAnimationVariants()}
        >
            {/* Cute Purple Monster SVG */}
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
            >
                {/* Left Horn */}
                <path d="M50 80 C30 60, 30 30, 40 20 C45 30, 60 50, 70 60 Z" fill="#FB923C" stroke="black" strokeWidth="8" strokeLinejoin="round" />
                {/* Right Horn */}
                <path d="M150 80 C170 60, 170 30, 160 20 C155 30, 140 50, 130 60 Z" fill="#FB923C" stroke="black" strokeWidth="8" strokeLinejoin="round" />

                {/* Main Body */}
                <path d="M40 180 C40 80, 160 80, 160 180 Z" fill="#A855F7" stroke="black" strokeWidth="8" strokeLinejoin="round" />

                {/* Orange Belly */}
                <path d="M60 180 C60 120, 140 120, 140 180 Z" fill="#FB923C" stroke="black" strokeWidth="8" strokeLinejoin="round" />

                {/* Left Eye */}
                <circle cx="80" cy="100" r="18" fill="white" stroke="black" strokeWidth="6" />
                <circle cx="80" cy="100" r="6" fill="black" />
                <circle cx="84" cy="96" r="3" fill="white" />

                {/* Right Eye */}
                <circle cx="120" cy="100" r="18" fill="white" stroke="black" strokeWidth="6" />
                <circle cx="120" cy="100" r="6" fill="black" />
                <circle cx="124" cy="96" r="3" fill="white" />

                {/* Mouth */}
                <path d="M75 130 Q100 160 125 130" fill="white" stroke="black" strokeWidth="6" strokeLinecap="round" />
                <path d="M85 136 Q100 150 115 136" fill="#EF4444" />

                {/* Left Arm Hand Pointing */}
                <path d="M42 130 Q10 140 20 160" fill="#A855F7" stroke="black" strokeWidth="8" strokeLinecap="round" />
                <circle cx="15" cy="155" r="12" fill="#4ADE80" stroke="black" strokeWidth="6" />
                <path d="M5 155 L10 145" stroke="black" strokeWidth="6" strokeLinecap="round" />

                {/* Right Arm Thumbs Up */}
                <path d="M158 130 Q190 140 180 160" fill="#A855F7" stroke="black" strokeWidth="8" strokeLinecap="round" />
                <circle cx="185" cy="155" r="12" fill="#4ADE80" stroke="black" strokeWidth="6" />
                <path d="M195 155 L190 145" stroke="black" strokeWidth="6" strokeLinecap="round" />
            </svg>
        </motion.div>
    );
};
