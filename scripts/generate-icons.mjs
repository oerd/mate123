import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const GROUND = '#FFDE00';
const INK = '#000000';

const mascot = `
  <path d="M50 80 C30 60, 30 30, 40 20 C45 30, 60 50, 70 60 Z" fill="#FB923C" stroke="${INK}" stroke-width="8" stroke-linejoin="round" />
  <path d="M150 80 C170 60, 170 30, 160 20 C155 30, 140 50, 130 60 Z" fill="#FB923C" stroke="${INK}" stroke-width="8" stroke-linejoin="round" />
  <path d="M40 180 C40 80, 160 80, 160 180 Z" fill="#A855F7" stroke="${INK}" stroke-width="8" stroke-linejoin="round" />
  <path d="M60 180 C60 120, 140 120, 140 180 Z" fill="#FB923C" stroke="${INK}" stroke-width="8" stroke-linejoin="round" />
  <circle cx="80" cy="100" r="18" fill="white" stroke="${INK}" stroke-width="6" />
  <circle cx="80" cy="100" r="6" fill="black" />
  <circle cx="84" cy="96" r="3" fill="white" />
  <circle cx="120" cy="100" r="18" fill="white" stroke="${INK}" stroke-width="6" />
  <circle cx="120" cy="100" r="6" fill="black" />
  <circle cx="124" cy="96" r="3" fill="white" />
  <path d="M75 130 Q100 160 125 130" fill="white" stroke="${INK}" stroke-width="6" stroke-linecap="round" />
  <path d="M85 136 Q100 150 115 136" fill="#EF4444" />
  <path d="M42 130 Q10 140 20 160" fill="#A855F7" stroke="${INK}" stroke-width="8" stroke-linecap="round" />
  <circle cx="15" cy="155" r="12" fill="#4ADE80" stroke="${INK}" stroke-width="6" />
  <path d="M5 155 L10 145" stroke="${INK}" stroke-width="6" stroke-linecap="round" />
  <path d="M158 130 Q190 140 180 160" fill="#A855F7" stroke="${INK}" stroke-width="8" stroke-linecap="round" />
  <circle cx="185" cy="155" r="12" fill="#4ADE80" stroke="${INK}" stroke-width="6" />
  <path d="M195 155 L190 145" stroke="${INK}" stroke-width="6" stroke-linecap="round" />
`;

const placeMascot = (scale) => {
  const size = 200 * scale;
  const offset = (512 - size) / 2;
  return `
    <g transform="translate(${offset + 10} ${offset + 10}) scale(${scale})" opacity="1">
      <g transform="translate(0 0)">${mascot.replace(/fill="[^"]*"/g, `fill="${INK}"`)}</g>
    </g>
    <g transform="translate(${offset} ${offset}) scale(${scale})">${mascot}</g>`;
};

const roundedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect x="24" y="24" width="452" height="452" rx="96" fill="${INK}" transform="translate(12 12)" />
  <rect x="24" y="24" width="452" height="452" rx="96" fill="${GROUND}" stroke="${INK}" stroke-width="16" />
  ${placeMascot(1.85)}
</svg>`;

const fullBleedIcon = (scale) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${GROUND}" />
  ${placeMascot(scale)}
</svg>`;

const targets = [
  { file: 'public/icons/icon-192.png', size: 192, svg: roundedIcon },
  { file: 'public/icons/icon-512.png', size: 512, svg: roundedIcon },
  { file: 'public/icons/icon-maskable-512.png', size: 512, svg: fullBleedIcon(1.6) },
  { file: 'app/apple-icon.png', size: 180, svg: fullBleedIcon(1.9) },
];

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
for (const { file, size, svg } of targets) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  );
  await writeFile(file, await page.screenshot({ omitBackground: true }));
}
await writeFile('public/icons/icon.svg', `${roundedIcon}\n`);
await browser.close();
