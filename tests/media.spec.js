import {test,expect} from '@playwright/test';

for(const mobile of [false,true])test(`chapter media loads uncropped and video loops on ${mobile?'mobile':'desktop'}`,async({page})=>{
  test.setTimeout(60000);
  await page.setViewportSize(mobile?{width:390,height:844}:{width:1440,height:1000});
  await page.goto('/');
  await page.getByRole('button',{name:'Start the first rally'}).click();
  await page.getByRole('button',{name:'Skip animation · reveal chapter'}).click();
  const video=page.locator('.chapter-photo video');
  await expect(video).toBeVisible();
  await expect.poll(()=>video.evaluate(el=>el.readyState>=2&&!el.paused)).toBe(true);
  expect(await video.evaluate(el=>el.muted&&el.loop&&el.autoplay)).toBe(true);
  await video.evaluate(el=>{el.currentTime=el.duration-.15;});
  await expect.poll(()=>video.evaluate(el=>el.currentTime<el.duration-1)).toBe(true);
  await page.screenshot({path:`test-results/media-tennis-${mobile?'mobile':'desktop'}.png`});
  await page.getByRole('button',{name:'Close chapter and keep rally paused'}).click();
  expect(await video.evaluate(el=>el.paused)).toBe(true);
  await page.getByRole('button',{name:'Read this chapter'}).click();
  await expect.poll(()=>video.evaluate(el=>!el.paused)).toBe(true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>video.evaluate(el=>el.paused)).toBe(true);
  for(let index=1;index<8;index++){
    await page.getByRole('button',{name:'Continue the rally',exact:true}).click();
    const img=page.locator('.chapter-photo img');
    await expect(img).toBeVisible();
    await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
    expect(await img.evaluate(el=>getComputedStyle(el).objectFit)).toBe('contain');
    const box=await img.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(mobile?390:1440);
    await expect(img).toBeInViewport();
    if([1,3,5,7].includes(index))await page.screenshot({path:`test-results/media-${index}-${mobile?'mobile':'desktop'}.png`});
  }
});
