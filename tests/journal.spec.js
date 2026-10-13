import { test, expect } from '@playwright/test';

test('chapter browsing preserves score and pauses an active rally', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start the first rally' }).click();
  const chapter = page.getByRole('button', { name: 'Read chapter 8:' });
  await chapter.click();
  await expect(page.getByRole('dialog', { name: /The next chapter/ })).toBeVisible();
  await expect(page.locator('.scoreboard-row strong').first()).toHaveText('LOVE');
  await page.keyboard.press('Escape');
  await expect(chapter).toBeFocused();
  await expect(page.getByRole('button', { name: 'Resume the point' })).toBeVisible();
  await expect(page.locator('.scoreboard-heading')).toContainText('POINT 01');
});

test('Between Points opens complete stories, photographs and coming-soon entry', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?view=blog');
  await expect(page.getByRole('heading', { name: 'Between Points.' })).toBeVisible();
  await expect(page.getByText('Coming soon', { exact: true })).toBeVisible();
  await page.locator('.bp-assemblage').first().click();
  await expect(page).toHaveURL(/story=hostel/);
  await expect(page.getByText('Well, technically, I began it from my bedroom.')).toBeVisible();
  await page.locator('.bp-article-hero').getByRole('button', { name: /Enlarge photograph/ }).click();
  await expect(page.getByRole('dialog', { name: 'Photograph viewer' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.bp-article-hero button')).toBeFocused();
  const video = page.locator('video');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(el => el.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate(el => el.paused)).toBe(false);
  expect(await video.evaluate(el => el.loop && el.muted)).toBe(true);
  await page.goto('/?view=blog&story=family');
  await expect(page.getByRole('heading', { name: /Hum Paanch/ }).first()).toBeVisible();
  for (const img of await page.locator('.bp-photo img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
    await expect(img).toHaveCSS('object-fit', 'contain');
  }
  await expect(page.locator('.bp-prose')).toContainText('And I wouldn’t have it any other way.'.replace('wouldn’t', "wouldn't"));
  expect(errors).toEqual([]);
});

test('collection and long stories fit mobile with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: 'Between Points', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Between Points.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const img of await page.locator('.bp-collection img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/between-points-mobile.png', fullPage: true });
  await page.goto('/?view=blog&story=hostel');
  await page.locator('video').scrollIntoViewIfNeeded();
  expect(await page.locator('video').evaluate(el => el.paused)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/?view=blog&story=family');
  await page.getByRole('navigation', { name: 'Story sections' }).getByRole('link', { name: /Amey/ }).click();
  await expect(page).toHaveURL(/#memory-/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/between-points-family-mobile.png' });
  await page.getByRole('link', { name: 'Life Court', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Begin the story' })).toBeVisible();
});
