import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ArrowRight, Plus, X, Rotate3D, MoveUpRight } from 'lucide-react';
import Sculpture from './Sculpture';
import useMotionPreference from '../hooks/useMotionPreference';
import { sculptureData as data } from '../content/sculptureData';

export default function App() {
  const track=useRef(null),dialog=useRef(null),opener=useRef(null);
  const reduced=useMotionPreference();
  const [view,setView]=useState(0),[selected,setSelected]=useState(0),[ready,setReady]=useState(false),[panel,setPanel]=useState(null);
  const {scrollYProgress}=useScroll({target:track,offset:['start start','end end']});
  useMotionValueEvent(scrollYProgress,'change',value=>setView(Math.min(3,Math.round(value*3))));
  const markReady=useCallback(()=>setReady(true),[]);
  const project=data.projects[selected];
  function goTo(index){const target=track.current;window.scrollTo({top:target.offsetTop+(target.offsetHeight-window.innerHeight)*index/3,behavior:reduced?'instant':'smooth'});}
  function openPanel(type,event){opener.current=event.currentTarget;setPanel(type);}
  function closePanel(){setPanel(null);opener.current?.focus();}
  useEffect(()=>{if(panel)dialog.current?.showModal();else dialog.current?.close();},[panel]);
  useEffect(()=>{const previous=document.body.style.overflow;if(panel)document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[panel]);

  return <>
    <a className="skip-link" href="#perspectives">Skip to viewpoint controls</a>
    <header className="masthead"><button className="identity" onClick={()=>goTo(0)} aria-label="Return to front view"><span className="identity-mark">h<span>b</span><i>✳</i></span><span>HIMANSHU<br/>BAHETI</span></button><div className="header-middle"><span className="signal"/> ENGINEERING, WITH PERSPECTIVE</div><button className="about-button" onClick={event=>openPanel('about',event)}>The person behind it <ArrowUpRight size={15}/></button></header>
    <main className="sculpture-track" ref={track}>
      <div className="exhibition">
        <div className="intro-row"><div><p className="eyebrow">AN EXPLORATION IN DIMENSIONS <span>— VOL. 01</span></p><h1>{data.title.split('\n').map((line,index)=><span key={line}>{line}{index===1&&<i>↗</i>}</span>)}</h1></div><div className="intro-aside"><span className="coordinate">53.3498° N / 6.2603° W</span><p>{data.subtitle}</p><span className="edition">INTERACTIVE STUDY / 2026</span></div></div>
        <div className="sculpture-stage"><div className="stage-cross cross-left">+</div><div className="stage-cross cross-right">+</div><Sculpture progress={scrollYProgress} reduced={reduced} selected={selected} onReady={markReady}/><AnimatePresence>{!ready&&<motion.div className="scene-loading" exit={{opacity:0}}><span/>Assembling a point of view</motion.div>}</AnimatePresence><div className="stage-axis"><span>X</span><i/><span>Y</span></div><div className="object-caption"><span className="orange-square"/> OBJECT 001 <span>/</span> HIMANSHU <span>/</span> {data.views[view].label.toUpperCase()}</div><span className="material-note">{view===3?'REVERSE SURFACES / PERSONAL MOTIFS':'EXTRUDED LETTERFORMS / MIXED PERSPECTIVES'}</span></div>
        <div className="exhibit-caption"><AnimatePresence mode="wait"><motion.div key={view} initial={reduced?false:{y:16,opacity:0}} animate={{y:0,opacity:1}} exit={reduced?{}:{y:-12,opacity:0}} transition={{duration:.25}}><span className="caption-number">0{view+1}</span><h2>{data.views[view].caption}</h2><p>{data.views[view].note}</p></motion.div></AnimatePresence><button className="scroll-prompt" onClick={()=>goTo((view+1)%4)}><span>{view===3?'Back to the beginning':'Scroll to change your perspective'}</span><ArrowDown size={18}/></button></div>
        <div className="exhibit-bottom"><nav className="view-controls" id="perspectives" aria-label="Sculpture viewpoints">{data.views.map((item,index)=><button key={item.id} aria-pressed={view===index} onClick={()=>goTo(index)}><span>0{index+1}</span>{item.label}{view===index&&<motion.i layoutId="view-indicator" transition={{duration:reduced?0:.3}}/>}</button>)}</nav><button className="inspect-button" onClick={event=>openPanel(view===3?'personal':'project',event)}>{view===3?'Meet the person':'Look inside the work'}<Plus size={18}/></button></div>
        <div className="project-shelf"><span className="shelf-label">{view===3?'ANOTHER DIMENSION':'SELECTED WORK'}<ArrowRight size={12}/></span>{data.projects.map((item,index)=><button key={item.id} className={selected===index?'selected':''} onClick={()=>setSelected(index)}><span>0{index+1}</span>{item.name}<MoveUpRight size={13}/></button>)}</div>
      </div>
    </main>
    <footer className="exhibition-footer"><span><span className="signal"/>{data.location}</span><span>ONE PERSON. MORE THAN ONE PERSPECTIVE.</span><span>SCROLL / ROTATE / DISCOVER <Rotate3D size={14}/></span></footer>
    <dialog className="detail-dialog" ref={dialog} onCancel={closePanel} onClose={()=>setPanel(null)} onClick={event=>{if(event.target===event.currentTarget)closePanel();}} aria-labelledby="detail-title"><div className="detail-content"><button className="close-panel" onClick={closePanel} aria-label="Close details"><X size={23}/></button>
      {panel==='project'?<><p className="eyebrow">{project.category}</p><h2 id="detail-title">{project.name}<span>.</span></h2><p className="detail-summary">{project.summary}</p><div className="tool-list">{project.tools.map(tool=><span key={tool}>{tool}</span>)}</div><div className="architecture" aria-label="Illustrative project flow">{project.stages.map((stage,index)=><div key={stage}><span>0{index+1}</span><strong>{stage}</strong>{index<3&&<ArrowRight size={17}/>}</div>)}</div><p className="diagram-note">SIMPLIFIED CONCEPTUAL FLOW</p><div className="project-perspectives">{['front','side','inside'].map((perspective,index)=><section key={perspective}><span>0{index+1} / {perspective.toUpperCase()}</span><p>{project[perspective]}</p></section>)}</div><blockquote>{project.detail}</blockquote></>:<><p className="eyebrow">THE PERSON BEHIND THE LETTERS</p><h2 id="detail-title">Himanshu<br/>Parag Baheti<span>.</span></h2><p className="detail-summary">{data.about}</p><div className="personal-stories">{data.personal.map((item,index)=><section key={item.label}><div className={`personal-art art-${index}`} aria-hidden="true"><span>{['↗','×','↗'][index]}</span></div><div><span className="eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div></section>)}</div><p className="diagram-note">ABSTRACT GRAPHIC MOTIFS / PERSONAL PHOTOGRAPHY TO FOLLOW</p></>}
      <button className="return-button" onClick={closePanel}>Return to the sculpture <ArrowUpRight size={16}/></button>
    </div></dialog>
  </>;
}
