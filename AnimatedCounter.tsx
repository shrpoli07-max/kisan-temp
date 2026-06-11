import { useEffect, useState, useRef } from 'react';

export function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);
  
  return value;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', className = '' }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const animated = useAnimatedNumber(value);
  return <span className={className}>{prefix}{animated.toLocaleString()}{suffix}</span>;
}
