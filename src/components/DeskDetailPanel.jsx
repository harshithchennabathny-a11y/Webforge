import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Clock, MapPin, Zap, Monitor, Wifi, Battery,
  Eye, CheckCircle, LogIn, Coffee, DoorOpen, RotateCcw
} from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { ZONES } from '../data/mockData';

const STATUS_CONFIG = {
  available:  { color: '#22C55E', bg: '#DCFCE7', label: 'Available'  },
  occupied:   { color: '#EF4444', bg: '#FEE2E2', label: 'Occupied'   },
  away:       { color: '#F59E0B', bg: '#FEF3C7', label: 'Away'       },
  abandoned:  { color: '#6B7280', bg: '#F3F4F6', label: 'Abandoned'  },
};

const FEATURE_ICONS = {
  'Charging':        <Battery size={13} className="text-yellow-500" />,
  'Dual Monitor':    <Monitor size={13} className="text-blue-500" />,
  'High-Speed WiFi': <Wifi size={13} className="text-cyan-500" />,
  'Window':          <Eye size={13} className="text-sky-500" />,
  'Ergonomic':       <CheckCircle size={13} className="text-green-500" />,
  'Lamp':            <span style={{ fontSize: 13 }}>💡</span>,
  'Whiteboard':      <span style={{ fontSize: 13 }}>📋</span>,
  'Projector':       <span style={{ fontSize: 13 }}>📽</span>,
};

function formatTime(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function sessionDuration(checkIn) {
  if (!checkIn) return '—';
  const diff = Math.floor((Date.now() - new Date(checkIn)) / 60000);
  if (diff < 60) return `${diff} min`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
}

export default function DeskDetailPanel({ desk, onClose }) {
  const { checkIn, markAway, releaseDesk, resetDesk, getStudent, state } = useApp();
  const panelRef = useRef(null);

  const cfg     = STATUS_CONFIG[desk?.status] ?? STATUS_CONFIG.available;
  const student = desk?.student ? getStudent(desk.student) : null;
  const zone    = ZONES.find(z => z.id === desk?.zone);
  const isMyDesk = desk?.id === state.myDeskId;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (!desk) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(15,23,42,0.25)', backdropFilter: 'blur(2px)' }}
      />

      <motion.div
        ref={panelRef}
        key="panel"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
        style={{ width: 380, background: 'white', boxShadow: '-12px 0 48px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
          padding: '28px 24px 24px',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} color="rgba(255,255,255,0.7)" />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500 }}>
                  {zone?.name} — {zone?.label}
                </span>
              </div>
              <h2 style={{ color: 'white', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
                Desk {desk.id}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: 10, padding: 8, cursor: 'pointer',
              }}
            >
              <X size={18} color="white" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', backgroundColor: cfg.color,
              boxShadow: `0 0 0 2px ${cfg.color}33`,
            }} />
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{cfg.label}</span>
          </div>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Student Info */}
          {student ? (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 16,
                }}>
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{student.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{student.rollNo} · {student.dept}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>Year {student.year}</div>
                </div>
                {isMyDesk && (
                  <span style={{
                    marginLeft: 'auto', background: '#EFF6FF', color: '#2563EB',
                    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                  }}>YOU</span>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 16, textAlign: 'center', color: '#64748B' }}>
              <User size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
              <div style={{ fontWeight: 600, fontSize: 14 }}>No occupant</div>
              <div style={{ fontSize: 12, marginTop: 2 }}>Desk is available for check-in</div>
            </div>
          )}

          {/* Session Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Clock size={13} color="#64748B" />
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Check-In</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>
                {formatTime(desk.checkIn)}
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Zap size={13} color="#64748B" />
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Session</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>
                {sessionDuration(desk.checkIn)}
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Features
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {desk.features?.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: 8, padding: '5px 10px',
                  fontSize: 12, fontWeight: 500, color: '#374151',
                }}>
                  {FEATURE_ICONS[f] ?? null}
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Zone Info */}
          <div className="card" style={{ padding: 14, background: '#F8FAFC' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Zone Info
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{zone?.name} — {zone?.label}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{zone?.description}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Floor {zone?.floorLevel}</div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Actions
            </div>

            {desk.status === 'available' && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={() => { checkIn(desk.id, state.currentStudent.id); onClose(); }}
              >
                <LogIn size={16} /> Check In to Desk {desk.id}
              </motion.button>
            )}

            {(desk.status === 'occupied' && isMyDesk) && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-amber"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onClick={() => { markAway(desk.id); onClose(); }}
                >
                  <Coffee size={16} /> Mark Away (20 min)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-danger"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onClick={() => { releaseDesk(desk.id); onClose(); }}
                >
                  <DoorOpen size={16} /> Release Seat
                </motion.button>
              </>
            )}

            {(desk.status === 'abandoned' || desk.status === 'away') && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: 'white', border: 'none', borderRadius: 12,
                  padding: '12px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                }}
                onClick={() => { resetDesk(desk.id); onClose(); }}
              >
                <RotateCcw size={16} /> Reset to Available
              </motion.button>
            )}

            {desk.status === 'occupied' && !isMyDesk && (
              <div style={{
                padding: 12, borderRadius: 12, background: '#FEF3C7',
                border: '1px solid #FDE68A', color: '#92400E', fontSize: 13,
              }}>
                ⚠️ This desk is occupied by another student.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
