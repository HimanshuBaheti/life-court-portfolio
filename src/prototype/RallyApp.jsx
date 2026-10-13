import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, RotateCcw, Play, X } from 'lucide-react';
import useMotionPreference from '../hooks/useMotionPreference';
import { matchStory as story } from '../content/matchStory';
import { tennisScore } from '../utils/tennis';
import RallyScene from './RallyScene';
import ScoreLesson from './ScoreLesson';
import './match.css';
import ChapterFrame from './ChapterFrame';
import ConnectionsPanel from './ConnectionsPanel';
import { connections } from '../content/connections';

export default function RallyApp(){
  const [browseIndex,setBrowseIndex]=useState(null);
  const browseDialog=useRef(null),browseOpener=useRef(null);
  const browsed=browseIndex===null?null:story.stages[browseIndex];
  useEffect(()=>{if(browsed){browseDialog.current.showModal();browseDialog.current.querySelector('h2')?.focus();browseDialog.current.scrollTop=0;}else browseDialog.current.close();},[browsed]);
  function closeBrowse(){setBrowseIndex(null);requestAnimationFrame(()=>browseOpener.current?.focus());}
  function browse(index,event){browseOpener.current=event.currentTarget;setPaused(true);setBrowseIndex(index);}
  const reduced=useMotionPreference();
  const [phase,setPhase]=useState('ready'),[point,setPoint]=useState(0),[paused,setPaused]=useState(false),[showRules,setShowRules]=useState(false),[run,setRun]=useState(0),[connectionTab,setConnectionTab]=useState(null),[showNext,setShowNext]=useState(false);
  const storyDialog=useRef(null),rulesDialog=useRef(null),continueButton=useRef(null),startButton=useRef(null),rulesButton=useRef(null),connectionsDialog=useRef(null),connectionsOpener=useRef(null),nextDialog=useRef(null),nextHeading=useRef(null),nextTrigger=useRef(null);
  const current=story.stages[point];
  const completed=['story','intermission','complete'].includes(phase)?point+1:point;
  const points=story.stages.slice(0,completed).reduce((result,item)=>{result[item.winner]++;return result;},[0,0]);
  const score=tennisScore(points);
  // The only transition that awards a point. Repeated callbacks cannot award twice.
  const finish=useCallback(()=>setPhase(previous=>previous==='playing'?'story':previous),[]);
  useEffect(()=>{
    if(phase==='story'){storyDialog.current.showModal();storyDialog.current.querySelector('#point-title')?.focus({preventScroll:true});storyDialog.current.scrollTop=0;}
    else storyDialog.current.close();
  },[phase]);
  useEffect(()=>{if(showRules)rulesDialog.current.showModal();else rulesDialog.current.close();},[showRules]);
  useEffect(()=>{if(showNext){nextDialog.current.showModal();nextHeading.current?.focus({preventScroll:true});}else nextDialog.current.close();},[showNext]);
  function closeNext(){setShowNext(false);requestAnimationFrame(()=>nextTrigger.current?.focus({preventScroll:true}));}
  useEffect(()=>{if(connectionTab)connectionsDialog.current.showModal();else connectionsDialog.current.close();},[connectionTab]);
  function openConnections(tab,event){connectionsOpener.current=event.currentTarget;setConnectionTab(tab);}
  function closeConnections(){setConnectionTab(null);connectionsOpener.current?.focus({preventScroll:true});}
  useEffect(()=>{const before=document.body.style.overflow;if(phase==='story'||showRules||connectionTab||showNext||browsed)document.body.style.overflow='hidden';return()=>{document.body.style.overflow=before;};},[phase,showRules,connectionTab,showNext,browsed]);
  function start(){setPaused(false);setPhase('playing');}
  function next(){if(point===story.stages.length-1){setPhase('complete');setShowNext(true);return;}setPoint(value=>value+1);setPaused(false);setPhase('playing');}
  function replay(){setShowNext(false);setPhase('ready');setPoint(0);setPaused(false);setRun(value=>value+1);requestAnimationFrame(()=>startButton.current?.focus());}
  function closeStory(){setPhase('intermission');requestAnimationFrame(()=>document.querySelector('#match-controls button')?.focus({preventScroll:true}));}
  // Dismissing a chapter never resumes the animation. Explicit continuation is required.
  const visibleScore=score;
  return <div className="match-app">
    <a href="#match-controls" className="match-skip">Skip to rally controls</a>
    <header className="match-header"><button className="match-brand" onClick={replay} aria-label="Restart the story">h<span>b.</span></button><span className="match-name">HIMANSHU BAHETI<small>A LIFE, TOLD THROUGH TENNIS</small></span><nav className="match-quick-links" aria-label="Portfolio navigation"><a href="?view=blog">Between Points <ArrowUpRight size={13}/></a><button onClick={event=>openConnections('projects',event)}>Selected work <ArrowUpRight size={13}/></button><button className="header-connect" onClick={event=>openConnections('connect',event)}>Connect with me <ArrowUpRight size={13}/></button></nav></header>
    <main className="match-main"><div className="match-intro"><span className="match-eyebrow"><i/> LIFE COURT / A STORY IN EIGHT POINTS</span><h1>A life<br/><em>in play.</em><span>↗</span></h1><p>{phase==='ready'?story.intro:phase==='complete'?connections.completion:`Now playing: ${current.label.toLowerCase()}. ${story.explanation}`}</p><div className="match-how"><strong>One point. One chapter.</strong><p>Start a rally → discover a chapter → continue when you’re ready.</p></div>
      <div id="match-controls" className="match-controls">
        {phase==='ready'&&<button className="match-primary" ref={startButton} onClick={start}><Play size={14}/>{reduced?'Begin the story':'Start the first rally'}<ArrowRight size={17}/></button>}
        {phase==='playing'&&<><button className="match-primary" onClick={()=>setPaused(value=>!value)}>{paused?'Resume the point':'Pause the point'}<Play size={14}/></button><button className="match-text" onClick={finish}>Skip animation · reveal chapter <ArrowRight size={13}/></button></>}
        {phase==='intermission'&&<><button className="match-primary" onClick={()=>setPhase('story')}>Read this chapter <ArrowRight size={17}/></button><button className="match-text" onClick={next}>{point===7?'What’s Next':'Continue the rally'}</button></>}
        {phase==='complete'&&<><button className="match-primary" ref={nextTrigger} onClick={()=>setShowNext(true)}>What’s Next <ArrowRight size={16}/></button><button className="match-primary" onClick={event=>openConnections('connect',event)}>Let’s build the next chapter <ArrowRight size={16}/></button><button className="match-text" onClick={event=>openConnections('projects',event)}>Explore selected projects <ArrowUpRight size={13}/></button><button className="match-text" onClick={replay}>Replay the story <RotateCcw size={13}/></button></>}
      </div>
      <a className="chapter-jump" href="#chapter-library">Prefer to read? Browse all eight chapters ↓</a><p className="match-small">{story.note}</p>
    </div><section className="match-arena" aria-label="Life Court match">
      <div className="match-scoreboard"><div className="scoreboard-heading"><span>THE STORY MATCH</span><span>{phase==='complete'?'GAME COMPLETE':`POINT ${String(point+1).padStart(2,'0')} / 08`}</span></div>{story.players.map((name,index)=><div className="scoreboard-row" key={name}><span><i className={`player-color color-${index}`}/>{name}{index===0&&<small>SERVER</small>}</span><AnimatePresence mode="wait"><motion.strong key={visibleScore.values[index]} initial={reduced?false:{y:12,opacity:0}} animate={{y:0,opacity:1}} exit={reduced?{}:{y:-12,opacity:0}}>{visibleScore.values[index]}</motion.strong></AnimatePresence></div>)}</div>
      <div className="match-court-wrap"><RallyScene key={`${run}-${point}`} chapter={point} winner={current.winner} reduced={reduced} active={phase==='playing'} paused={paused||showRules||Boolean(connectionTab)||Boolean(browsed)} onComplete={finish} onPause={()=>setPaused(value=>!value)}/></div>
      <div className="match-commentary" role="status" aria-live="polite"><span className="match-live-dot"/>{phase==='ready'?'The court is ready. Your story begins with the first point.':phase==='playing'?(paused?'Take your time. The point is paused.':'The players move. A point unfolds. The next chapter is on its way.'):phase==='complete'?'The next chapter: a data engineering or Data & AI team in Dublin.':current.point}</div>
      <button className="match-rules" ref={rulesButton} onClick={()=>setShowRules(true)}>Love, deuce, advantage? <span>How the scoring works ↗</span></button>
    </section></main>
    <section id="chapter-library" className="chapter-library" aria-labelledby="library-title"><div className="library-heading"><h2 id="library-title">Eight chapters. Your starting point.</h2><p>Choose any chapter to read now, or let the rally reveal them in order.</p></div><div className="match-timeline">{story.stages.map((item,index)=><button key={item.id} onClick={event=>browse(index,event)} className={index<completed?'is-read':index===point?'is-current':''} aria-label={`Read chapter ${index+1}: ${item.label}`}><span>{String(index+1).padStart(2,'0')}</span><i/><p>{item.label}</p><ArrowUpRight size={16}/></button>)}</div></section>
    <aside className="journal-invitation"><div><span className="match-eyebrow">BEYOND THE SCOREBOARD</span><h2>The people between the points.</h2><p>Hostel life. Hum Paanch. The moments I want to keep.</p></div><a href="?view=blog">Explore Between Points <ArrowUpRight size={18}/></a></aside>
    <dialog className="browse-dialog" ref={browseDialog} aria-labelledby="browse-title" onCancel={closeBrowse}>{browsed&&<div className="point-card"><button className="point-close" onClick={closeBrowse} aria-label="Close chapter preview"><X size={20}/></button><ChapterFrame key={browsed.id} stage={browsed} active number={String(browseIndex+1).padStart(2,'0')}/><div className="point-copy"><span className="match-eyebrow">CHAPTER {browseIndex+1} / {browsed.place}</span><h2 id="browse-title" tabIndex={-1}>{browsed.title}</h2><p>{browsed.body}</p><div className="point-facts">{browsed.facts.map(fact=><span key={fact}>{fact}</span>)}</div><p className="point-reflection">{browsed.reflection}</p><button className="match-primary" onClick={closeBrowse}>Back to Life Court <ArrowRight size={18}/></button><small className="point-patience">Reading a chapter does not change the score. Your rally waits for you.</small></div></div>}</dialog>
    <footer className="match-footer"><span>BASED IN DUBLIN, IRELAND</span><span>EVERY POINT REVEALS A LITTLE MORE.</span><a href="?concept=sculpture">Sculpture study ↗</a><span>© 2026 HIMANSHU BAHETI</span></footer>
    <dialog className="point-dialog" ref={storyDialog} aria-labelledby="point-title" onCancel={closeStory}><div className="point-card"><button className="point-close" onClick={closeStory} aria-label="Close chapter and keep rally paused"><X size={20}/></button><ChapterFrame key={current.id} active={phase==='story'&&!connectionTab&&!showRules} stage={current} number={String(point+1).padStart(2,'0')}/><div className="point-copy"><div className="point-score-strip"><span>POINT TO {story.players[current.winner].toUpperCase()}</span><strong>{visibleScore.values[0]} <i>:</i> {visibleScore.values[1]}</strong></div><span className="match-eyebrow">{current.place}</span><h2 id="point-title" tabIndex={-1}>{current.title.split('\n').map(line=><span key={line}>{line}</span>)}</h2><p>{current.body}</p><div className="point-facts">{current.facts.map(fact=><span key={fact}>{fact}</span>)}</div><p className="point-reflection">{current.reflection}</p><div className="point-score-note">{current.scoreNote}</div>{point===7&&<div className="final-chapter-links"><button onClick={event=>openConnections('connect',event)}>Connect with me <ArrowUpRight size={14}/></button><button onClick={event=>openConnections('projects',event)}>Explore my projects <ArrowUpRight size={14}/></button></div>}<button ref={continueButton} className="match-primary" onClick={next}>{point===7?'What’s Next':'Continue the rally'}<ArrowRight size={18}/></button><small className="point-patience">{point===7?'The game ends. The conversation can begin.':'The next point waits for you.'}</small></div></div></dialog>
    <dialog className="point-dialog next-dialog" ref={nextDialog} aria-labelledby="next-title" onCancel={closeNext}><div className="next-slide"><button className="point-close" onClick={closeNext} aria-label="Close What’s Next"><X size={20}/></button><div className="next-visual" aria-hidden="true"><span>↗</span><i/><small>DUBLIN<br/>& BEYOND</small></div><div className="next-copy"><span className="match-eyebrow">{story.next.eyebrow}</span><h2 id="next-title" ref={nextHeading} tabIndex={-1}>{story.next.title}</h2><h3>{story.next.headline}</h3><p>{story.next.body}</p><div className="point-facts">{story.next.focus.map(item=><span key={item}>{item}</span>)}</div><p>{story.next.invitation}</p><div className="next-actions"><button className="match-primary" onClick={event=>openConnections('connect',event)}>Connect with me <ArrowUpRight size={16}/></button><button onClick={event=>openConnections('projects',event)}>Explore my projects <ArrowUpRight size={16}/></button></div><div className="next-bottom"><span>{story.next.note}</span><button onClick={replay}>Replay the story <RotateCcw size={12}/></button></div></div></div></dialog>
    <dialog className="connections-dialog" ref={connectionsDialog} aria-labelledby="connections-title" onCancel={closeConnections}><button className="connections-close" onClick={closeConnections} aria-label="Close connections"><X size={21}/></button>{connectionTab&&<ConnectionsPanel tab={connectionTab} onTab={setConnectionTab}/>}</dialog>
    <dialog className="r-dialog match-rules-dialog" ref={rulesDialog} aria-labelledby="r-detail-title" onCancel={()=>{setShowRules(false);rulesButton.current?.focus();}}><div><button className="r-close" onClick={()=>{setShowRules(false);rulesButton.current?.focus();}} aria-label="Close scoring guide"><X/></button>{showRules&&<ScoreLesson/>}</div></dialog>
  </div>;
}
