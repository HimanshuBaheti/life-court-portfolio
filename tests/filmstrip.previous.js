import { test, expect } from '@playwright/test';

test('desktop navigation visits all five chapters and contact dialog closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveCount(0);
  const ids = ['origins', 'academy', 'professional', 'lens', 'dublin'];
  const nav = page.getByRole('navigation').getByRole('button');
  for (let index = 0; index < ids.length; index++) {
    await nav.nth(index).click();
    await expect(nav.nth(index)).toHaveAttribute('aria-current', 'step');
    await expect.poll(async () => Math.abs((await page.locator(`#${ids[index]}`).boundingBox()).x)).toBeLessThan(3);
  }
  await page.getByRole('button', { name: 'Let’s connect' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Let’s connect' })).toBeFocused();
});

test('mobile and reduced motion use a vertical story without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.vertical-story')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const first = await page.locator('#origins').boundingBox();
  const second = await page.locator('#academy').boundingBox();
  expect(second.y).toBeGreaterThan(first.y + first.height - 2);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.vertical-story')).toBeVisible();
  await page.getByRole('navigation').getByRole('button', { name: 'Dublin & Beyond' }).click();
  await expect(page.locator('#dublin')).toBeInViewport();
});

test('cursor, 3D tilt, kinetic reveal, and parallax respond to interaction', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveCount(0);
  const heading = page.locator('#origins .reveal-line').first();
  await expect.poll(() => heading.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42))).toBeLessThan(1);
  const connect = page.getByRole('button', { name: 'Let’s connect' });
  await connect.hover();
  await expect(page.locator('.custom-cursor')).toHaveAttribute('data-expanded', 'true');
  await expect(page.locator('html')).toHaveClass('custom-cursor-active');
  const card = page.locator('#origins .memory-card');
  const rect = await card.boundingBox();
  await page.mouse.move(rect.x + rect.width * 0.7, rect.y + rect.height * 0.3);
  await expect.poll(() => card.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m13))).toBeGreaterThan(0.01);
  await page.mouse.move(20, 400);
  await expect.poll(() => card.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m13))).toBeLessThan(0.001);
  await page.screenshot({ path: 'test-results/origins-desktop.png' });
  await page.evaluate(() => window.scrollTo(0, 450));
  await expect.poll(() => page.locator('#origins .art-layer').evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41))).toBeGreaterThan(100);
  const shifts = await page.locator('#origins').evaluate(el => ['.chapter-copy', '.art-layer', '.chapter-atmosphere'].map(selector => Math.abs(new DOMMatrix(getComputedStyle(el.querySelector(selector)).transform).m41)));
  expect(shifts[2]).toBeGreaterThan(shifts[1]);
  expect(shifts[1]).toBeGreaterThan(shifts[0]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass('custom-cursor-active');
  await expect(page.locator('.custom-cursor')).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/origins-mobile.png', fullPage: true });
});
