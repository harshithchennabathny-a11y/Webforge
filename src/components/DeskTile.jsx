import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, Wifi, Battery, Monitor, Eye, CheckCircle } from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { ZONES } from '../data/mockData';

const STATUS_CONFIG = {
  available:  { color: '#22C55E', bg: '#DCFCE7', label: 'Available',  ring: '#86EFAC' },
  occupied:   { color: '#EF4444', bg: '#FEE2E2', label: 'Occupied',   ring: '#FCA5A5' },
  away:       { color: '#F59E0B', bg: '#FEF3C7', label: 'Away',       ring: '#FCD34D' },
  abandoned:  { color: '#6B7280', bg: '#F3F4F6', label: 'Abandoned',  ring: '#D1D5DB' },
};

const FEATURE_ICONS = {
  'Charging':        <Battery size={11} />,
  'Dual Monitor':    <Monitor size={11} />,
  'High-Speed WiFi': <Wifi size={11} />,
  'Window':          <Eye size={11} />,
  'Ergonomic':       <CheckCircle size={11} />,
  'Lamp':            <span style={{ fontSize: 10 }}>💡</span>,
  'Whiteboard':      <span style={{ fontSize: 10 }}>📋</span>,
  'Projector':       <span style={{ fontSize: 10 }}>📽</span>,
};

export default function DeskTile({ desk, isHighlighted, onSelect }) {
  const { getStudent } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const tileRef = useRef(null);
  const cfg = STATUS_CONFIG[desk.status] ?? STATUS_CONFIG.available;
  const student = desk.student ? getStudent(desk.student) : null;
  const zone = ZONES.find(z => z.id === desk.zone);

  const sessionDuration = (checkIn) => {
    if (!checkIn) return null;
    const diff = Math.floor((Date.now() - new Date(checkIn)) / 60000);
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const handleMouseMove = (e) => {
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <motion.div
      ref={tileRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelect(desk)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
      className="relative cursor-pointer select-none"
      style={{
        aspectRatio: '1',
        borderRadius: 10,
        backgroundColor: cfg.color,
        border: isHighlighted
          ? '2.5px solid #2563EB'
          : `2px solid ${cfg.ring}`,
        boxShadow: isHighlighted
          ? '0 0 0 3px rgba(37,99,235,0.3), 0 4px 12px rgba(0,0,0,0.15)'
          : desk.status === 'away'
          ? `0 0 0 2px ${cfg.ring}, 0 2px 8px rgba(0,0,0,0.1)`
          : '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: 52,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Pulse for away */}
      {desk.status === 'away' && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute', inset: -3,
            borderRadius: 12,
            border: '2px solid #F59E0B',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Abandoned badge */}
      {desk.status === 'abandoned' && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute', top: -5, right: -5,
            width: 14, height: 14,
            borderRadius: '50%',
            background: '#EF4444',
            border: '2px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>!</span>
        </motion.div>
      )}

      {/* Highlight star */}
      {isHighlighted && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: -6, left: -6,
            fontSize: 12, filter: 'drop-shadow(0 0 4px gold)',
          }}
        >⭐</motion.div>
      )}

      {/* Desk ID */}
      <span style={{
        fontSize: 11, fontWeight: 700, color: 'white',
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
        letterSpacing: '0.02em',
      }}>
        {desk.id}
      </span>

      {/* Student icon if occupied/away */}
      {(desk.status === 'occupied' || desk.status === 'away') && (
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User size={8} color="white" />
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0F172A',
              color: 'white',
              padding: '8px 12px',
              borderRadius: 10,
              fontSize: 11,
              whiteSpace: 'nowrap',
              zIndex: 999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 3 }}>{desk.id} · {zone?.label}</div>
            <div style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</div>
            {student && (
              <div style={{ color: '#94A3B8', marginTop: 2 }}>
                <User size={9} style={{ display: 'inline', marginRight: 3 }} />
                {student.name}
              </div>
            )}
            {desk.checkIn && (
              <div style={{ color: '#64748B', marginTop: 1 }}>
                <Clock size={9} style={{ display: 'inline', marginRight: 3 }} />
                {sessionDuration(desk.checkIn)}
              </div>
            )}
            {desk.features?.slice(0, 2).map(f => (
              <span key={f} style={{
                display: 'inline-block', marginTop: 3, marginRight: 4,
                background: 'rgba(255,255,255,0.1)', borderRadius: 4,
                padding: '1px 5px', fontSize: 10,
              }}>{f}</span>
            ))}
            {/* Tooltip arrow */}
            <div style={{
              position: 'absolute', top: '100%', left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #0F172A',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
