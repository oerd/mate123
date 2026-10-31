import React from 'react';
import { motion } from 'framer-motion';

export type MascotMood = 'neutral' | 'happy' | 'thinking';

interface MascotProps {
    className?: string;
    isAnimating?: boolean;
    feedback?: 'correct' | 'incorrect' | null;
    mood?: MascotMood;
}

export const Mascot = ({ className = '', isAnimating = false, feedback = null, mood }: MascotProps) => {
    const resolvedMood: MascotMood = mood ?? (feedback === 'correct' ? 'happy' : feedback === 'incorrect' ? 'thinking' : 'neutral');

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
            data-mood={resolvedMood}
            animate={getAnimationVariants()}
        >
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-neo-ink drop-shadow-[4px_4px_0_var(--neo-shadow)]"
            >
                <path d="M50 80 C30 60, 30 30, 40 20 C45 30, 60 50, 70 60 Z" fill="#FB923C" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
                <path d="M150 80 C170 60, 170 30, 160 20 C155 30, 140 50, 130 60 Z" fill="#FB923C" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />

                <path d="M40 180 C40 80, 160 80, 160 180 Z" fill="#A855F7" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
                <path d="M60 180 C60 120, 140 120, 140 180 Z" fill="#FB923C" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />

                {resolvedMood === 'happy' ? (
                    <>
                        <path d="M64 102 Q80 84 96 102" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                        <path d="M104 102 Q120 84 136 102" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                        <path d="M68 124 Q100 172 132 124 Z" fill="white" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
                        <path d="M82 134 Q100 160 118 134 Z" fill="#EF4444" />
                    </>
                ) : (
                    <>
                        <circle cx="80" cy="100" r="18" fill="white" stroke="currentColor" strokeWidth="6" />
                        <circle cx={resolvedMood === 'thinking' ? 86 : 80} cy={resolvedMood === 'thinking' ? 94 : 100} r="6" fill="black" />
                        <circle cx="84" cy="96" r="3" fill="white" />
                        <circle cx="120" cy="100" r="18" fill="white" stroke="currentColor" strokeWidth="6" />
                        <circle cx={resolvedMood === 'thinking' ? 126 : 120} cy={resolvedMood === 'thinking' ? 94 : 100} r="6" fill="black" />
                        <circle cx="124" cy="96" r="3" fill="white" />
                        {resolvedMood === 'thinking' ? (
                            <>
                                <path d="M62 78 L94 84" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                <path d="M106 80 L138 66" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                <path d="M84 142 Q100 134 116 142" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                            </>
                        ) : (
                            <>
                                <path d="M75 130 Q100 160 125 130" fill="white" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                <path d="M85 136 Q100 150 115 136" fill="#EF4444" />
                            </>
                        )}
                    </>
                )}

                {resolvedMood === 'happy' ? (
                    <>
                        <path d="M42 130 Q10 110 22 86" fill="#A855F7" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="18" cy="82" r="12" fill="#4ADE80" stroke="currentColor" strokeWidth="6" />
                        <path d="M158 130 Q190 110 178 86" fill="#A855F7" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="182" cy="82" r="12" fill="#4ADE80" stroke="currentColor" strokeWidth="6" />
                    </>
                ) : (
                    <>
                        <path d="M42 130 Q10 140 20 160" fill="#A855F7" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="15" cy="155" r="12" fill="#4ADE80" stroke="currentColor" strokeWidth="6" />
                        <path d="M5 155 L10 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                        <path d="M158 130 Q190 140 180 160" fill="#A855F7" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="185" cy="155" r="12" fill="#4ADE80" stroke="currentColor" strokeWidth="6" />
                        <path d="M195 155 L190 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
            </svg>
        </motion.div>
    );
};
