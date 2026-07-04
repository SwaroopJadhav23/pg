import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function AnimatedCounter({ end, suffix = '', decimals = 0, duration = 2.2 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(latest)
    });
    return () => controls.stop();
  }, [inView, end, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}
