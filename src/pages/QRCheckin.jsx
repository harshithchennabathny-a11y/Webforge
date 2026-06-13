import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, CheckCircle, ArrowRight, User,
  Clock, MapPin, Scan, Zap
} from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { QR_SCAN_TARGETS } from '../data/mockData';

const STEPS = ['scan', 'confirm', 'success'];

export default function QRCheckin() {
  const { state, checkIn } = useApp();
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [scanning, setScanning] = useState(false);
  const [target, setTarget]   = useState(QR_SCAN_TARGETS[0]);
  const [selectedTarget, setSelectedTarget] = useState(0);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setStep(1);
    }, 2000);
  };

  const handleStart = () => {
    checkIn(target.deskId, state.currentStudent.id);
    setStep(2);
    setTimeout(() => navigate('/student'), 2500);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <div style={{
      minHeight: '100vh', background: '#F8FAFC',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', paddingTop: 80, padding: '80px 24px 40px',
    }}>
      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}
      >
        {['Scan QR', 'Confirm Desk', 'Success'].map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: i <= step
                  ? 'linear-gradient(135deg, #2563EB, #4F46E5)'
                  : '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: i <= step ? 'white' : '#94A3B8',
                fontSize: 13, fontWeight: 700,
                transition: 'all 0.3s',
              }}>
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: i <= step ? '#2563EB' : '#94A3B8' }}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div style={{
                width: 48, height: 2, borderRadius: 1,
                background: i < step ? '#2563EB' : '#E2E8F0',
                marginBottom: 18, transition: 'background 0.3s',
              }} />
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Card */}
      <AnimatePresence mode="wait">

        {/* Step 0: Scanner */}
        {step === 0 && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="card"
            style={{ padding: 40, maxWidth: 420, width: '100%', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              Scan QR Code
            </h2>
            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>
              Point your phone at the QR code on your desk to instantly check in
            </p>

            {/* Select QR Target */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Select Desk to Scan
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {QR_SCAN_TARGETS.map((t, i) => (
                  <button
                    key={t.deskId}
                    onClick={() => { setSelectedTarget(i); setTarget(t); }}
                    style={{
                      padding: '6px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: selectedTarget === i ? '#2563EB' : '#F1F5F9',
                      color: selectedTarget === i ? 'white' : '#64748B',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                    }}
                  >
                    {t.deskId}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Scanner Frame */}
            <div style={{ position: 'relative', marginBottom: 32 }}>
              <motion.div
                animate={scanning ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5, repeat: scanning ? Infinity : 0 }}
                style={{
                  width: 220, height: 220, margin: '0 auto',
                  borderRadius: 20, border: '3px solid',
                  borderColor: scanning ? '#22C55E' : '#E2E8F0',
                  background: scanning ? '#F0FDF4' : '#F8FAFC',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 12, position: 'relative', overflow: 'hidden',
                  transition: 'all 0.3s',
                }}
              >
                {/* Corner decorators */}
                {[['top-0 left-0', 'border-t-2 border-l-2'],
                  ['top-0 right-0', 'border-t-2 border-r-2'],
                  ['bottom-0 left-0', 'border-b-2 border-l-2'],
                  ['bottom-0 right-0', 'border-b-2 border-r-2'],
                ].map(([pos, border], i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 24, height: 24,
                    ...pos.split(' ').reduce((acc, p) => {
                      const [side, dir] = p.split('-');
                      return { ...acc, [side === 'top' ? 'top' : side === 'bottom' ? 'bottom' : side === 'left' ? 'left' : 'right']: 8 };
                    }, {}),
                    borderColor: scanning ? '#22C55E' : '#2563EB',
                    borderStyle: 'solid',
                    borderWidth: 0,
                    ...(pos.includes('top') ? { borderTopWidth: 3 } : { borderBottomWidth: 3 }),
                    ...(pos.includes('left') ? { borderLeftWidth: 3 } : { borderRightWidth: 3 }),
                    borderRadius: pos.includes('top-0 left-0') ? '4px 0 0 0'
                      : pos.includes('top-0 right-0') ? '0 4px 0 0'
                      : pos.includes('bottom-0 left-0') ? '0 0 0 4px' : '0 0 4px 0',
                  }} />
                ))}

                {scanning ? (
                  <>
                    {/* Scanning beam */}
                    <motion.div
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute', left: '5%', right: '5%',
                        height: 2, background: 'linear-gradient(90deg, transparent, #22C55E, transparent)',
                        boxShadow: '0 0 8px #22C55E',
                      }}
                    />
                    <Scan size={40} color="#22C55E" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#16A34A' }}>
                      Scanning...
                    </span>
                  </>
                ) : (
                  <>
                    <QrCode size={48} color="#CBD5E1" />
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>Awaiting scan</span>
                    <div style={{ fontSize: 11, color: '#CBD5E1', fontWeight: 600 }}>
                      Desk {target.deskId}
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={scanning}
              className="btn-primary"
              style={{ width: '100%', fontSize: 16, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={handleScan}
            >
              {scanning ? (
                <><Scan size={18} /> Scanning…</>
              ) : (
                <><QrCode size={18} /> Simulate Scan</>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Step 1: Confirm */}
        {step === 1 && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="card"
            style={{ padding: 40, maxWidth: 420, width: '100%', textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 12px 32px rgba(37,99,235,0.35)',
              }}
            >
              <Zap size={32} color="white" fill="white" />
            </motion.div>

            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              Desk Detected!
            </h2>
            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28 }}>
              Confirm the details below to start your session
            </p>

            {/* Desk Info Card */}
            <div style={{
              background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
              borderRadius: 16, padding: 24, marginBottom: 28, textAlign: 'left',
              border: '1px solid #DBEAFE',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#2563EB', letterSpacing: '-0.03em' }}>
                  {target.deskId}
                </div>
                <div style={{
                  background: '#DCFCE7', color: '#15803D',
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                  Available
                </div>
              </div>

              {[
                { icon: MapPin, label: 'Location', value: target.zone },
                { icon: User,   label: 'Student',  value: state.currentStudent.name },
                { icon: Clock,  label: 'Time',     value: currentTime },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={14} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.value}</div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {target.features.map(f => (
                  <span key={f} style={{
                    background: 'white', border: '1px solid #DBEAFE',
                    borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 500, color: '#1D4ED8',
                  }}>{f}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setStep(0)}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15 }}
                onClick={handleStart}
              >
                Start Session <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            className="card"
            style={{ padding: 56, maxWidth: 420, width: '100%', textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
              style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 16px 48px rgba(34,197,94,0.4)',
              }}
            >
              <CheckCircle size={48} color="white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                ✓ Successfully Checked In
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 8 }}>
                Desk {target.deskId} is yours!
              </h2>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
                Your session has started. Enjoy your study time, {state.currentStudent.name.split(' ')[0]}!
              </p>

              {/* Confetti-like decoration */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                {['🎉', '📚', '⚡', '🎯'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    style={{ fontSize: 24 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                Redirecting to your dashboard…
              </p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
