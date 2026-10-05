import { useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { storyPointFrame, footworkPose } from '../utils/tennis';
import { matchStory } from '../content/matchStory';

function useFootwork(offset) {
  const neutral=footworkPose(offset,0);
  const legs=useMotionValue(neutral.legs),shoes=useMotionValue(neutral.shoes);
  const state=useRef({phase:offset,amount:0});
  function update(distance,delta){
    const dt=Math.max(delta/1000,.001);
    const target=Math.min(1,Math.abs(distance)/dt/95);
    state.current.amount+=(target-state.current.amount)*(1-Math.exp(-dt*10));
    state.current.phase+=Math.abs(distance)/20;
    const pose=footworkPose(state.current.phase,state.current.amount);
    legs.set(pose.legs);shoes.set(pose.shoes);
  }
  return {legs,shoes,update};
}

function Player({ near, swing, x, feet }) {
  return <motion.g style={{x,y:near?465:130}}><g transform={`scale(${near?1:-1} 1)`} className="tennis-player" data-player={near?'A':'B'}>
    <ellipse cx="0" cy="3" rx="25" ry="7" fill="#092c35" opacity=".22"/>
    <motion.path d={feet.legs} fill="none" stroke="#e9bc98" strokeWidth="9" strokeLinecap="round"/>
    <motion.path d={feet.shoes} stroke="#fff9e9" strokeWidth="8" strokeLinecap="round"/>
    <path d="M-9 -32 L-10 -19 M8 -32 L10 -19" stroke="#102d39" strokeWidth="13"/>
    <path d="M-8 -51 Q0 -58 10 -49 L13 -29 Q0 -24 -13 -30 Z" fill={near?'#f7a06d':'#c4e785'} stroke={near?'#e88552':'#a5c969'} strokeWidth="1"/>
    <path d="M-10 -48 L-23 -35 L-28 -42" stroke="#e9bc98" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <motion.g style={{rotate:swing,originX:'10px',originY:'-46px'}}>
      <path d="M10 -47 L23 -37 L31 -40" stroke="#e9bc98" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M28 -39 L38 -43" stroke="#edf4df" strokeWidth="4"/>
      <ellipse cx="44" cy="-46" rx="10" ry="13" transform="rotate(30 44 -46)" fill="url(#strings)" stroke="#ecf8e7" strokeWidth="3"/>
    </motion.g>
    <circle cx="0" cy="-64" r="9" fill="#e9bc98"/>
    <path d="M-9 -66 Q-7 -79 6 -73 L10 -67" fill="#173540"/>
    <path d="M-10 -68 L11 -68" stroke={near?'#fff4e5':'#d7f0b0'} strokeWidth="3"/>
    <text x="0" y="24" textAnchor="middle" transform={near?'':'scale(-1 1)'} fill="#eee8ff" fontSize="9" fontFamily="monospace">{matchStory.players[near?0:1].toUpperCase()}</text>
  </g></motion.g>;
}

export default function RallyScene({ chapter=0, winner=0, reduced, active=false, paused=false, onComplete, onPause }) {
  const clock=useRef(0),visible=useRef(true),finished=useRef(false);
  const initial=storyPointFrame(0,winner,chapter);
  const ballX=useMotionValue(initial.x),ballY=useMotionValue(initial.y),shadowY=useMotionValue(initial.groundY),shadowSize=useMotionValue(9);
  const nearX=useMotionValue(initial.nearX),farX=useMotionValue(initial.farX);
  const nearFeet=useFootwork(0),farFeet=useFootwork(Math.PI/2);
  const nearSwing=useMotionValue(0),farSwing=useMotionValue(0),ringOpacity=useMotionValue(0),ringX=useMotionValue(0),ringY=useMotionValue(0);
  const trail=useMotionValue('');
  const history=useRef([]);
  useEffect(()=>{const update=()=>{visible.current=!document.hidden;};document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
  useEffect(()=>{if(active&&reduced&&!paused&&!finished.current){finished.current=true;onComplete();}},[active,reduced,paused,onComplete]);
  useAnimationFrame((_,delta)=>{
    if(reduced||paused||!active||!visible.current||finished.current)return;
    clock.current+=Math.min(delta,40)/1000;
    const frame=storyPointFrame(clock.current,winner,chapter);
    ballX.set(frame.x);ballY.set(frame.y);shadowY.set(frame.groundY);shadowSize.set(5+7*(1-Math.min(frame.height/110,1)));
    nearFeet.update(frame.nearX-nearX.get(),Math.min(delta,40));
    farFeet.update(frame.farX-farX.get(),Math.min(delta,40));
    nearX.set(frame.nearX);farX.set(frame.farX);
    const stroke=frame.t<.2?Math.sin(frame.t/.2*Math.PI)*-36:0;
    nearSwing.set(frame.nearHit?stroke:0);farSwing.set(!frame.nearHit?stroke:0);
    const bounce=Math.abs(frame.t-.7)<.06;
    ringX.set(frame.x);ringY.set(bounce?frame.groundY:frame.y);
    ringOpacity.set(bounce?.75:frame.t<.1?.7*(1-frame.t/.1):0);
    history.current.push([frame.x,frame.y]);if(history.current.length>10)history.current.shift();trail.set(history.current.map((point,index)=>`${index?'L':'M'}${point[0]} ${point[1]}`).join(' '));
    if(frame.done){finished.current=true;nearSwing.set(0);farSwing.set(0);onComplete();}
  });
  return <div className={`rally-scene scene-${chapter}`}>
    <div className="court-board"><div><span className="court-live-dot"/>{reduced?'STORY VIEW':active?(paused?'RALLY PAUSED':'POINT IN PLAY'):'LIFE COURT'}</div><span>LIFE COURT / 01</span></div>
    <svg className="court-lines" viewBox="0 0 1000 560" role="img" aria-label="Two players exchange groundstrokes across a clearly marked tennis court. Players move across their baselines, return the ball, and chase a final winning shot.">
      <defs>
        <linearGradient id="courtSurface" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#897ec1"/><stop offset="1" stopColor="#60558f"/></linearGradient>
        <radialGradient id="tennisBall" cx="30%" cy="25%"><stop stopColor="#f5ffb7"/><stop offset=".55" stopColor="#dbf46f"/><stop offset="1" stopColor="#9cb738"/></radialGradient>
        <pattern id="strings" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0H4V4" stroke="#f5fff1" strokeWidth=".5" fill="#ffffff10"/></pattern>
        <pattern id="netMesh" width="9" height="7" patternUnits="userSpaceOnUse"><path d="M0 0H9V7" fill="none" stroke="#e8e8d6" strokeWidth=".6" opacity=".6"/></pattern>
      </defs>
      <path d="M228 94 L802 94 L962 490 L59 490 Z" fill="#122f38" opacity=".17" transform="translate(0 13)"/>
      <path d="M215 70 L795 70 L980 500 L35 500 Z" fill="#3e3558"/>
      <path d="M265 115 L750 115 L900 440 L125 440 Z" fill="url(#courtSurface)" stroke="#eee8ff" strokeWidth="2.5"/>
      <path d="M317 115 L698 115 L818 440 L207 440 Z M281 198 L731 198 M238 350 L784 350 M507 198 L510 350" fill="none" stroke="#eee8ff" strokeWidth="2"/>
      <path d="M501 115V122 M510 433V440" stroke="#eee8ff" strokeWidth="2"/>
      <path d="M200 282 L839 282" stroke="#071d25" strokeWidth="8" opacity=".2"/>
      <g className="court-far-player"><Player near={false} swing={farSwing} x={farX} feet={farFeet}/></g>
      <path d="M206 254 Q515 271 834 254 L834 286 Q515 300 206 286 Z" fill="#0a273899"/>
      <path d="M206 254 Q515 271 834 254 L834 286 Q515 300 206 286 Z" fill="url(#netMesh)"/>
      <path d="M204 254 Q515 269 836 254" stroke="#fffbea" strokeWidth="4" fill="none"/>
      <path d="M204 243V301 M836 243V301" stroke="#103340" strokeWidth="6"/>
      <text x="80" y="523" fill="#ada2c7" fontSize="8" letterSpacing="3" fontFamily="monospace">A RALLY IS AN EXCHANGE. A POINT IS THE RESULT.</text>
      <Player near swing={nearSwing} x={nearX} feet={nearFeet}/>
      <motion.ellipse cx={ballX} cy={shadowY} rx={shadowSize} ry="3.5" fill="#061e2d" opacity=".3"/>
      <motion.path d={trail} stroke="#e8fa99" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".3"/>
      <motion.circle cx={ringX} cy={ringY} r="14" fill="none" stroke="#f2ffa5" strokeWidth="1.5" style={{opacity:ringOpacity}}/>
      <motion.g style={{x:ballX,y:ballY}} data-testid="rally-ball"><circle r="7" fill="url(#tennisBall)" stroke="#d9ee73" strokeWidth=".5"/><path d="M-5 -5 Q3 0 -5 5 M5 -5 Q-3 0 5 5" stroke="#ffffdd" fill="none" strokeWidth="1"/></motion.g>
      {reduced&&<path d="M392 421 Q530 210 596 210 L660 86" stroke="#e1f791" strokeDasharray="5 8" strokeWidth="2" fill="none"/>}
    </svg>
    <div className="court-legend"><span><i/>{active?'MOVE. READ. RETURN.':'A POINT REVEALS A CHAPTER.'}</span><button onClick={onPause} disabled={!active||reduced} aria-label={paused?'Play rally':'Pause rally'}>{active&&!paused&&!reduced?<Pause size={12}/>:<Play size={12}/>} {reduced?'STILL VIEW':active?(paused?'RESUME':'PAUSE'):'READY'}</button></div>
  </div>;
}
