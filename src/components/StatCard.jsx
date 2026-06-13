import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function useCountUp(target, duration = 1200, start = 0) {
  const [val, setVal] = useState(start);
  const raf = useRef(null);
  const startTime = useRef(null);
  const startVal = useRef(start);

  useEffect(() => {
    startVal.current = val;
    startTime.current = null;
    const step = (ts) => {
      if (!startTime.current) startTime.current = ts;
      const elapsed = ts - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-quart
      const ease = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(startVal.current + (target - startVal.current) * ease));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return val;
}

export default function StatCard({
  label, value, unit = '', icon: Icon,
  color = '#2563EB', bg = '#EFF6FF',
  trend, trendLabel, suffix = '', large = false, delay = 0,
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const animatedVal = useCountUp(visible ? value : 0, 1400);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      className="card card-hover"
      style={{ padding: large ? '24px 28px' : '18px 20px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background circle decoration */}
      <div style={{
        position: 'absolute', right: -20, top: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: bg, opacity: 0.5,
      }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Icon + Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && (
            <div style={{
              width: large ? 40 : 32, height: large ? 40 : 32,
              borderRadius: large ? 12 : 10,
              background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={large ? 20 : 16} color={color} />
            </div>
          )}
          <span style={{ fontSize: large ? 13 : 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </span>
        </div>

        {/* Value */}
        <div style={{
          fontSize: large ? 42 : 30, fontWeight: 900, color: '#0F172A',
          letterSpacing: '-0.03em', lineHeight: 1.1,
        }}>
          {unit}{animatedVal.toLocaleString()}{suffix}
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {trend > 0
              ? <TrendingUp size={13} color="#22C55E" />
              : trend < 0
              ? <TrendingDown size={13} color="#EF4444" />
              : <Minus size={13} color="#94A3B8" />}
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: trend > 0 ? '#15803D' : trend < 0 ? '#DC2626' : '#64748B',
            }}>
              {trend > 0 ? '+' : ''}{trend}% {trendLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
