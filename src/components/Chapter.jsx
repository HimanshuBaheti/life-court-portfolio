import { ArrowDownRight, ArrowUpRight, Asterisk, Database, Workflow, ScanLine, MoveRight } from 'lucide-react';
import { motion, useTransform } from 'framer-motion';
import { portfolioData as data } from '../content/portfolioData';
import GlassCard from './GlassCard';
import Media from './Media';
import MediaGrid from './MediaGrid';
import ContactLinks from './ContactLinks';

const icons = { database: Database, workflow: Workflow, scan: ScanLine };

const reveal = {
  hidden: { y: '115%', rotate: 3 },
  visible: { y: '0%', rotate: 0, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } },
};

function ChapterCopy({ chapter, reduced, x }) {
  return <motion.div className="chapter-copy" style={{ x }} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={{ visible: { transition: { staggerChildren: 0.13, delayChildren: chapter.id === 'origins' ? 0.65 : 0.1 } } }}>
    <div className="reveal-mask"><motion.div variants={reveal} className="eyebrow"><span className="tiny-line" />{chapter.eyebrow}</motion.div></div>
    <h1><span className="reveal-mask"><motion.span className="reveal-line" variants={reveal}>{chapter.title}</motion.span></span><span className="reveal-mask"><motion.em className="reveal-line" variants={reveal}>{chapter.titleItalic}</motion.em></span></h1>
    <div className="reveal-mask"><motion.div variants={reveal} className="intro">{chapter.intro}{chapter.alias && <span> {chapter.alias}</span>}</motion.div></div>
    <div className="reveal-mask"><motion.p variants={reveal} className="description">{chapter.description}</motion.p></div>
    <motion.div variants={reveal} className="tags">{chapter.tags.map(tag => <span key={tag}>{tag}</span>)}</motion.div>
  </motion.div>;
}

function Origins({ chapter, reduced }) {
  return <div className="origin-art">
    <div className="vertical-caption">{chapter.photoLabel}</div>
    <figure className="hero-photo">
      <Media media={chapter.image} eager />
      {chapter.videoEnabled && !reduced && <video className="ambient-video" poster={chapter.image.fallback} autoPlay loop muted playsInline aria-hidden="true"><source src={chapter.video} type="video/mp4" /></video>}
      <div className="image-shade" />
      <div className="photo-top"><span className="live-dot" />{data.role}<ArrowUpRight size={18} /></div>
      <figcaption><Asterisk size={39} strokeWidth={1.2} /><span>{chapter.floating}</span><small>{chapter.photoCaption}</small></figcaption>
    </figure>
    <GlassCard className="memory-card"><div className="memory-images">{chapter.memories.map((media, index) => <motion.div key={media.src} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 + index * 0.25, duration: 1 }}><Media media={media} /></motion.div>)}</div><span>{chapter.memoryCaption}</span></GlassCard>
    <div className="round-stamp"><Asterisk size={25} /><span>{chapter.stamp}</span></div>
  </div>;
}

function Academy({ chapter }) {
  return <div className="academy-art">
    <figure className="polaroid main-polaroid"><Media media={chapter.image} /><figcaption>{chapter.photoCaption}</figcaption></figure>
    <figure className="polaroid small-polaroid"><Media media={chapter.secondImage} /><figcaption>{chapter.secondCaption}</figcaption></figure>
    <GlassCard className="code-card"><div className="code-dots"><i /><i /><i /></div><pre>{chapter.code.join('\n')}</pre></GlassCard>
    <span className="handwritten">{chapter.annotation}</span>
  </div>;
}

function Professional({ chapter }) {
  return <div className="engineering-art"><div className="data-diagram">{chapter.diagram.map((item, index) => <div key={item}><span>{item}</span>{index < 2 && <MoveRight size={21} />}</div>)}</div><div className="project-list">{chapter.projects.map(project => {
    const Icon = icons[project.icon];
    return <GlassCard key={project.number} className="project-card"><div className="project-icon"><Icon size={22} strokeWidth={1.5} /></div><div><span className="micro">{project.type}</span><h3>{project.title}</h3><p>{project.description}</p><small>{project.stack}</small></div><span className="project-number">{project.number}</span></GlassCard>;
  })}</div></div>;
}

function Dublin({ chapter }) {
  return <div className="dublin-art"><figure className="dublin-photo"><Media media={chapter.image} /><figcaption>{chapter.photoCaption}</figcaption></figure><GlassCard className="contact-card"><span className="micro">{chapter.contactLabel}</span><h3>{chapter.contactHeading}</h3><ContactLinks /></GlassCard></div>;
}

export default function Chapter({ chapter, index, onNavigate, reduced, vertical, progress }) {
  // Each chapter is centered at its navigation stop. Layers drift at distinct
  // speeds through the surrounding viewport, without affecting document layout.
  const local = useTransform(progress, value => value * 4 - index);
  const artX = useTransform(local, [-1, 0, 1], ['-22vw', '0vw', '22vw']);
  const copyX = useTransform(local, [-1, 0, 1], ['4vw', '0vw', '-4vw']);
  const backdropX = useTransform(local, [-1, 0, 1], ['-42vw', '0vw', '42vw']);
  const orbitRotate = useTransform(local, [-1, 0, 1], [-65, 0, 65]);
  const artRotate = useTransform(local, [-1, 0, 1], [-5, 0, 5]);
  const motionEnabled = !vertical && !reduced;
  return <section className={`chapter chapter-${chapter.id}`} id={chapter.id} aria-label={`${data.ui.chapter} ${chapter.number}: ${chapter.nav}`}>
    <motion.div className="chapter-atmosphere" aria-hidden="true" style={{ x: motionEnabled ? backdropX : 0 }}><span className="ghost-number">{chapter.number}</span><motion.span className="orbital-mark" style={{ rotate: motionEnabled ? orbitRotate : 0 }}><Asterisk strokeWidth={0.65} /></motion.span><span className="accent-orbit" /></motion.div>
    <div className="chapter-inner"><ChapterCopy chapter={chapter} reduced={reduced} x={motionEnabled ? copyX : 0} />
      <motion.div className="art-layer" style={{ x: motionEnabled ? artX : 0, rotate: motionEnabled ? artRotate : 0 }}>
      {chapter.id === 'origins' && <Origins chapter={chapter} reduced={reduced} />}
      {chapter.id === 'academy' && <Academy chapter={chapter} />}
      {chapter.id === 'professional' && <Professional chapter={chapter} />}
      {chapter.id === 'lens' && <MediaGrid items={chapter.gallery} />}
      {chapter.id === 'dublin' && <Dublin chapter={chapter} />}
      </motion.div>
    </div>
    <div className="chapter-bottom"><span className="chapter-note"><Asterisk size={17} />{chapter.note}</span><button onClick={() => onNavigate(index === 4 ? 0 : index + 1)}>{index === 4 ? data.ui.back : index === 0 ? data.ui.scroll : data.ui.next}<ArrowDownRight size={19} /></button></div>
  </section>;
}
