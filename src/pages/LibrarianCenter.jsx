import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, AlertTriangle, RotateCcw, Activity,
  CheckCircle, Coffee, Users, Download, RefreshCw,
  Zap, Bell
} from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { ZONES } from '../data/mockData';
import ActivityFeed from '../components/ActivityFeed';
import DeskTile from '../components/DeskTile';

export default function LibrarianCenter() {
  const { state, resetDesk, resetAllAbandoned } = useApp();
  const { desks, stats, activityFeed } = state;
  const [activeZone, setActiveZone] = useState('all');
  const [notification, setNotification] = useState(null);

  const abandonedDesks = desks.filter(d => d.status === 'abandoned');

  const handleResetAll = () => {
    resetAllAbandoned();
    setNotification({ type: 'success', msg: `${abandonedDesks.length} abandoned desks reset to Available.` });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReset = (deskId) => {
    resetDesk(deskId);
    setNotification({ type: 'success', msg: `Desk ${deskId} is now available.` });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      stats: state.stats,
      desks: desks.map(d => ({ id: d.id, zone: d.zone, status: d.status })),
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `seatsync-snapshot-${Date.now()}.json`; a.click();
    setNotification({ type: 'info', msg: 'Snapshot exported!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredDesks = activeZone === 'all' ? desks : desks.filter(d => d.zone === activeZone);

  const KPI = [
    { label: 'Total Desks',  value: stats.totalDesks,       color: '#2563EB', bg: '#EFF6FF', icon: Users },
    { label: 'Occupancy',    value: `${stats.occupancyPercent}%`, color: '#4F46E5', bg: '#EEF2FF', icon: Activity },
    { label: 'Available',    value: stats.available,         color: '#22C55E', bg: '#DCFCE7', icon: CheckCircle },
    { label: 'Away',         value: stats.away,              color: '#F59E0B', bg: '#FEF3C7', icon: Coffee },
    { label: 'Abandoned',    value: stats.abandoned,         color: '#EF4444', bg: '#FEE2E2', icon: AlertTriangle },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0B1120', paddingTop: 64 }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 80, left: '50%',
              zIndex: 300,
              background: notification.type === 'success' ? '#22C55E' : '#2563EB',
              color: 'white', padding: '10px 24px', borderRadius: 12,
              fontSize: 13, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1120 0%, #1E293B 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 24px',
      }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Shield size={22} color="#60A5FA" />
              </div>
              <div>
                <h1 style={{ color: 'white', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
                  Librarian Command Center
                </h1>
                <div style={{ color: '#64748B', fontSize: 12 }}>Real-time operations · Central Campus Library</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 10,
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              }}>
                <div style={{ position: 'relative', width: 8, height: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', position: 'absolute' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', position: 'absolute', animation: 'ping 1.5s ease-out infinite', opacity: 0.5 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#22C55E' }}>Live Monitoring</span>
              </div>
              {abandonedDesks.length > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                }}>
                  <Bell size={13} color="#F87171" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#F87171' }}>
                    {abandonedDesks.length} Alert{abandonedDesks.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* KPI Row */}
        <div className="grid-5col" style={{ marginBottom: 24 }}>
          {KPI.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: k.bg + '22', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <k.icon size={15} color={k.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {k.label}
                </span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
                {k.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid-map" style={{ gap: 20 }}>

          {/* Left: Map + Abandoned Alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Live Map */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Live Occupancy Map</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setActiveZone('all')}
                    style={{
                      padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: activeZone === 'all' ? '#2563EB' : 'rgba(255,255,255,0.08)',
                      color: activeZone === 'all' ? 'white' : '#94A3B8',
                      fontSize: 11, fontWeight: 600,
                    }}
                  >All</button>
                  {ZONES.map(z => (
                    <button key={z.id} onClick={() => setActiveZone(z.id)} style={{
                      padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: activeZone === z.id ? '#2563EB' : 'rgba(255,255,255,0.08)',
                      color: activeZone === z.id ? 'white' : '#94A3B8',
                      fontSize: 11, fontWeight: 600,
                    }}>{z.name}</button>
                  ))}
                </div>
              </div>

              {ZONES.filter(z => activeZone === 'all' || z.id === activeZone).map(zone => (
                <div key={zone.id} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
                    {zone.name} — {zone.label}
                  </div>
                  <div className="desk-grid-zone">
                    {desks.filter(d => d.zone === zone.id).map(desk => (
                      <DeskTile
                        key={desk.id}
                        desk={desk}
                        isHighlighted={desk.status === 'abandoned'}
                        onSelect={(d) => {
                          if (d.status === 'abandoned') handleReset(d.id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                {[
                  { color: '#22C55E', label: 'Available' },
                  { color: '#EF4444', label: 'Occupied' },
                  { color: '#F59E0B', label: 'Away' },
                  { color: '#6B7280', label: 'Abandoned' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                    <span style={{ fontSize: 11, color: '#64748B' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Abandoned Alerts */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 20, padding: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={18} color="#F87171" />
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                    Abandoned Desk Alerts
                  </h3>
                  {abandonedDesks.length > 0 && (
                    <span style={{
                      background: '#EF4444', color: 'white',
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                    }}>
                      {abandonedDesks.length}
                    </span>
                  )}
                </div>
                {abandonedDesks.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleResetAll}
                    style={{
                      background: 'rgba(239,68,68,0.15)', color: '#F87171',
                      border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10,
                      padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <RefreshCw size={13} /> Reset All
                  </motion.button>
                )}
              </div>

              {abandonedDesks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <CheckCircle size={32} color="#22C55E" style={{ margin: '0 auto 8px' }} />
                  <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 14 }}>All clear!</div>
                  <div style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>No abandoned desks at this time</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {abandonedDesks.map((desk, i) => {
                    const awayMin = desk.awayStart
                      ? Math.floor((Date.now() - new Date(desk.awayStart)) / 60000)
                      : '?';
                    return (
                      <motion.div
                        key={desk.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 16px', borderRadius: 12,
                          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, background: '#6B7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 800, fontSize: 13,
                          }}>
                            {desk.id}
                          </div>
                          <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{desk.id}</div>
                            <div style={{ color: '#94A3B8', fontSize: 12 }}>
                              {ZONES.find(z => z.id === desk.zone)?.label} · Abandoned {awayMin} min ago
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleReset(desk.id)}
                          style={{
                            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                            color: 'white', border: 'none', borderRadius: 10,
                            padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 5,
                            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                          }}
                        >
                          <RotateCcw size={13} /> Reset
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick Actions */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: 20,
            }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
                Quick Actions
              </h3>
              {[
                {
                  icon: RefreshCw, label: 'Reset All Abandoned',
                  color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)',
                  onClick: handleResetAll,
                },
                {
                  icon: Download, label: 'Export Snapshot',
                  color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)',
                  onClick: handleExport,
                },
                {
                  icon: Zap, label: 'Force Refresh Map',
                  color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)',
                  onClick: () => setNotification({ type: 'info', msg: 'Map refreshed!' }) || setTimeout(() => setNotification(null), 2000),
                },
              ].map(action => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={action.onClick}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                    background: action.bg, border: `1px solid ${action.border}`,
                    cursor: 'pointer',
                  }}
                >
                  <action.icon size={16} color={action.color} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{action.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Zone Health */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: 20,
            }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
                Zone Health
              </h3>
              {ZONES.map(zone => {
                const zd = desks.filter(d => d.zone === zone.id);
                const pct = Math.round((zd.filter(d => d.status === 'occupied' || d.status === 'away').length / zd.length) * 100);
                const abandoned = zd.filter(d => d.status === 'abandoned').length;
                return (
                  <div key={zone.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div>
                        <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>{zone.name}</span>
                        {abandoned > 0 && (
                          <span style={{
                            marginLeft: 8, background: '#EF4444', color: 'white',
                            fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                          }}>{abandoned} abandoned</span>
                        )}
                      </div>
                      <span style={{ color: '#94A3B8', fontSize: 12 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1 }}
                        style={{
                          height: '100%', borderRadius: 99,
                          background: pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#22C55E',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activity Feed */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: 20, flex: 1,
            }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
                Live Activity
              </h3>
              <div style={{ '--feed-bg': 'transparent' }}>
                <ActivityFeed events={activityFeed} maxItems={12} compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
