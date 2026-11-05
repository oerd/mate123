import { test, expect } from '@playwright/test';

const IPHONE_X = { width: 375, height: 812 };
const IPAD = { width: 768, height: 1024 };

test.describe('Responsive Design', () => {
    test.describe('iPhone X (375×812)', () => {
        test.use({ viewport: IPHONE_X });

        test('homepage fits within viewport without horizontal scroll', async ({ page }) => {
            await page.goto('/');
            await expect(page.locator('h1')).toBeVisible();

            const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
            expect(scrollWidth).toBeLessThanOrEqual(IPHONE_X.width);
        });

        test('all answer buttons are visible without scrolling', async ({ page }) => {
            await page.goto('/');
            await expect(page.locator('h1')).toBeVisible();

            const buttons = page.locator('button[aria-pressed]');
            const count = await buttons.count();
            expect(count).toBeGreaterThan(0);

            for (let i = 0; i < count; i++) {
                await expect(buttons.nth(i)).toBeVisible();
                const box = await buttons.nth(i).boundingBox();
                expect(box).not.toBeNull();
                // Button must be within viewport bounds
                expect(box!.x).toBeGreaterThanOrEqual(0);
                expect(box!.x + box!.width).toBeLessThanOrEqual(IPHONE_X.width);
                expect(box!.y + box!.height).toBeLessThanOrEqual(IPHONE_X.height);
            }
        });

        test('settings page is scrollable and all sections are reachable', async ({ page }) => {
            await page.goto('/settings');
            await expect(page.locator('h1')).toBeVisible();

            // The page should not overflow horizontally
            const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
            expect(scrollWidth).toBeLessThanOrEqual(IPHONE_X.width);

            // Teacher settings section should exist and be reachable by scrolling
            const teacherHeading = page.getByText('Teacher Settings', { exact: false }).or(
                page.getByText('Lehrer', { exact: false })
            ).or(
                page.getByText('Impostazioni', { exact: false })
            ).first();

            await teacherHeading.scrollIntoViewIfNeeded();
            await expect(teacherHeading).toBeVisible();

            // Share button should be reachable
            const shareButton = page.getByText('Share', { exact: false }).or(
                page.getByText('Teilen', { exact: false })
            ).first();
            await shareButton.scrollIntoViewIfNeeded();
            await expect(shareButton).toBeVisible();

            // The close button stays in view while scrolled to the bottom
            const close = page.getByTestId('settings-close').getByRole('link');
            await expect(close).toBeVisible();
            const box = await close.boundingBox();
            expect(box).not.toBeNull();
            expect(box!.y).toBeGreaterThanOrEqual(0);
            expect(box!.y + box!.height).toBeLessThanOrEqual(IPHONE_X.height);
        });
    });

    test.describe('iPad (768×1024)', () => {
        test.use({ viewport: IPAD });

        test('homepage fits within viewport without horizontal scroll', async ({ page }) => {
            await page.goto('/');
            await expect(page.locator('h1')).toBeVisible();

            const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
            expect(scrollWidth).toBeLessThanOrEqual(IPAD.width);
        });

        test('all answer buttons are visible', async ({ page }) => {
            await page.goto('/');
            await expect(page.locator('h1')).toBeVisible();

            const buttons = page.locator('button[aria-pressed]');
            const count = await buttons.count();
            expect(count).toBeGreaterThan(0);

            for (let i = 0; i < count; i++) {
                await expect(buttons.nth(i)).toBeVisible();
                const box = await buttons.nth(i).boundingBox();
                expect(box).not.toBeNull();
                expect(box!.x).toBeGreaterThanOrEqual(0);
                expect(box!.x + box!.width).toBeLessThanOrEqual(IPAD.width);
            }
        });

        test('settings page content fits without horizontal overflow', async ({ page }) => {
            await page.goto('/settings');
            await expect(page.locator('h1')).toBeVisible();

            const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
            expect(scrollWidth).toBeLessThanOrEqual(IPAD.width);
        });
    });

    for (const viewport of [{ width: 320, height: 640 }, IPHONE_X, IPAD, { width: 1440, height: 900 }]) {
        test.describe(`comparison sums at ${viewport.width}px`, () => {
            test.use({ viewport });

            test('keep the equation on one line inside the card', async ({ page }) => {
                await page.goto('/?op=comparison&cm=sums&fm=999&fx=999&sm=999&sx=999');
                const box = page.getByTestId('comparison-box');
                await expect(box).toBeVisible();

                const layout = await page.evaluate(() => {
                    const line = document.querySelector('[data-testid=fit-line]') as HTMLElement;
                    const lineBox = line.parentElement as HTMLElement;
                    const left = line.firstElementChild as HTMLElement;
                    const comparison = document.querySelector('[data-testid=comparison-box]') as HTMLElement;
                    return {
                        lineWidth: line.offsetWidth,
                        boxWidth: lineBox.clientWidth,
                        leftHeight: left.offsetHeight,
                        comparisonHeight: comparison.offsetHeight,
                    };
                });
                expect(layout.lineWidth).toBeLessThanOrEqual(layout.boxWidth);
                expect(layout.leftHeight).toBeLessThanOrEqual(layout.comparisonHeight);
            });
        });
    }
});
