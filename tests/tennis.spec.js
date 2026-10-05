import { test,expect } from '@playwright/test';
import { rallyFrame,tennisScore } from '../src/utils/tennis';

test('standard scoring handles both winners, prolonged deuce, and advantage loss',()=>{
  expect(tennisScore([0,0]).values).toEqual(['LOVE','LOVE']);
  expect(tennisScore([3,2]).values).toEqual(['40','30']);
  expect(tennisScore([4,2]).winner).toBe(0);
  expect(tennisScore([2,4]).winner).toBe(1);
  expect(tennisScore([8,8]).values).toEqual(['40','40']);
  expect(tennisScore([8,9]).values).toEqual(['40','AD']);
  expect(tennisScore([9,9]).winner).toBeNull();
  expect(tennisScore([9,11]).winner).toBe(1);
});

test('equal-duration shots have uniform horizontal travel, one bounce, and continuous contacts',()=>{
  const samples=[0,.25,.5,.75].map(t=>rallyFrame(t*2.4));
  expect(samples[1].x-samples[0].x).toBeCloseTo(samples[2].x-samples[1].x,8);
  expect(samples[2].x-samples[1].x).toBeCloseTo(samples[3].x-samples[2].x,8);
  expect(rallyFrame(2.4*.76).height).toBeCloseTo(0,8);
  expect(rallyFrame(2.4*.5).height).toBeGreaterThan(30);
  const before=rallyFrame(2.4-.00001),contact=rallyFrame(2.4);
  expect(before.x).toBeCloseTo(contact.x,2);
  expect(before.y).toBeCloseTo(contact.y,2);
  expect(rallyFrame(4.8).x).toBe(rallyFrame(0).x);
  expect(rallyFrame(4.8).y).toBe(rallyFrame(0).y);
});

import {storyPointFrame,pointDuration,SHOT_SECONDS} from '../src/utils/tennis';
test('story rally contacts stay continuous, players travel and the winner is explicit',()=>{
  for(const winner of [0,1]){
    for(let shot=1;shot<(winner===0?3:4);shot++){
      const previous=storyPointFrame(shot*SHOT_SECONDS-.00001,winner);
      const next=storyPointFrame(shot*SHOT_SECONDS,winner);
      expect(previous.x).toBeCloseTo(next.x,2);expect(previous.y).toBeCloseTo(next.y,2);
      const racketX=next.nearHit?next.nearX+44:next.farX-44;
      expect(racketX).toBeCloseTo(next.x,4);
    }
    expect(storyPointFrame(pointDuration(winner),winner).done).toBe(true);
    expect(storyPointFrame(pointDuration(winner)-.01,winner).done).toBe(false);
  }
  expect(storyPointFrame(1,0).nearX).not.toBe(storyPointFrame(0,0).nearX);
});

import {footworkPose} from '../src/utils/tennis';
test('footwork keeps shoes attached, alternates foot lift and settles when stationary',()=>{
  for(const phase of [0,.5,1,2,3,4,5,6]){
    const pose=footworkPose(phase,1);
    expect(pose.left.x).toBeLessThan(-10);
    expect(pose.right.x).toBeGreaterThan(10);
    expect(pose.left.y*pose.right.y).toBe(0);
    expect(pose.shoes).toContain(`M${pose.left.x-4} ${pose.left.y}`);
    expect(pose.shoes).toContain(`M${pose.right.x-4} ${pose.right.y}`);
  }
  expect(footworkPose(0,0)).toEqual(footworkPose(3,0));
  expect(Math.abs(footworkPose(1.001,1).left.x-footworkPose(1,1).left.x)).toBeLessThan(.01);
});
