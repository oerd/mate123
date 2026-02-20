import React from 'react';

export const Mascot = ({ className = '' }: { className?: string }) => {
    return (
        <div className={`relative ${className}`} aria-hidden="true">
            <svg
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[4px_4px_0_rgba(0,0,0,1)] translate-x-4 translate-y-8"
            >
                <defs>
                    {/* Horn Paths */}
                    <path id="leftHorn" d="M 115 80 Q 85 20 90 10 Q 110 20 135 60 Z" />
                    <path id="rightHorn" d="M 185 80 Q 215 20 210 10 Q 190 20 165 60 Z" />
                    <clipPath id="leftHornClip"><use href="#leftHorn" /></clipPath>
                    <clipPath id="rightHornClip"><use href="#rightHorn" /></clipPath>
                </defs>

                {/* Left Orange Fur Tufts */}
                <path d="M 90 120 L 60 110 L 80 130 L 50 145 L 80 160 L 65 180 L 90 170 Z" fill="#FB923C" stroke="black" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />

                {/* Right Orange Fur Tufts */}
                <path d="M 210 120 L 240 110 L 220 130 L 250 145 L 220 160 L 235 180 L 210 170 Z" fill="#FB923C" stroke="black" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />

                {/* Left Horn */}
                <use href="#leftHorn" fill="#A3E635" />
                <g clipPath="url(#leftHornClip)">
                    <rect x="70" y="25" width="80" height="15" fill="#FB923C" transform="rotate(-30 110 35)" />
                    <rect x="70" y="55" width="80" height="15" fill="#FB923C" transform="rotate(-30 110 65)" />
                </g>
                <use href="#leftHorn" fill="none" stroke="black" strokeWidth="10" strokeLinejoin="round" />

                {/* Right Horn */}
                <use href="#rightHorn" fill="#A3E635" />
                <g clipPath="url(#rightHornClip)">
                    <rect x="150" y="25" width="80" height="15" fill="#FB923C" transform="rotate(30 190 35)" />
                    <rect x="150" y="55" width="80" height="15" fill="#FB923C" transform="rotate(30 190 65)" />
                </g>
                <use href="#rightHorn" fill="none" stroke="black" strokeWidth="10" strokeLinejoin="round" />

                {/* Main Purple Body */}
                <path d="M 90 280 C 70 150, 80 80, 150 70 C 220 80, 230 150, 210 280 Z" fill="#A855F7" stroke="black" strokeWidth="10" strokeLinejoin="round" />

                {/* Orange Belly */}
                <path d="M 97 280 C 100 200, 200 200, 203 280 Z" fill="#FB923C" stroke="black" strokeWidth="10" strokeLinejoin="round" />

                {/* Left Arm (Orange) - Pointing Left */}
                <path d="M 80 200 
                 L 60 195
                 Q 40 200 40 185
                 Q 40 175 50 175
                 Q 40 175 40 165
                 Q 40 155 50 155
                 L 20 155 Q 5 155 5 145 Q 5 135 25 135
                 L 50 135
                 L 50 115 Q 50 100 65 105 Q 75 110 65 125
                 L 65 150
                 L 95 170 Z" fill="#FB923C" stroke="black" strokeWidth="10" strokeLinejoin="round" />

                {/* Right Arm (Green) - Pointing Left Across Belly */}
                <path d="M 230 270 
                 L 200 250
                 Q 175 255 175 240
                 Q 175 230 185 230
                 Q 175 230 175 220
                 Q 175 210 185 210
                 L 140 210 Q 125 210 125 200 Q 125 190 145 190
                 L 180 190
                 L 180 170 Q 180 155 195 160 Q 205 165 195 180
                 L 195 210
                 L 220 230
                 L 235 250 Z" fill="#4ADE80" stroke="black" strokeWidth="10" strokeLinejoin="round" />

                {/* Eyes Backing */}
                <path d="M 125 115 L 175 115" stroke="white" strokeWidth="56" strokeLinecap="round" />

                {/* Left Eye */}
                <circle cx="125" cy="115" r="28" fill="white" stroke="black" strokeWidth="10" />
                {/* Right Eye */}
                <circle cx="175" cy="115" r="28" fill="white" stroke="black" strokeWidth="10" />

                {/* Pupils */}
                <circle cx="135" cy="115" r="8" fill="black" />
                <circle cx="165" cy="115" r="8" fill="black" />

                {/* Floating Eyebrows */}
                <path d="M 100 80 Q 120 70 135 80" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />
                <path d="M 200 80 Q 180 70 165 80" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />

                {/* Big Mouth */}
                <path d="M 110 140 Q 150 150 190 140 C 200 210, 100 210, 110 140 Z" fill="black" stroke="black" strokeWidth="10" strokeLinejoin="round" />

                {/* Top Teeth (4) */}
                <path d="M 115 145 L 122 165 L 128 147 Z" fill="white" stroke="#E5E5E5" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 134 147 L 140 168 L 148 149 Z" fill="white" stroke="#E5E5E5" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 154 149 L 160 168 L 168 147 Z" fill="white" stroke="#E5E5E5" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 174 147 L 180 165 L 187 145 Z" fill="white" stroke="#E5E5E5" strokeWidth="2" strokeLinejoin="round" />

                {/* Bottom Teeth (2) */}
                <path d="M 115 185 L 122 170 L 128 193 Z" fill="white" stroke="#E5E5E5" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 174 193 L 180 170 L 187 185 Z" fill="white" stroke="#E5E5E5" strokeWidth="2" strokeLinejoin="round" />

                {/* Red Tongue */}
                <path d="M 130 185 Q 150 160 170 185 Q 165 205 150 205 Q 135 205 130 185 Z" fill="#EF4444" stroke="black" strokeWidth="4" strokeLinejoin="round" />

            </svg>
        </div>
    );
};
