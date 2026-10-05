import useMotionPreference from '../hooks/useMotionPreference';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor({ suspended = false }) {
  const reduced = useMotionPreference();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 230, damping: 25, mass: 0.55 });
  const smoothY = useSpring(y, { stiffness: 230, damping: 25, mass: 0.55 });

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const hide = () => { setVisible(false); document.documentElement.classList.remove('custom-cursor-active'); };
    const move = event => {
      if (!query.matches || reduced || suspended || event.pointerType === 'touch') { hide(); return; }
      x.set(event.clientX); y.set(event.clientY);
      setExpanded(Boolean(event.target.closest('a, button, [data-cursor="tilt"]')));
      setVisible(true);
      document.documentElement.classList.add('custom-cursor-active');
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    query.addEventListener('change', hide);
    hide();
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      query.removeEventListener('change', hide);
      hide();
    };
  }, [reduced, suspended, x, y]);

  return <motion.div className="custom-cursor" aria-hidden="true" data-expanded={expanded} style={{ x: smoothX, y: smoothY }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.15 }}><motion.span animate={{ scale: expanded ? 3.2 : 1, backgroundColor: expanded ? '#004fff' : '#ff5e00' }} transition={{ type: 'spring', stiffness: 280, damping: 22 }} /></motion.div>;
}
