import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { chapterMedia } from '../content/connections';
import useMotionPreference from '../hooks/useMotionPreference';

export default function ChapterFrame({ stage, number, active = false }) {
  const media=chapterMedia[stage.id];
  const [failed,setFailed]=useState(false);
  const videoRef=useRef(null);
  const reduced=useMotionPreference();
  const isVideo=media.type==='video'||/\.mp4(?:[?#]|$)/i.test(media.src);
  useEffect(()=>{
    const video=videoRef.current;
    if(!video)return;
    const syncPlayback=()=>{
      if(active&&!reduced&&!document.hidden){
        video.muted=true;
        // Native controls remain available if the browser declines autoplay.
        video.play().catch(()=>{});
      }else video.pause();
    };
    syncPlayback();
    document.addEventListener('visibilitychange',syncPlayback);
    return()=>{document.removeEventListener('visibilitychange',syncPlayback);video.pause();};
  },[active,reduced,media.src]);
  return <div className={`point-art art-${stage.theme} framed-art`}><span className="frame-chapter" aria-hidden="true">{number}</span><figure className="chapter-photo-frame">
    <div className={`chapter-photo kind-${media.kind}`}>
      {media.src&&!failed?(isVideo?<video ref={videoRef} src={media.src} aria-label={media.alt} controls muted loop autoPlay={active&&!reduced} playsInline preload="metadata" onError={()=>setFailed(true)}/>:<img src={media.src} alt={media.alt} onError={()=>setFailed(true)}/>):<div className="photo-placeholder"><div className="placeholder-lines" aria-hidden="true"/><Camera size={24} strokeWidth={1}/><span>{media.suggestion}</span><small>{media.src?(isVideo?'Video unavailable':'Image unavailable'):(isVideo?'Your video goes here':'Your photograph goes here')}</small></div>}
    </div><figcaption>{media.caption}</figcaption></figure><small className="frame-kicker">{stage.kicker}</small></div>;
}
