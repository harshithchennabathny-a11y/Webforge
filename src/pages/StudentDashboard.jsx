import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Clock, MapPin, Zap, Coffee, DoorOpen, RotateCcw,
  CheckCircle, AlertTriangle, TrendingUp, Map, QrCode
} from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { ZONES } from '../data/mockData';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';

function SessionTimer({ checkIn }) {
  const [elapsed, setElapsed] = useState('');
  useEffect(() => {
    const update = () => {
      if (!checkIn) { setElapsed('—'); return; }
      const diff = Math.floor((Date.now() - new Date(checkIn)) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setElapsed(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [checkIn]);
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{elapsed}</span>;
}

const STATUS_CONFIG = {
  available:  { color: '#22C55E', bg: '#DCFCE7', label: 'Available',  icon: CheckCircle },
  occupied:   { color: '#EF4444', bg: '#FEE2E2', label: 'Occupied',   icon: User },
  away:       { color: '#F59E0B', bg: '#FEF3C7', label: 'Away',       icon: Coffee },
  abandoned:  { color: '#6B7280', bg: '#F3F4F6', label: 'Abandoned',  icon: AlertTriangle },
};

export default function StudentDashboard() {
  const { state, markAway, returnDesk, releaseDesk } = useApp();
  const { currentStudent, stats, activityFeed } = state;

  const myDesk = state.desks.find(d => d.id === state.myDeskId);
  const zone   = myDesk ? ZONES.find(z => z.id === myDesk.zone) : null;
  const cfg    = myDesk ? (STATUS_CONFIG[myDesk.status] ?? STATUS_CONFIG.available) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 80 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A, #2563EB, #4F46E5)',
        padding: '32px 24px 80px',
      }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 800, color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {currentStudent.name.charAt(0)}
            </motion.div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}
              >
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{ color: 'white', fontSize: 24, fontWeight: 800 }}
              >
                {currentStudent.name}
              </motion.div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                {currentStudent.rollNo} · {currentStudent.dept} · Year {currentStudent.year}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ marginTop: -56 }}>
        <div className="grid-student" style={{ marginBottom: 28 }}>
          {/* My Desk Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            style={{
              gridColumn: 'span 2', padding: 28,
              borderTop: `4px solid ${cfg?.color ?? '#2563EB'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  My Desk
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                  {myDesk?.id ?? '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <MapPin size={13} color="#64748B" />
                  <span style={{ fontSize: 13, color: '#64748B' }}>
                    {zone?.name} — {zone?.label}
                  </span>
                </div>
              </div>
              {cfg && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 99,
                  background: cfg.bg, color: cfg.color,
                  fontSize: 12, fontWeight: 700,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color }} />
                  {cfg.label}
                </div>
              )}
            </div>

            {/* Session Timer */}
            {myDesk?.checkIn && (
              <div style={{
                background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
                borderRadius: 14, padding: '16px 20px', marginBottom: 20,
                border: '1px solid #DBEAFE',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Session Duration
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#2563EB', letterSpacing: '-0.04em' }}>
                  <SessionTimer checkIn={myDesk.checkIn} />
                </div>
              </div>
            )}

            {/* Features */}
            {myDesk?.features && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {myDesk.features.map(f => (
                  <span key={f} style={{
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 500, color: '#374151',
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Seat Controls */}
            {myDesk && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {myDesk.status === 'occupied' && (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="btn-amber"
                    style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onClick={() => markAway(myDesk.id)}
                  >
                    <Coffee size={15} /> Mark Away
                  </motion.button>
                )}
                {myDesk.status === 'away' && (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onClick={() => returnDesk(myDesk.id)}
                  >
                    <RotateCcw size={15} /> I'm Back
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-danger"
                  style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onClick={() => releaseDesk(myDesk.id)}
                >
                  <DoorOpen size={15} /> Release Seat
                </motion.button>
              </div>
            )}

            {!myDesk && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ color: '#64748B', marginBottom: 16, fontSize: 14 }}>You don't have an active desk session.</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <Link to="/map">
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Map size={15} /> Find a Desk
                    </button>
                  </Link>
                  <Link to="/qr">
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <QrCode size={15} /> QR Check-In
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Occupancy Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ padding: 24 }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Library Status</div>
            {[
              { label: 'Available',  value: stats.available,  color: '#22C55E', bg: '#DCFCE7' },
              { label: 'Occupied',   value: stats.occupied,   color: '#EF4444', bg: '#FEE2E2' },
              { label: 'Away',       value: stats.away,       color: '#F59E0B', bg: '#FEF3C7' },
              { label: 'Abandoned',  value: stats.abandoned,  color: '#6B7280', bg: '#F3F4F6' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{s.value}</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.value / stats.totalDesks) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{ height: '100%', borderRadius: 99, background: s.color, transition: 'width 1s' }}
                  />
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9',
              fontSize: 13, color: '#64748B',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Desks</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{stats.totalDesks}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span>Occupancy Rate</span>
                <span style={{ fontWeight: 700, color: '#2563EB' }}>{stats.occupancyPercent}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Stats + Activity Feed */}
        <div className="grid-4col" style={{ marginBottom: 28 }}>
          <StatCard label="Sessions Today" value={stats.sessionsToday} icon={TrendingUp} color="#2563EB" bg="#EFF6FF" delay={0.1} trend={8} trendLabel="vs yesterday" />
          <StatCard label="Available Now" value={stats.available} icon={CheckCircle} color="#22C55E" bg="#DCFCE7" delay={0.15} />
          <StatCard label="Avg Session" value={102} suffix=" min" icon={Clock} color="#F59E0B" bg="#FFF7ED" delay={0.2} />
          <StatCard label="Away Desks" value={stats.away} icon={Coffee} color="#F59E0B" bg="#FFF7ED" delay={0.25} />
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: 24, marginBottom: 40 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Recent Activity</h3>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Live Feed</span>
          </div>
          <ActivityFeed events={activityFeed} maxItems={12} />
        </motion.div>
      </div>
    </div>
  );
}
