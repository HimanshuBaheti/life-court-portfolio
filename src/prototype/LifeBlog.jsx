import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowRight, X, Pause, Camera } from 'lucide-react';
import useMotionPreference from '../hooks/useMotionPreference';
import { stories, journalCopy } from '../content/lifeBlog';
import './match.css';
import './life-blog.css';

const url = media => `${import.meta.env.BASE_URL}${media.src}`;
const storyUrl = id => `?view=blog&story=${id}`;

// Only emphasis is parsed; article text never becomes executable HTML.
function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> :
      part.startsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part);
}
function sectionsFrom(text) {
  const [opening, ...sections] = text.trim().split(/^### /m);
  const paragraphs = value => value.trim().split(/\n\s*\n/).filter(Boolean);
  return [{ title: 'Before the memories', paragraphs: paragraphs(opening.replace(/^# .+\n/, '')) }, ...sections.map(section => {
    const split = section.indexOf('\n');
    return { title: section.slice(0, split).trim(), paragraphs: paragraphs(section.slice(split)) };
  })];
}

function Memory({ media, eager = false }) {
  const ref = useRef(null);
  const reduced = useMotionPreference();
  const [failed, setFailed] = useState(false);
  // Videos only run while visible. Respect reduced motion, hidden tabs and manual pauses.
  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    let visible = false;
    let stopped = false;
    let automaticPause = false;
    const sync = () => {
      if (visible && !document.hidden && !stopped) video.play().catch(() => {});
      else if (!video.paused) { automaticPause = true; video.pause(); }
    };
    const onPause = () => { if (automaticPause) automaticPause = false; else stopped = true; };
    const onPlay = () => { stopped = false; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.2 });
    observer.observe(video);
    video.addEventListener('pause', onPause);
    video.addEventListener('play', onPlay);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); video.removeEventListener('pause', onPause); video.removeEventListener('play', onPlay); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [media.src, reduced]);
  if (failed) return <div className="bp-missing"><Camera /><span>This memory couldn’t load.</span></div>;
  return media.type === 'video'
    ? <video ref={ref} src={url(media)} muted loop playsInline controls preload="metadata" aria-label={media.alt} onError={() => setFailed(true)} />
    : <img src={url(media)} alt={media.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}

function PhotoMoment({ media, onOpen, index = 0 }) {
  const reduced = useMotionPreference();
  return <motion.figure className="bp-photo" initial={reduced ? false : { opacity: 0, y: 24, rotate: index % 2 ? 2 : -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65 }}>
    {media.type === 'video' ? <Memory media={media} /> : <button onClick={event => onOpen(media, event)} aria-label={`Enlarge photograph: ${media.caption}`}><Memory media={media} /><span className="bp-enlarge">Stay here a little longer ↗</span></button>}
    <figcaption>{media.caption}</figcaption>
  </motion.figure>;
}

