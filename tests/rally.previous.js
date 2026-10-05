import { test, expect } from '@playwright/test';

test('rally transforms across four chapters and opens relevant content',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'A different court. The same drive.'})).toBeVisible();
  await page.screenshot({path:'test-results/rally-front.png'});
  const nav=page.getByRole('navigation',{name:'Rally chapters'}).getByRole('button');
  for(let index=1;index<4;index++){
    await nav.nth(index).click();
    await expect(nav.nth(index)).toHaveAttribute('aria-pressed','true');
    await expect(page.locator(`.scene-${index}`)).toBeVisible();
    await page.waitForTimeout(1200);
    await page.screenshot({path:`test-results/rally-chapter-${index}.png`});
  }
  await page.getByRole('button',{name:'Meet Himanshu'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Meet Himanshu'})).toBeFocused();
  await nav.nth(1).click();
  await page.getByRole('button',{name:'Explore the engineering'}).click();
  await expect(page.getByRole('heading',{name:'Communication Governance'})).toBeVisible();
  await page.getByRole('button',{name:'Close details'}).click();
  await page.getByRole('link',{name:'View sculpture study'}).click();
  await expect(page.locator('.sculpture-canvas canvas')).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile reduced-motion rally retains navigation without horizontal overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const scoreLink=await page.getByRole('button',{name:/How does the scoring work/}).boundingBox();
  const caption=await page.locator('.r-caption').boundingBox();
  expect(scoreLink.y+scoreLink.height).toBeLessThan(caption.y);
  await page.screenshot({path:'test-results/rally-mobile.png'});
  await page.getByRole('button',{name:'04 The next move'}).click();
  await expect(page.getByRole('button',{name:'04 The next move'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Meet Himanshu'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button',{name:'Close details'}).click();
});

test('rally players, pause control, and scoring lesson behave correctly',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  await expect(page.locator('.tennis-player')).toHaveCount(2);
  const ball=page.getByTestId('rally-ball');
  const start=await ball.getAttribute('style');
  await expect.poll(()=>ball.getAttribute('style')).not.toBe(start);
  await page.getByRole('button',{name:'Pause rally'}).click();
  const stopped=await ball.getAttribute('style');
  await page.waitForTimeout(250);
  expect(await ball.getAttribute('style')).toBe(stopped);
  await page.getByRole('button',{name:'Play rally'}).click();
  await expect.poll(()=>ball.getAttribute('style')).not.toBe(stopped);
  await page.getByRole('button',{name:/How does the scoring work/}).click();
  const status=page.getByRole('status');
  for(let i=0;i<3;i++)await page.getByRole('button',{name:'Point to A'}).click();
  for(let i=0;i<3;i++)await page.getByRole('button',{name:'Point to B'}).click();
  await expect(status).toContainText('Deuce');
  await page.getByRole('button',{name:'Point to A'}).click();
  await expect(status).toContainText('Advantage A');
  await page.getByRole('button',{name:'Point to B'}).click();
  await expect(status).toContainText('Deuce');
  await page.getByRole('button',{name:'Point to A'}).click();
  await page.getByRole('button',{name:'Point to A'}).click();
  await expect(status).toContainText('Player A wins the game');
  await expect(page.getByRole('button',{name:'Point to B'})).toBeDisabled();
  await page.getByRole('button',{name:'Reset game'}).click();
  await expect(status).toContainText('Love-all');
  await page.screenshot({path:'test-results/scoring-lesson.png'});
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:/How does the scoring work/})).toBeFocused();
});
