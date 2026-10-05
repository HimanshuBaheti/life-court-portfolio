import { test, expect } from '@playwright/test';

test('sculpture renders, all four viewpoints navigate, and projects open with keyboard support', async ({ page }) => {
  test.setTimeout(60000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/?concept=sculpture');
  await expect(page.locator('.sculpture-canvas canvas')).toBeVisible();
  await expect(page.locator('.scene-loading')).toHaveCount(0);
  await page.screenshot({path:'test-results/sculpture-front.png'});
  const views=page.getByRole('navigation',{name:'Sculpture viewpoints'}).getByRole('button');
  for(let index=1;index<4;index++){
    await views.nth(index).click();
    await expect(views.nth(index)).toHaveAttribute('aria-pressed','true');
    await page.waitForTimeout(850);
    await page.screenshot({path:`test-results/sculpture-view-${index}.png`});
  }
  await page.getByRole('button',{name:'Meet the person'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading',{name:'Himanshu Parag Baheti.'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Meet the person'})).toBeFocused();
  await views.nth(2).click();
  await expect(views.nth(2)).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'02 Salesforce Data Cloud'}).click();
  await page.getByRole('button',{name:'Look inside the work'}).click();
  await expect(page.getByRole('heading',{name:'Salesforce Data Cloud.'})).toBeVisible();
  await page.screenshot({path:'test-results/sculpture-detail.png'});
  await page.getByRole('button',{name:'Close details'}).click();
  expect(errors).toEqual([]);
});

test('mobile has no horizontal overflow and reduced-motion navigation remains usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/?concept=sculpture');
  await expect(page.locator('.sculpture-canvas canvas')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('.scene-loading')).toHaveCount(0);
  await page.screenshot({path:'test-results/sculpture-mobile.png'});
  await page.getByRole('button',{name:'03 Inside'}).click();
  await expect(page.getByRole('button',{name:'03 Inside'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Look inside the work'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button',{name:'Close details'}).click();
});