function Collection() {
  const reduced = useMotionPreference();
  return <>
    <header className="bp-hero"><span className="bp-label">LIFE COURT / THE PERSONAL COLLECTION</span><h1>Between<br /><em>Points.</em><span className="bp-pause"><Pause size={26} /></span></h1><div className="bp-hero-note"><span>01 — PAUSE HERE</span><p>{journalCopy.intro}</p><small>{journalCopy.description}</small></div><a className="bp-index-link" href="#all-stories">Explore the stories ↓</a></header>
    <main id="all-stories" className="bp-collection" aria-label="All stories">
      {stories.map((story, index) => story.status === 'published' ? <article className={`bp-story-tile bp-tile-${story.id}`} key={story.id}>
        <a className="bp-assemblage" href={storyUrl(story.id)} aria-label={`Read ${story.title}`}>
          {story.keepsakes.map((media, i) => <motion.div className={`bp-keepsake bp-keepsake-${i}`} key={media.src} initial={reduced ? false : { opacity: 0, x: i ? 35 : -35, rotate: i ? 10 : -10 }} whileInView={{ opacity: 1, x: 0, rotate: i ? 7 : -8 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.12 }}><Memory media={media} /><span>{media.caption}</span></motion.div>)}
          <motion.div className="bp-cover-frame" initial={reduced ? false : { y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}><Memory media={story.cover} eager /><span>KEEP THIS EVENING / 0{index + 1}</span></motion.div>
        </a>
        <div className="bp-tile-copy"><span className="bp-label">0{index + 1} / {story.label}</span><h2><a href={storyUrl(story.id)}>{story.title}</a></h2><p>{story.teaser}</p><a className="bp-read" href={storyUrl(story.id)}>Read the story <ArrowUpRight size={18} /></a></div>
      </article> : <article className="bp-coming" key={story.id}><div className="bp-envelope" aria-hidden="true"><span>TO: THE NEXT MEMORY</span><i>↗</i></div><div><span className="bp-label">{String(index + 1).padStart(2, '0')} / {story.label}</span><h2>{story.title}</h2><p>{story.subtitle}</p><span className="bp-soon">Coming soon</span></div></article>)}
    </main>
    <footer className="bp-footer"><p>Some things are worth staying for.</p><a href="?">Back to Life Court <ArrowRight size={16} /></a></footer>
  </>;
}

function Article({ story }) {
  const sections = sectionsFrom(story.text);
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null), opener = useRef(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const readingMinutes = Math.ceil(story.text.split(/\s+/).length / 220);
  useEffect(() => {
    if (!selected) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => { document.body.style.overflow = before; dialog.current?.close(); };
  }, [selected]);
  function open(media, event) { opener.current = event.currentTarget; setSelected(media); }
  function close() { setSelected(null); requestAnimationFrame(() => opener.current?.focus({ preventScroll: true })); }
  const next = stories.find(item => item.status === 'published' && item.id !== story.id);
  return <>
    <motion.div className="bp-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} aria-hidden="true" />
    <main id="story-reading">
      <header className="bp-article-hero"><div><a className="bp-back" href="?view=blog"><ArrowLeft size={15} /> All stories</a><span className="bp-label">{story.label} / {readingMinutes} MIN READ</span><h1>{story.title}<em>{story.subtitle}</em></h1><p>{story.teaser}</p><a href="#memory-0" className="bp-index-link">Begin reading ↓</a></div><PhotoMoment media={story.cover} onOpen={open} /></header>
      <div className="bp-reading-layout"><aside className="bp-contents"><details open><summary>Inside this story</summary><nav aria-label="Story sections">{sections.map((section, i) => <a key={section.title} href={`#memory-${i}`}><span>{String(i + 1).padStart(2, '0')}</span>{section.title}</a>)}</nav></details><span className="bp-margin-note">No rush.<br />The next point can wait.</span></aside>
        <article className="bp-prose">{sections.map((section, i) => <section id={`memory-${i}`} className="bp-section" key={section.title}>
          {i > 0 && <header><span className="bp-label">MEMORY / {String(i).padStart(2, '0')}</span><h2>{section.title}</h2></header>}
          {section.paragraphs.map((paragraph, j) => <p key={j}><Inline text={paragraph} /></p>)}
          {story.sectionMedia[section.title]?.map((media, j) => <PhotoMoment key={media.src} media={media} onOpen={open} index={j} />)}
        </section>)}
        <div className="bp-return-memory"><span className="bp-label">BACK TO THE PEOPLE WHO MADE IT MATTER</span><blockquote>{story.closing}</blockquote><PhotoMoment media={story.cover} onOpen={open} /></div>
        <footer className="bp-article-end"><span className="bp-label">ANOTHER MEMORY TO STAY FOR</span><a href={storyUrl(next.id)}>{next.title} <ArrowUpRight /></a><a className="bp-back" href="?view=blog">Back to all stories</a></footer>
        </article>
      </div>
    </main>
    <dialog ref={dialog} className="bp-lightbox" aria-label="Photograph viewer" onCancel={close}><button className="bp-lightbox-close" onClick={close} aria-label="Close photograph"><X /></button>{selected && <figure><Memory media={selected} eager /><figcaption>{selected.caption}</figcaption></figure>}</dialog>
  </>;
}

export default function LifeBlog() {
  const id = new URLSearchParams(window.location.search).get('story');
  const story = stories.find(item => item.id === id && item.status === 'published');
  useEffect(() => { const before = document.title; document.title = `${story?.title || journalCopy.title} | Himanshu Baheti`; return () => { document.title = before; }; }, [story]);
  return <div className={`between-points ${story ? 'bp-reading' : ''}`}><a className="match-skip" href={story ? '#story-reading' : '#all-stories'}>Skip to stories</a><header className="bp-header"><a href="?" className="bp-back"><ArrowLeft size={16} /> Life Court</a><a href="?view=blog" className="bp-wordmark">between points<span>by Himanshu Baheti</span></a><a href="?view=blog#all-stories">All stories <ArrowUpRight size={14} /></a></header>{story ? <Article story={story} /> : <Collection />}</div>;
}
