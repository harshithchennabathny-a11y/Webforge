import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Map as MapIcon, Layers } from 'lucide-react';
import { useApp } from '../store/useAppStore';
import { ZONES, SEAT_RECOMMENDATIONS } from '../data/mockData';
import DeskTile from '../components/DeskTile';
import DeskDetailPanel from '../components/DeskDetailPanel';
import ActivityFeed from '../components/ActivityFeed';

const ZONE_HEATMAP_COLORS = (pct) => {
  if (pct >= 85) return { bg: '#FEE2E2', bar: '#EF4444', text: '#991B1B' };
  if (pct >= 60) return { bg: '#FEF3C7', bar: '#F59E0B', text: '#92400E' };
  return { bg: '#DCFCE7', bar: '#22C55E', text: '#15803D' };
};

export default function LibraryMap() {
  const { state, checkIn, setHighlighted } = useApp();
  const { desks, activityFeed, highlightedDesks } = state;
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeView, setActiveView] = useState('map'); // 'map' | 'heatmap'

  const getZoneDesks = (zoneId) =>
    desks.filter(d => d.zone === zoneId && (filterStatus === 'all' || d.status === filterStatus));

  const getZoneStats = (zoneId) => {
    const zd = desks.filter(d => d.zone === zoneId);
    const occ = zd.filter(d => d.status === 'occupied' || d.status === 'away').length;
    return { total: zd.length, occupied: occ, pct: Math.round((occ / zd.length) * 100) };
  };

  const handleFindBest = () => {
    const ids = SEAT_RECOMMENDATIONS.map(r => r.deskId);
    setHighlighted(ids);
    setShowRecommendations(true);
  };

  const STATUS_FILTERS = [
    { value: 'all',       label: 'All',       color: '#2563EB' },
    { value: 'available', label: 'Available',  color: '#22C55E' },
    { value: 'occupied',  label: 'Occupied',   color: '#EF4444' },
    { value: 'away',      label: 'Away',       color: '#F59E0B' },
    { value: 'abandoned', label: 'Abandoned',  color: '#6B7280' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 64 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        padding: '28px 24px',
        position: 'sticky', top: 64, zIndex: 30,
      }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(37,99,235,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapIcon size={18} color="#60A5FA" />
              </div>
              <div>
                <h1 style={{ color: 'white', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
                  Live Library Map
                </h1>
                <div style={{ color: '#94A3B8', fontSize: 12 }}>
                  {desks.filter(d => d.status === 'available').length} seats available
                  · {desks.filter(d => d.status === 'occupied').length} occupied
                  · {desks.filter(d => d.status === 'abandoned').length} abandoned
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {/* View toggle */}
              <div style={{
                display: 'flex', background: 'rgba(255,255,255,0.08)',
                borderRadius: 10, padding: 3,
              }}>
                {['map', 'heatmap'].map(v => (
                  <button key={v} onClick={() => setActiveView(v)} style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: activeView === v ? 'white' : 'transparent',
                    color: activeView === v ? '#0F172A' : '#94A3B8',
                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                  }}>
                    {v === 'map' ? <><MapIcon size={12} style={{ display: 'inline', marginRight: 4 }} />Map</> : <><Layers size={12} style={{ display: 'inline', marginRight: 4 }} />Heatmap</>}
                  </button>
                ))}
              </div>

              {/* Find Best Seat */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleFindBest}
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: 'white', border: 'none', borderRadius: 10,
                  padding: '8px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
                }}
              >
                <Sparkles size={15} /> Find Best Seat
              </motion.button>
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {STATUS_FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilterStatus(f.value)} style={{
                padding: '4px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: filterStatus === f.value ? f.color : 'rgba(255,255,255,0.1)',
                color: filterStatus === f.value ? 'white' : '#94A3B8',
                fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid-map">

          {/* Main Map / Heatmap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {activeView === 'map' ? (
              ZONES.map((zone, zi) => {
                const zd = getZoneDesks(zone.id);
                const stats = getZoneStats(zone.id);
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: zi * 0.08 }}
                    className="card"
                    style={{ padding: 20 }}
                  >
                    {/* Zone header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%', background: zone.color,
                          boxShadow: `0 0 0 3px ${zone.color}33`,
                        }} />
                        <div>
                          <span style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>
                            {zone.name}
                          </span>
                          <span style={{ fontSize: 13, color: '#64748B', marginLeft: 8 }}>
                            {zone.label}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: '#94A3B8' }}>
                          {desks.filter(d => d.zone === zone.id && d.status === 'available').length} free
                        </span>
                        <div style={{
                          padding: '3px 10px', borderRadius: 8,
                          background: stats.pct > 80 ? '#FEE2E2' : stats.pct > 50 ? '#FEF3C7' : '#DCFCE7',
                          color: stats.pct > 80 ? '#991B1B' : stats.pct > 50 ? '#92400E' : '#15803D',
                          fontSize: 11, fontWeight: 700,
                        }}>
                          {stats.pct}% full
                        </div>
                      </div>
                    </div>

                    {/* Desks Grid */}
                    <div className="desk-grid-zone">
                      {zd.map(desk => (
                        <DeskTile
                          key={desk.id}
                          desk={desk}
                          isHighlighted={highlightedDesks.includes(desk.id)}
                          onSelect={setSelectedDesk}
                        />
                      ))}
                    </div>

                    {/* Zone features */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                      {zone.features.map(f => (
                        <span key={f} style={{
                          fontSize: 10, fontWeight: 600, color: '#64748B',
                          background: '#F8FAFC', border: '1px solid #E2E8F0',
                          borderRadius: 6, padding: '2px 8px',
                        }}>{f}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              // Heatmap View
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>
                  Zone Popularity Heatmap
                </div>
                {ZONES.map((zone, zi) => {
                  const stats = getZoneStats(zone.id);
                  const colors = ZONE_HEATMAP_COLORS(stats.pct);
                  return (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: zi * 0.1 }}
                      className="card"
                      style={{ padding: 24 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A' }}>{zone.name}</div>
                          <div style={{ fontSize: 13, color: '#64748B' }}>{zone.label} · Floor {zone.floorLevel}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 36, fontWeight: 900, color: colors.text, letterSpacing: '-0.03em' }}>
                            {stats.pct}%
                          </div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{stats.occupied}/{stats.total} occupied</div>
                        </div>
                      </div>
                      <div style={{ height: 20, borderRadius: 10, background: '#F1F5F9', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.pct}%` }}
                          transition={{ duration: 1, delay: zi * 0.1 + 0.2, ease: 'easeOut' }}
                          style={{
                            height: '100%', borderRadius: 10,
                            background: `linear-gradient(90deg, ${colors.bar}, ${colors.bar}cc)`,
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#94A3B8' }}>
                        <span>0%</span>
                        <span style={{ color: colors.text, fontWeight: 600 }}>
                          {stats.pct < 45 ? '🟢 Low' : stats.pct < 80 ? '🟡 Medium' : '🔴 High'} Usage
                        </span>
                        <span>100%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Smart Recommendations */}
            <AnimatePresence>
              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="card"
                  style={{ padding: 20, border: '2px solid #FDE68A', background: '#FFFBEB' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={16} color="#F59E0B" />
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Smart Recommendations</span>
                    </div>
                    <button onClick={() => { setShowRecommendations(false); setHighlighted([]); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                      <X size={14} />
                    </button>
                  </div>
                  {SEAT_RECOMMENDATIONS.map((r, i) => (
                    <motion.div
                      key={r.deskId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        const desk = desks.find(d => d.id === r.deskId);
                        if (desk) setSelectedDesk(desk);
                      }}
                      style={{
                        padding: '10px 12px', borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                        background: i === 0 ? 'white' : '#FFFDF0',
                        border: `1px solid ${i === 0 ? '#FDE68A' : '#FEF3C7'}`,
                        boxShadow: i === 0 ? '0 2px 8px rgba(245,158,11,0.15)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 800 }}>#{r.rank}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>Desk {r.deskId}</span>
                        <span style={{
                          marginLeft: 'auto', background: '#F59E0B', color: 'white',
                          fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                        }}>Score {r.score}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#92400E', marginBottom: 4 }}>{r.zone}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {r.reasons.map(reason => (
                          <span key={reason} style={{
                            fontSize: 10, color: '#78350F', background: '#FEF3C7',
                            padding: '1px 6px', borderRadius: 4,
                          }}>{reason}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legend */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Status Legend
              </div>
              {[
                { color: '#22C55E', label: 'Available',  count: desks.filter(d => d.status === 'available').length },
                { color: '#EF4444', label: 'Occupied',   count: desks.filter(d => d.status === 'occupied').length },
                { color: '#F59E0B', label: 'Away',       count: desks.filter(d => d.status === 'away').length },
                { color: '#6B7280', label: 'Abandoned',  count: desks.filter(d => d.status === 'abandoned').length },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: s.color }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>{s.label}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{s.count}</span>
                </div>
              ))}
            </div>

            {/* Zone Quick Stats */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Zone Occupancy
              </div>
              {ZONES.map(zone => {
                const s = getZoneStats(zone.id);
                return (
                  <div key={zone.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{zone.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: '#F1F5F9' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 1 }}
                        style={{
                          height: '100%', borderRadius: 99,
                          background: s.pct > 80 ? '#EF4444' : s.pct > 50 ? '#F59E0B' : '#22C55E',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Activity */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Activity
              </div>
              <ActivityFeed events={activityFeed} maxItems={8} compact />
            </div>
          </div>
        </div>
      </div>

      {/* Desk Detail Panel */}
      <AnimatePresence>
        {selectedDesk && (
          <DeskDetailPanel desk={selectedDesk} onClose={() => setSelectedDesk(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
