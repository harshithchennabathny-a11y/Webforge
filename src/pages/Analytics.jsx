import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Brain, Cpu, Zap, Target, Globe } from 'lucide-react';
import {
  OCCUPANCY_CHART_DATA, PEAK_HOURS_DATA,
  ZONE_UTILIZATION, DAILY_CHECKINS, SESSION_DURATION_DIST, SUMMARY_STATS
} from '../data/mockData';

const CustomTooltip = ({ active, payload, label, suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '10px 14px', fontSize: 12,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    }}>
      <div style={{ color: '#94A3B8', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'white', fontWeight: 600 }}>{p.value}{suffix}</span>
          <span style={{ color: '#64748B' }}>{p.dataKey}</span>
        </div>
      ))}
    </div>
  );
};

const ChartCard = ({ title, subtitle, delay, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="card"
    style={{ padding: 24 }}
  >
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 12, color: '#94A3B8' }}>{subtitle}</p>}
    </div>
    {children}
  </motion.div>
);

const AI_FEATURES = [
  {
    icon: Brain, color: '#8B5CF6', bg: '#F5F3FF',
    title: 'Occupancy Prediction',
    desc: 'ML model forecasts peak periods 2 hours ahead with 94% accuracy. Proactively alerts librarians to prepare.',
    status: 'Coming Q3 2025',
  },
  {
    icon: Globe, color: '#0891B2', bg: '#ECFEFF',
    title: 'Crowd Forecasting',
    desc: 'Predicts zone congestion using historical patterns, exam schedules, and campus event calendars.',
    status: 'Coming Q3 2025',
  },
  {
    icon: Target, color: '#059669', bg: '#ECFDF5',
    title: 'Smart Seat Recommendations',
    desc: 'Personalized seating suggestions based on past preferences, study habits, and current noise levels.',
    status: 'In Beta',
  },
  {
    icon: Zap, color: '#D97706', bg: '#FFFBEB',
    title: 'Capacity Optimization',
    desc: 'Recommends opening additional study areas or temporary zones during high-demand periods.',
    status: 'Coming Q4 2025',
  },
  {
    icon: Cpu, color: '#2563EB', bg: '#EFF6FF',
    title: 'Digital Twin Intelligence',
    desc: 'Full real-time campus analytics — footfall heatmaps, pathway optimization, environmental sensors.',
    status: 'Roadmap',
  },
];

export default function Analytics() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 80 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A, #2563EB, #4F46E5)',
        padding: '32px 24px 28px',
      }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BarChart3 size={24} color="rgba(255,255,255,0.8)" />
            <div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
                Analytics Dashboard
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                Occupancy trends, peak hours, and zone intelligence
              </p>
            </div>
          </div>

          {/* Top Stats */}
          <div className="grid-4col" style={{ marginTop: 24 }}>
            {[
              { label: 'Sessions Today', value: SUMMARY_STATS.sessionsToday, suffix: '' },
              { label: 'Peak Occupancy', value: SUMMARY_STATS.peakOccupancyToday, suffix: '%' },
              { label: 'Avg Session',    value: SUMMARY_STATS.avgSessionMinutes, suffix: ' min' },
              { label: 'Peak Hour',      value: SUMMARY_STATS.peakHourToday, raw: true },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 14, padding: '14px 18px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
                  {s.raw ? s.value : `${s.value}${s.suffix}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid-2col" style={{ marginBottom: 20 }}>

          {/* Occupancy Trend */}
          <ChartCard
            title="Occupancy Trend"
            subtitle="Weekly view by day — % of desks occupied"
            delay={0.1}
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={OCCUPANCY_CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
                <Tooltip content={<CustomTooltip suffix="%" />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Mon" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Tue" stroke="#4F46E5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Wed" stroke="#0891B2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Thu" stroke="#7C3AED" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Fri" stroke="#059669" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Peak Usage Hours */}
          <ChartCard
            title="Peak Usage Hours"
            subtitle="Today's hourly occupancy and session count"
            delay={0.15}
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={PEAK_HOURS_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="occupancy" stroke="#2563EB" strokeWidth={2} fill="url(#gradOcc)" name="Occupancy %" />
                <Area type="monotone" dataKey="sessions"  stroke="#22C55E" strokeWidth={2} fill="url(#gradSes)"  name="Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Zone Utilization */}
          <ChartCard
            title="Zone Utilization"
            subtitle="Average occupancy rate per zone"
            delay={0.2}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ZONE_UTILIZATION} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
                <Tooltip content={<CustomTooltip suffix="%" />} />
                <Bar dataKey="utilization" name="Utilization %" radius={[6, 6, 0, 0]}>
                  {ZONE_UTILIZATION.map((entry, i) => (
                    <rect
                      key={i}
                      fill={entry.utilization > 85 ? '#EF4444' : entry.utilization > 65 ? '#F59E0B' : '#22C55E'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Color legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
              {[
                { color: '#22C55E', label: 'Low (<65%)' },
                { color: '#F59E0B', label: 'Medium (65–85%)' },
                { color: '#EF4444', label: 'High (>85%)' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ fontSize: 11, color: '#64748B' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Daily Check-Ins */}
          <ChartCard
            title="Daily Check-Ins"
            subtitle="Check-ins vs releases vs abandoned — last 7 days"
            delay={0.25}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DAILY_CHECKINS} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="checkIns"  name="Check-Ins"  fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="releases"  name="Releases"   fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="abandoned" name="Abandoned"  fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Session Duration Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: 24, marginBottom: 20 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
            Session Duration Distribution
          </h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 20 }}>How long do students typically stay?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: 12 }}>
            {SESSION_DURATION_DIST.map((d, i) => {
              const max = Math.max(...SESSION_DURATION_DIST.map(x => x.count));
              const pct = (d.count / max) * 100;
              return (
                <div key={d.range} style={{ textAlign: 'center' }}>
                  <div style={{ height: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 8 }}>
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                      style={{
                        width: 36, borderRadius: '6px 6px 0 0',
                        background: `linear-gradient(180deg, #2563EB, #4F46E5)`,
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{d.count}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{d.range}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Session</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#2563EB' }}>1hr 42min</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Common</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>1–2 hrs</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sessions Today</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#22C55E' }}>{SUMMARY_STATS.sessionsToday}</div>
            </div>
          </div>
        </motion.div>

        {/* Future AI */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            🚀 Roadmap
          </span>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', marginTop: 6, letterSpacing: '-0.02em' }}>
            Future AI Capabilities
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', maxWidth: 480, margin: '8px auto 0' }}>
            SeatSync is evolving into a full campus intelligence platform powered by machine learning.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 40 }}>
          {AI_FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
              className="card"
              style={{ padding: 24, position: 'relative', overflow: 'hidden' }}
            >
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: f.bg, color: f.color,
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                border: `1px solid ${f.color}33`,
              }}>
                {f.status}
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <f.icon size={24} color={f.color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
