import React from 'react';

export const EnglishFlag = () => (
  <svg viewBox="0 0 60 30" width="50" height="38">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export const GermanFlag = () => (
  <svg viewBox="0 0 5 3" width="50" height="38">
    <rect width="5" height="3" y="0" x="0" fill="#000"/>
    <rect width="5" height="2" y="1" x="0" fill="#D00"/>
    <rect width="5" height="1" y="2" x="0" fill="#FFCE00"/>
  </svg>
);

export const ItalianFlag = () => (
  <svg viewBox="0 0 3 2" width="50" height="38">
    <rect width="1" height="2" y="0" x="0" fill="#008C45"/>
    <rect width="1" height="2" y="0" x="1" fill="#F4F5F0"/>
    <rect width="1" height="2" y="0" x="2" fill="#CD212A"/>
  </svg>
);

export const FrenchFlag = () => (
  <svg viewBox="0 0 3 2" width="50" height="38">
    <rect width="1" height="2" y="0" x="0" fill="#0055A4"/>
    <rect width="1" height="2" y="0" x="1" fill="#FFFFFF"/>
    <rect width="1" height="2" y="0" x="2" fill="#EF4135"/>
  </svg>
);

export const AlbanianFlag = () => (
  <svg viewBox="0 0 140 100" width="50" height="38">
    {/* Red background */}
    <rect width="140" height="100" fill="#CE1126"/>
    {/* Detailed double-headed eagle */}
    <path
      d="M70 50
         m-25 0
         c-5-15-10-20-15-20
         c-5 0-10 5-10 15
         l0 20
         c0 5 5 10 10 10
         l5 0
         c5 0 5-5 10-5
         l5-10
         c5-5 5-10 5-10
         m10 0
         l5 10
         c5 5 5 5 10 5
         l5 0
         c5 0 10-5 10-10
         l0-20
         c0-10-5-15-10-15
         c-5 0-10 5-15 20
         m-25-10
         l5-10
         c0-5-5-10-10-5
         l-5 5
         c-5 5 0 10 5 15
         m35 0
         c5-5 10 0 5 15
         l-5 5
         c-5-5-10 0-10-5
         l5-10
         m-25 35
         l-5 5
         c-5 5-10 0-5-5
         l5-5
         m35 0
         l5 5
         c5 5 0 10-5 5
         l-5-5"
      fill="#000000"
    />
  </svg>
);