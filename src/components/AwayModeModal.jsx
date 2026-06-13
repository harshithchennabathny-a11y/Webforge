import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, RotateCcw, DoorOpen, Clock, X } from 'lucide-react';
import { useApp } from '../store/useAppStore';

const AWAY_DURATION_SECONDS = 20 * 60; // 20 minutes real; set to 120 for fast demo

export default function AwayModeModal() {
  const { state, returnDesk, releaseDesk, abandonDesk, closeAwayModal } = useApp();
  const { open, deskId } = state.awayModal;
  const [secondsLeft, setSecondsLeft] = useState(AWAY_DURATION_SECONDS);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSecondsLeft(AWAY_DURATION_SECONDS);
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            abandonDesk(deskId);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [open, deskId]);

  if (!open) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((AWAY_DURATION_SECONDS - secondsLeft) / AWAY_DURATION_SECONDS) * 100;
  const isUrgent = secondsLeft <= 120; // last 2 minutes

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}
      >
        <motion.div
          key="modal-card"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{
            background: 'white', borderRadius: 24,
            padding: 40, width: '100%', maxWidth: 420,
            boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
            textAlign: 'center', position: 'relative',
          }}
        >
          {/* Close */}
          <button
            onClick={closeAwayModal}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: '#F1F5F9', border: 'none', borderRadius: 10,
              padding: 8, cursor: 'pointer',
            }}
          >
            <X size={16} color="#64748B" />
          </button>

          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: isUrgent
                ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                : 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: isUrgent
                ? '0 12px 32px rgba(239,68,68,0.4)'
                : '0 12px 32px rgba(245,158,11,0.4)',
            }}
          >
            <Coffee size={32} color="white" />
          </motion.div>

          {/* Title */}
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
            Away Mode Active
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 6 }}>
            Desk <strong>{deskId}</strong> is on hold for you
          </p>
          {isUrgent && (
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{
                background: '#FEE2E2', color: '#991B1B',
                borderRadius: 10, padding: '8px 16px',
                fontSize: 13, fontWeight: 600, marginBottom: 16,
              }}
            >
              ⚠️ Hurry back! Seat will be released soon.
            </motion.div>
          )}

          {/* Countdown */}
          <div style={{
            background: isUrgent ? '#FFF1F2' : '#FFF7ED',
            border: `2px solid ${isUrgent ? '#FECACA' : '#FDE68A'}`,
            borderRadius: 20, padding: '20px 24px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Time Remaining
            </div>
            <motion.div
              key={Math.floor(secondsLeft / 10)}
              animate={{ scale: [1.05, 1] }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em',
                color: isUrgent ? '#EF4444' : '#F59E0B',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
              20-minute hold period
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 28 }}>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                  background: isUrgent
                    ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                    : 'linear-gradient(90deg, #F59E0B, #D97706)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 6, fontSize: 11, color: '#94A3B8',
            }}>
              <span>0:00</span>
              <span style={{ color: isUrgent ? '#EF4444' : '#F59E0B', fontWeight: 600 }}>
                {Math.round(progress)}% elapsed
              </span>
              <span>20:00</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15 }}
              onClick={() => returnDesk(deskId)}
            >
              <RotateCcw size={18} /> I'm Back!
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn-danger"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={() => releaseDesk(deskId)}
            >
              <DoorOpen size={16} /> Release Seat
            </motion.button>
          </div>

          <p style={{ fontSize: 11, color: '#CBD5E1', marginTop: 16 }}>
            Seat auto-releases when timer reaches 0:00
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
