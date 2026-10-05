// Standard advantage-game scoring; raw points avoid special-case display state.
export function tennisScore(points) {
  const [a,b]=points;
  if(Math.max(a,b)>=4&&Math.abs(a-b)>=2)return {values:a>b?['GAME','—']:['—','GAME'],status:`Player ${a>b?'A':'B'} wins the game`,winner:a>b?0:1};
  if(a>=3&&b>=3){
    if(a===b)return {values:['40','40'],status:'Deuce · two consecutive points needed',winner:null};
    return {values:a>b?['AD','40']:['40','AD'],status:`Advantage ${a>b?'A':'B'} · one more point to win`,winner:null};
  }
  const labels=['LOVE','15','30','40'];
  return {values:[labels[a],labels[b]],status:a+b===0?'Love-all · a new game':'The point is over. The game continues.',winner:null};
}

// One clock drives both racquets and the ball. Constant ground-plane velocity,
// one court bounce per flight, and identical contact coordinates on every return.
export function rallyFrame(seconds) {
  const shot=seconds/2.4,index=Math.floor(shot),t=shot-index;
  const from=index%2===0?{x:392,y:465}:{x:660,y:130};
  const to=index%2===0?{x:660,y:130}:{x:392,y:465};
  const bounce=.76;
  const u=t/bounce,v=(t-bounce)/(1-bounce);
  const height=t<=bounce?44*(1-u)+72*4*u*(1-u):44*Math.sin(v*Math.PI/2);
  const x=from.x+(to.x-from.x)*t,groundY=from.y+(to.y-from.y)*t;
  return {x,y:groundY-height,groundY,height,t,index,bounce,nearHit:index%2===0,impact:t<.12,bouncing:Math.abs(t-bounce)<.055};
}

// Exhibition choreography is deterministic: no timer races, randomness, or user skill.
// Racquet contact positions drive both player movement and every ball trajectory.
export const SHOT_SECONDS = 1.5;
export function pointDuration(winner) { return (winner===0?3:4)*SHOT_SECONDS+.48; }
export function storyPointFrame(seconds,winner,seed=0){
  const shots=winner===0?3:4,final=shots-1;
  const shot=Math.min(final,Math.floor(seconds/SHOT_SECONDS));
  const t=(seconds-shot*SHOT_SECONDS)/SHOT_SECONDS;
  const xs=seed%2===0?[365,610,610,380,430]:[595,390,390,650,630];
  const contact=n=>({x:xs[n%xs.length],y:n%2===0?465:130});
  const from=contact(shot),to=contact(shot+1);
  const winning=shot===final,bounce=.7;
  const u=Math.min(t/bounce,1),v=(t-bounce)/.5;
  const height=t<=bounce?44*(1-u)+62*4*u*(1-u):winning?Math.max(0,64*4*v*(1-v)):44*Math.sin(Math.min(1,(t-bounce)/(1-bounce))*Math.PI/2);
  const groundY=from.y+(to.y-from.y)*t;
  const playerX=near=>{
    const parity=near?0:1;
    const previous=shot%2===parity?shot:shot-1;
    const next=previous+2;
    const start=contact(Math.max(0,previous)),end=contact(next);
    let fraction=previous<0?Math.min(1,seconds/SHOT_SECONDS):Math.min(1,(seconds-previous*SHOT_SECONDS)/(2*SHOT_SECONDS));
    fraction=fraction*fraction*(3-2*fraction);
    let x=start.x+(end.x-start.x)*fraction;
    if(previous<0)x=contact(1).x;
    if(winning&&near!==(final%2===0)){const chase=Math.min(t,1);x+=(near?-1:1)*110*chase*chase*(3-2*chase);}
    return x+(near?-44:44);
  };
  return {x:from.x+(to.x-from.x)*t,y:groundY-height,groundY,height,t,shot,winning,nearHit:shot%2===0,nearX:playerX(true),farX:playerX(false),stride:Math.sin(seconds*15)*7,done:seconds>=pointDuration(winner)};
}

// Feet and shoes share the same ankle coordinates. Small alternating lifts give
// a lateral recovery shuffle; amplitude is driven by each player's actual speed.
export function footworkPose(phase, amount) {
  const blend=Math.max(0,Math.min(1,amount));
  const foot=(side,offset)=>{
    const cycle=phase+offset;
    const x=side*18+Math.cos(cycle)*4*blend;
    const y=-Math.max(0,Math.sin(cycle))*4*blend;
    const kneeX=side*11+(x-side*18)*.35;
    return {x,y,path:`M${side*8} -21 Q${kneeX} -10 ${x} ${y}`};
  };
  const left=foot(-1,0),right=foot(1,Math.PI);
  return {legs:`${left.path} ${right.path}`,shoes:`M${left.x-4} ${left.y} L${left.x+4} ${left.y} M${right.x-4} ${right.y} L${right.x+4} ${right.y}`,left,right};
}
