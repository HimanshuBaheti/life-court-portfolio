import useMotionPreference from '../hooks/useMotionPreference';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

export default function GlassCard({ children, className = '' }) {
  const reduced = useMotionPreference();
  const pitch = useMotionValue(0);
  const yaw = useMotionValue(0);
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const rotateX = useSpring(pitch, { stiffness: 210, damping: 23 });
  const rotateY = useSpring(yaw, { stiffness: 210, damping: 23 });
  const shine = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,.65), transparent 65%)`;
  function reset() { pitch.set(0); yaw.set(0); }
  function track(event) {
    if (reduced || event.pointerType !== 'mouse') return;
    // offset sizes stay stable while the card itself rotates.
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    pitch.set((0.5 - ny) * 12); yaw.set((nx - 0.5) * 14);
    lightX.set(nx * 100); lightY.set(ny * 100);
  }
  return <motion.div className={`glass-card ${className}`} data-cursor="tilt" onPointerMove={track} onPointerLeave={reset} onPointerCancel={reset} style={{ transformPerspective: 900, rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
    <motion.span className="card-shine" aria-hidden="true" style={{ background: shine }} />{children}
  </motion.div>;
}
