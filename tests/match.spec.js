import {test,expect} from '@playwright/test';

async function reveal(page){await page.getByRole('button',{name:'Skip animation · reveal chapter'}).click();await expect(page.getByRole('dialog',{name:/./}).first()).toBeVisible();}

test('a real point moves both players, ends automatically, and waits at its story card',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  await page.screenshot({path:'test-results/match-ready.png'});
  await page.getByRole('button',{name:'Start the first rally'}).click();
  const players=page.locator('.tennis-player').locator('..');
  const initial=await players.first().getAttribute('style');
  await expect.poll(()=>players.first().getAttribute('style')).not.toBe(initial);
  const near=await players.last().getAttribute('style');
  await expect.poll(()=>players.last().getAttribute('style')).not.toBe(near);
  await expect(page.getByRole('heading',{name:'Before the code, there was the court.'})).toBeVisible({timeout:12000});
  await expect(page.locator('.point-score-strip')).toContainText('15');
  const frozen=await page.getByTestId('rally-ball').getAttribute('style');
  await page.waitForTimeout(300);
  expect(await page.getByTestId('rally-ball').getAttribute('style')).toBe(frozen);
  await expect(page.getByRole('heading',{name:'Before the code, there was the court.'})).toBeFocused();
  await page.screenshot({path:'test-results/match-first-chapter.png'});
  await page.getByRole('button',{name:'Continue the rally',exact:true}).click();
  await expect(page.locator('.point-dialog:not(.next-dialog)')).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Pause the point'})).toBeVisible();
  await expect(page.locator('.scoreboard-heading')).toContainText('POINT 02');
  expect(errors).toEqual([]);
});

test('all eight chapters award exactly one point and finish the game; dismissal never resumes play',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Start the first rally'}).click();
  const expected=['15','15','30','30','40','40','AD','GAME'];
  for(let index=0;index<8;index++){
    await reveal(page);
    await expect(page.locator('.point-score-strip strong')).toContainText(expected[index]);
    await expect(page.locator('.point-art>span')).toHaveText(String(index+1).padStart(2,'0'));
    if(index===0){
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button',{name:'Read this chapter'})).toBeVisible();
      await expect(page.getByRole('button',{name:'Pause the point'})).toHaveCount(0);
      await page.getByRole('button',{name:'Read this chapter'}).click();
      await expect(page.locator('.point-score-strip strong')).toContainText('15');
    }
    await page.getByRole('button',{name:index===7?'What’s Next':'Continue the rally',exact:true}).click();
  }
  await expect(page.getByRole('heading',{name:'What’s Next',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Close What’s Next'}).click();
  await expect(page.getByRole('button',{name:'Replay the story'})).toBeVisible();
  await expect(page.locator('.scoreboard-heading')).toContainText('GAME COMPLETE');
  await expect(page.locator('.match-timeline .is-read')).toHaveCount(8);
  await page.getByRole('button',{name:'Replay the story'}).click();
  await expect(page.getByRole('button',{name:'Start the first rally'})).toBeVisible();
  await expect(page.locator('.scoreboard-row strong').first()).toHaveText('LOVE');
});

test('pause, scoring guide, mobile and reduced motion preserve explicit continuation',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/match-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Start the first rally'}).click();
  await page.getByRole('button',{name:'Pause the point'}).click();
  const frozen=await page.getByTestId('rally-ball').getAttribute('style');
  await page.waitForTimeout(200);expect(await page.getByTestId('rally-ball').getAttribute('style')).toBe(frozen);
  await page.getByRole('button',{name:/Love, deuce, advantage/}).click();
  await expect(page.getByRole('heading',{name:'Every point counts.'})).toBeVisible();
  await page.getByRole('button',{name:'Close scoring guide'}).click();
  await expect(page.getByRole('button',{name:'Resume the point'})).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.point-dialog:not(.next-dialog)')).not.toBeVisible();
  await page.getByRole('button',{name:'Resume the point'}).click();
  await expect(page.locator('.point-dialog:not(.next-dialog)')).toBeVisible();
  await page.screenshot({path:'test-results/match-card-mobile.png'});
  await page.getByRole('button',{name:'Continue the rally',exact:true}).click();
  await expect(page.locator('.point-art>span')).toHaveText('02');
  await expect(page.locator('.point-dialog:not(.next-dialog)')).toBeVisible();
});

test('recruiter shortcuts, chapter photo frames and final Dublin invitation work',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.court-board')).toContainText('LIFE COURT');
  await expect(page.locator('.scoreboard-row').first()).toContainText('Curiosity');
  await expect(page.locator('.scoreboard-row').last()).toContainText('Experience');
  await page.getByRole('button',{name:'Connect with me',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Let’s build the next chapter.'})).toBeVisible();
  await expect(page.locator('.contact-unconfigured')).toHaveCount(0);
  await expect(page.locator('.public-contacts a')).toHaveCount(8);
  await expect(page.getByRole('link',{name:/Email himanshupbaheti/})).toHaveAttribute('href','mailto:himanshupbaheti@gmail.com');
  await expect(page.getByRole('link',{name:/LinkedIn Himanshu/})).toHaveAttribute('href','https://linkedin.com/in/himanshu-baheti-5344a4212');
  await expect(page.getByRole('link',{name:/GitHub HimanshuBaheti/})).toHaveAttribute('href','https://github.com/HimanshuBaheti');
  await expect(page.getByRole('link',{name:/Instagram · Personal/})).toHaveAttribute('href','https://www.instagram.com/bahetihimanshu/');
  await expect(page.getByRole('link',{name:/Instagram · Abroad diaries/})).toHaveAttribute('href','https://www.instagram.com/abroad__diaries/');
  await expect(page.getByRole('link',{name:/Phone · Ireland/})).toHaveAttribute('href','tel:+353892513513');
  await expect(page.getByRole('link',{name:/Phone · India/})).toHaveAttribute('href','tel:+917410730619');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Connect with me',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Selected work',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Movie recommendation system'})).toBeVisible();
  await page.getByRole('button',{name:'Close connections'}).click();
  await page.getByRole('button',{name:'Begin the story'}).click();
  await expect(page.locator('.chapter-photo-frame')).toBeVisible();
  await expect(page.locator('.chapter-photo video')).toBeVisible();
  await page.screenshot({path:'test-results/chapter-photo-frame.png'});
  for(let index=0;index<7;index++)await page.getByRole('button',{name:'Continue the rally',exact:true}).click();
  await expect(page.getByRole('heading',{name:'The next chapter: building in Dublin.'})).toBeVisible();
  await page.locator('.final-chapter-links').getByRole('button',{name:'Connect with me'}).click();
  await expect(page.locator('.connections-dialog')).toBeVisible();
  await page.getByRole('button',{name:'Close connections'}).click();
  await expect(page.locator('.point-dialog:not(.next-dialog)')).toBeVisible();
  await page.getByRole('button',{name:'What’s Next'}).click();
  await expect(page.getByRole('heading',{name:'What’s Next',exact:true})).toBeVisible();
  await expect(page.locator('.next-copy')).toContainText('Dublin');
  await page.locator('.next-actions').getByRole('button',{name:'Connect with me'}).click();
  await expect(page.locator('.connections-dialog')).toBeVisible();
  await page.getByRole('button',{name:'Close connections'}).click();
  await expect(page.locator('.next-dialog')).toBeVisible();
  await page.screenshot({path:'test-results/whats-next.png'});
  await page.getByRole('button',{name:'Close What’s Next'}).click();
  await expect(page.getByRole('button',{name:'Let’s build the next chapter'})).toBeVisible();
});
