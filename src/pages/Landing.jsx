import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  QrCode, Map, Zap, BarChart3, Shield, Clock,
  CheckCircle, XCircle, ArrowRight, Users, TrendingUp,
  Coffee, Cpu, Star
} from 'lucide-react';
import { useApp } from '../store/useAppStore';

function AnimCounter({ to, duration = 2000, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
}

const FEATURES = [
  { icon: QrCode,       color: '#2563EB', bg: '#EFF6FF', title: 'QR Check-In',          desc: 'Scan a QR code to instantly claim your desk. Zero friction, zero paperwork.' },
  { icon: Map,          color: '#4F46E5', bg: '#EEF2FF', title: 'Live Occupancy Map',    desc: 'See every desk status in real time. Color-coded and interactive.' },
  { icon: Coffee,       color: '#F59E0B', bg: '#FFF7ED', title: 'Away Mode',             desc: '20-minute hold protects your seat while you grab coffee or use restrooms.' },
  { icon: Zap,          color: '#22C55E', bg: '#F0FDF4', title: 'Auto Release',          desc: 'Abandoned desks auto-reset after timeout, freeing space fairly.' },
  { icon: Shield,       color: '#7C3AED', bg: '#F5F3FF', title: 'Librarian Dashboard',   desc: 'Full occupancy overview, alerts, and manual controls for staff.' },
  { icon: BarChart3,    color: '#0891B2', bg: '#ECFEFF', title: 'Smart Analytics',       desc: 'Occupancy trends, peak hours, zone utilization—all in beautiful charts.' },
  { icon: Cpu,          color: '#EF4444', bg: '#FFF1F2', title: 'Digital Twin',          desc: 'A real-time mirror of your library—every desk, every zone, every second.' },
  { icon: TrendingUp,   color: '#059669', bg: '#ECFDF5', title: 'Smart Recommendations', desc: 'AI-powered seat finder suggests the best desk based on your preferences.' },
];

export default function Landing() {
  const { state } = useApp();
  const { stats } = state;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero-gradient" style={{ paddingTop: 100, paddingBottom: 80, overflowX: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}
          >
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', position: 'absolute' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', position: 'absolute', animation: 'ping 1.5s ease-out infinite', opacity: 0.5 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>
              Live · {stats.available} seats available right now
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{ fontSize: 'clamp(42px, 8vw, 88px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16 }}
          >
            <span className="gradient-text">SeatSync</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600, color: '#1E293B', marginBottom: 12 }}
          >
            Smart Library Occupancy & Anti-Hoarding System
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ fontSize: 16, color: '#64748B', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}
          >
            Transforming library space management through real-time occupancy intelligence.
            No more desk hoarding. No more empty searches.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/student">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(37,99,235,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ fontSize: 16, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Launch Student Portal <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/map">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
                style={{ fontSize: 16, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Map size={18} /> View Live Library
              </motion.button>
            </Link>
          </motion.div>

          {/* Live Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 16, maxWidth: 700, margin: '64px auto 0',
            }}
          >
            {[
              { label: 'Occupied', value: stats.occupancyPercent, suffix: '%', color: '#EF4444', bg: '#FFF1F2' },
              { label: 'Available', value: stats.available, color: '#22C55E', bg: '#F0FDF4' },
              { label: 'Sessions Today', value: stats.sessionsToday, color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Avg Session', value: 102, suffix: 'min', color: '#F59E0B', bg: '#FFF7ED' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                style={{
                  background: 'white', borderRadius: 20, padding: '22px 20px',
                  border: `1px solid ${s.bg}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: s.color, letterSpacing: '-0.03em' }}>
                  <AnimCounter to={s.value} suffix={s.suffix ?? ''} duration={1600 + i * 200} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Problem / Solution ───────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            The Problem We Solve
          </span>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', marginTop: 8, letterSpacing: '-0.02em' }}>
            The Desk-Hoarding Crisis
          </h2>
        </motion.div>

        <div className="grid-2col" style={{ gap: 24 }}>
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
            style={{ padding: 32, borderTop: '4px solid #EF4444' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <XCircle size={22} color="#EF4444" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Before SeatSync</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Chaos & Frustration</div>
              </div>
            </div>
            {[
              'Bags reserve desks for hours',
              'No way to know seat availability',
              'Students walk floor to floor searching',
              'Peak hours become impossible',
              'No accountability for hoarding',
              'Wasted library capacity',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <XCircle size={15} color="#EF4444" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
              </div>
            ))}
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
            style={{ padding: 32, borderTop: '4px solid #22C55E' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={22} color="#22C55E" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>After SeatSync</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Intelligence & Fairness</div>
              </div>
            </div>
            {[
              'Live desk availability on your phone',
              'Fair automatic seat recovery',
              'QR check-in in under 5 seconds',
              'Away mode protects legitimate breaks',
              'Librarian dashboard with full control',
              'Analytics to optimize space usage',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <CheckCircle size={15} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Platform Capabilities
          </span>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', marginTop: 8, letterSpacing: '-0.02em' }}>
            Everything you need
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}
              className="card"
              style={{ padding: 24, cursor: 'default' }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <f.icon size={24} color={f.color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            borderRadius: 28, padding: '56px 48px',
            boxShadow: '0 24px 64px rgba(37,99,235,0.35)',
          }}
        >
          <Star size={32} color="rgba(255,255,255,0.5)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ready to reclaim your study space?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
            Join 1,200+ students already using SeatSync at Central Campus Library.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/qr">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{
                  background: 'white', color: '#2563EB',
                  border: 'none', borderRadius: 14, padding: '14px 32px',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <QrCode size={18} /> Scan & Check In
              </motion.button>
            </Link>
            <Link to="/analytics">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{
                  background: 'rgba(255,255,255,0.15)', color: 'white',
                  border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 14,
                  padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <BarChart3 size={18} /> View Analytics
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: '#0F172A' }}>SeatSync</span>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8' }}>
          Smart Library Occupancy & Anti-Hoarding System · Campus Innovation 2025
        </p>
      </footer>
    </div>
  );
}
