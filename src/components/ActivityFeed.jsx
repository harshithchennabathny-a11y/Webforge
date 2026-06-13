import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Coffee, DoorOpen, AlertTriangle, RotateCcw } from 'lucide-react';

const ACTION_CONFIG = {
  'check-in':  { icon: <LogIn size={13} />,      bg: '#DCFCE7', color: '#15803D', dot: '#22C55E'  },
  'away':      { icon: <Coffee size={13} />,      bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B'  },
  'release':   { icon: <DoorOpen size={13} />,    bg: '#EFF6FF', color: '#1D4ED8', dot: '#2563EB'  },
  'abandoned': { icon: <AlertTriangle size={13}/>, bg: '#F3F4F6', color: '#374151', dot: '#6B7280'  },
  'reset':     { icon: <RotateCcw size={13} />,   bg: '#F0FDF4', color: '#15803D', dot: '#22C55E'  },
};

export default function ActivityFeed({ events, maxItems = 15, compact = false }) {
  const items = events.slice(0, maxItems);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <AnimatePresence initial={false}>
        {items.map((event, i) => {
          const cfg = ACTION_CONFIG[event.icon] ?? ACTION_CONFIG['check-in'];
          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3, delay: i < 3 ? i * 0.05 : 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: compact ? 8 : 10,
                padding: compact ? '7px 10px' : '10px 14px',
                borderRadius: 12,
                background: i === 0 ? cfg.bg : 'transparent',
                border: i === 0 ? `1px solid ${cfg.dot}33` : '1px solid transparent',
                transition: 'background 0.3s',
              }}
            >
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{
                  width: compact ? 28 : 32, height: compact ? 28 : 32, borderRadius: '50%',
                  background: cfg.bg, border: `1.5px solid ${cfg.dot}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cfg.color, flexShrink: 0,
                }}>
                  {cfg.icon}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: compact ? 12 : 13, fontWeight: 600, color: '#0F172A',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{
                    background: '#F1F5F9', color: '#475569',
                    padding: '1px 6px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                  }}>
                    {event.desk}
                  </span>
                  <span style={{ color: cfg.color }}>{event.action}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {event.student}
                </div>
              </div>

              {/* Time */}
              <div style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {event.time}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: 13 }}>
          No activity yet
        </div>
      )}
    </div>
  );
}
