import useMotionPreference from './hooks/useMotionPreference';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Asterisk, X } from 'lucide-react';
import { portfolioData as data } from './content/portfolioData';
import Chapter from './components/Chapter';
import ContactLinks from './components/ContactLinks';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const storyRef = useRef(null);
  const dialogRef = useRef(null);
  const contactButtonRef = useRef(null);
  const reduced = useMotionPreference();
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 900px), (max-height: 600px)').matches);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const vertical = compact || reduced;
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);

  useMotionValueEvent(scrollYProgress, 'change', value => {
    if (!vertical) setActive(Math.min(4, Math.round(value * 4)));
  });

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px), (max-height: 600px)');
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => { query.removeEventListener('change', update); window.clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (!vertical) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(data.chapters.findIndex(chapter => chapter.id === entry.target.id));
    }, { rootMargin: '-20% 0px -50% 0px' });
    document.querySelectorAll('.chapter').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [vertical]);

  useEffect(() => {
    if (contactOpen) dialogRef.current?.showModal();
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [contactOpen]);

  // Native page scrolling drives the filmstrip; touch and reduced-motion users get a vertical story.
  function navigate(index) {
    if (vertical) document.getElementById(data.chapters[index].id)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    else {
      const container = storyRef.current;
      window.scrollTo({ top: container.offsetTop + (container.offsetHeight - window.innerHeight) * index / 4, behavior: reduced ? 'instant' : 'smooth' });
    }
  }

  function closeContact() { setContactOpen(false); contactButtonRef.current?.focus(); }

  return <>
    <CustomCursor suspended={contactOpen || loading} />
    <AnimatePresence>{loading && <motion.div className="loading-screen" role="status" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.4 }}><span className="loading-mark">{data.monogram}</span><p>{data.loading.title}</p><small>{data.loading.label}</small><span className="loading-line" /></motion.div>}</AnimatePresence>
    <a className="skip-link" href="#origins" onClick={(event) => { event.preventDefault(); navigate(0); document.getElementById('story-start')?.focus(); }}>{data.navigation.skip}</a>
    <header className="site-header"><a className="brand" href="#origins" onClick={event => { event.preventDefault(); navigate(0); }} aria-label={data.navigation.home}><span className="brand-mark">{data.monogram}</span><span>{data.shortName}<small>{data.siteTitle}</small></span></a>
      <nav aria-label={data.navigation.label}>{data.chapters.map((chapter, index) => <button key={chapter.id} onClick={() => navigate(index)} aria-current={active === index ? 'step' : undefined}><span className="nav-dot" />{chapter.nav}</button>)}</nav>
      <button className="connect-button" ref={contactButtonRef} onClick={() => setContactOpen(true)}>{data.navigation.contact}<ArrowUpRight size={16} /></button>
    </header>
    <main ref={storyRef} className={`story ${vertical ? 'vertical-story' : ''}`} id="story-start" tabIndex={-1}>
      <div className="story-viewport"><motion.div className="filmstrip" style={{ x: vertical ? 0 : x }}>{data.chapters.map((chapter, index) => <Chapter key={chapter.id} chapter={chapter} index={index} onNavigate={navigate} reduced={reduced} vertical={vertical} progress={scrollYProgress} />)}</motion.div></div>
    </main>
    <footer className="site-footer"><span className="footer-location"><span className="status-dot" />{data.location}</span><div className="film-progress" aria-label={data.ui.progress}><span>0{active + 1}</span><div className="progress-segments">{data.chapters.map((chapter, index) => <button key={chapter.id} aria-label={chapter.nav} aria-current={active === index ? 'step' : undefined} onClick={() => navigate(index)} className={index === active ? 'active' : ''} />)}</div><span>05</span></div><span className="footer-note">{data.footer.left}<Asterisk size={16} /></span></footer>
    <dialog ref={dialogRef} className="contact-dialog" onCancel={closeContact} onClose={() => setContactOpen(false)} onClick={event => { if (event.target === event.currentTarget) closeContact(); }}><div><button className="dialog-close" onClick={closeContact} aria-label={data.ui.close}><X size={21} /></button><Asterisk size={35} /><h2>{data.ui.contactTitle}</h2><p>{data.contacts.some(contact => contact.href) ? data.role : data.ui.contactIntro}</p><ContactLinks /></div></dialog>
  </>;
}
