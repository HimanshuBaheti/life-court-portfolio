import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Play } from 'lucide-react';
import { tennisScore } from '../utils/tennis';
import { scoringCopy as copy } from '../content/rallyData';
import useMotionPreference from '../hooks/useMotionPreference';

const demo=[0,1,0,1,0,1,0,1,0,0];
export default function ScoreLesson(){
  const [points,setPoints]=useState([0,0]),[step,setStep]=useState(-1);
  const reduced=useMotionPreference();
  const score=tennisScore(points);
  useEffect(()=>{
    if(step<0)return;
    if(step>=demo.length){setStep(-1);return;}
    const timer=setTimeout(()=>{setPoints(previous=>previous.map((value,index)=>value+(index===demo[step]?1:0)));setStep(step+1);},1300);
    return()=>clearTimeout(timer);
  },[step]);
  function award(player){setStep(-1);if(score.winner===null)setPoints(previous=>previous.map((value,index)=>value+(index===player?1:0)));}
  function reset(){setStep(-1);setPoints([0,0]);}
  return <div className="score-lesson"><span className="r-eyebrow">{copy.eyebrow}</span><h2 id="r-detail-title">Every point<br/><em>counts.</em></h2><p>{copy.intro}</p>
    <div className="score-sequence">{copy.sequence.map((label,index)=><span key={label}><small>0{index}</small>{label}</span>)}</div>
    <div className="score-simulator"><div className="sim-label"><span>TRY A STANDARD GAME</span><span>SERVER FIRST</span></div><div className="score-players">{score.values.map((value,index)=><div key={index}><span>PLAYER {index===0?'A':'B'} {index===0?'· SERVING':''}</span><div className="score-digit"><AnimatePresence mode="wait"><motion.strong key={value} initial={reduced?false:{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={reduced?{}:{y:-30,opacity:0}} transition={{duration:.2}}>{value}</motion.strong></AnimatePresence></div><button onClick={()=>award(index)} disabled={score.winner!==null||step>=0}>Point to {index===0?'A':'B'} <span>+</span></button></div>)}</div><p className="score-status" role="status" aria-live="polite">{score.status}</p><div className="score-actions"><button onClick={reset}><RotateCcw size={12}/>Reset game</button><button onClick={()=>{if(step>=0)setStep(-1);else{setPoints([0,0]);setStep(0);}}}><Play size={12}/>{step>=0?'Stop demonstration':'Watch deuce → advantage → game'}</button></div></div>
    <div className="score-theory">{copy.steps.map((item,index)=><section key={item.title}><span>0{index+1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></section>)}</div>
    <div className="score-connection"><h3>{copy.connectionTitle}</h3><p>{copy.connection}</p></div><p className="score-footnote">{copy.note} <a href={copy.sourceUrl} target="_blank" rel="noreferrer">{copy.sourceLabel} ↗</a></p>
  </div>;
}
