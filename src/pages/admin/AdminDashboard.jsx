// ═══════════════════════════════════════════════════════
// ADMIN DASHBOARD — Professional, theme-aware
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Calendar, DollarSign, AlertCircle, Plus, ArrowRight, Clock } from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import PageWrapper from '../../components/PageWrapper.jsx';
import StatCard from '../../components/StatCard.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AnimatedButton from '../../components/AnimatedButton.jsx';
import { SkeletonStatCard } from '../../components/Skeleton.jsx';
import { getAllDoctors } from '../../services/doctorService.js';
import { getAllPatients } from '../../services/patientService.js';
import { getAllAppointments } from '../../services/appointmentService.js';
import { getTotalRevenue } from '../../services/billService.js';
import { appointmentsPerMonth, departmentDistribution, doctorPerformance } from '../../mock/database.js';
import { formatCurrency, formatDate, formatTime } from '../../utils/index.js';

/* ── Recharts tooltip ───────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
            borderRadius: 12, padding: '10px 14px', boxShadow: 'var(--shadow-lg)',
            fontSize: 12, color: 'var(--text-2)',
        }}>
            <p style={{ marginBottom: 6, fontWeight: 600, color: 'var(--text-1)' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, fontWeight: 600 }}>
                    {p.name}: {p.name === 'revenue' ? formatCurrency(p.value) : p.value}
                </p>
            ))}
        </div>
    );
};

const ACTIVITY = [
    { icon: '📅', text: 'New appointment booked for Dr. Wilson', time: '2 min ago', color: '#3b82f6' },
    { icon: '💊', text: 'Prescription added for Patient #1024', time: '8 min ago', color: '#14b8a6' },
    { icon: '💰', text: 'Bill #B-2045 paid — $280.00', time: '22 min ago', color: '#22c55e' },
    { icon: '👤', text: 'New patient registered: Oliver Walsh', time: '45 min ago', color: '#8b5cf6' },
    { icon: '⚠️', text: 'Appointment #A-1067 cancelled', time: '1 hr ago', color: '#f59e0b' },
];

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, revenue: 0 });
    const [recentAppts, setRecent] = useState([]);

    useEffect(() => {
        const load = async () => {
            const [docs, pats, appts, rev] = await Promise.all([
                getAllDoctors(), getAllPatients(), getAllAppointments(), getTotalRevenue(),
            ]);
            setStats({ doctors: docs.length, patients: pats.length, appointments: appts.length, revenue: rev.totalPaid });
            setRecent(appts.slice(-5).reverse());
            setLoading(false);
        };
        load();
    }, []);

    return (
        <PageWrapper
            title="Admin Dashboard"
            subtitle="Welcome back, Sarah. Here's what's happening today."
            actions={<AnimatedButton icon={Plus} size="sm">Quick Action</AnimatedButton>}
        >

            {/* ── Emergency banner ─────────────────────────── */}
            <div
                style={{
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    borderRadius: 12, padding: '12px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                }}
            >
                <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#fee2e2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <AlertCircle size={16} color="#ef4444" />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#991b1b', margin: 0 }}>Emergency Hotline Active</p>
                    <p style={{ fontSize: 12, color: '#b91c1c', margin: 0, marginTop: 1, opacity: 0.8 }}>3 emergency cases in queue • ICU Bed 4 available</p>
                </div>
                <button className="btn btn-danger btn-sm">View Emergency</button>
            </div>

            {/* ── Stat Cards ───────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {loading ? (
                    [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
                ) : (<>
                    <StatCard title="Total Doctors" value={stats.doctors} icon={Stethoscope} color="blue" trend={8} trendLabel="vs last month" delay={0} />
                    <StatCard title="Total Patients" value={stats.patients} icon={Users} color="teal" trend={12} trendLabel="new this month" delay={1} />
                    <StatCard title="Appointments" value={stats.appointments} icon={Calendar} color="purple" trend={-3} trendLabel="vs last week" delay={2} />
                    <StatCard title="Revenue" value={stats.revenue} icon={DollarSign} color="green" trend={18} trendLabel="this month" prefix="$" delay={3} />
                </>)}
            </div>

            {/* ── Charts ───────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 16 }}>

                {/* Area chart */}
                <AnimatedCard hover={false}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                        <div>
                            <h3 className="section-title">Appointments &amp; Revenue</h3>
                            <p className="label" style={{ marginTop: 3 }}>Last 7 months overview</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[{ label: 'Appointments', color: '#3b82f6' }, { label: 'Revenue', color: '#22c55e' }].map(l => (
                                <span key={l.label} style={{
                                    fontSize: 11.5, padding: '3px 10px', borderRadius: 99, fontWeight: 600, lineHeight: 1.8,
                                    background: `${l.color}15`, color: l.color, border: `1px solid ${l.color}30`,
                                }}>{l.label}</span>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={appointmentsPerMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gAppt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" tick={{ fill: 'var(--text-3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTip />} />
                            <Area yAxisId="left" type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gAppt)" />
                            <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fill="url(#gRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </AnimatedCard>

                {/* Pie chart */}
                <AnimatedCard hover={false}>
                    <h3 className="section-title">Department Breakdown</h3>
                    <p className="label" style={{ marginTop: 3, marginBottom: 16 }}>Appointments by dept</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={departmentDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                                {departmentDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip
                                formatter={(v) => [`${v}%`, '']}
                                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 12 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        {departmentDistribution.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                                    <span style={{ color: 'var(--text-2)' }}>{d.name}</span>
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            </div>

            {/* ── Bottom row ───────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)', gap: 16 }}>

                {/* Recent appointments */}
                <AnimatedCard hover={false} padding="p-0">
                    <div style={{
                        padding: '18px 22px 14px', borderBottom: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div>
                            <h3 className="section-title">Recent Appointments</h3>
                            <p className="label" style={{ marginTop: 2 }}>Latest 5 entries</p>
                        </div>
                        <AnimatedButton variant="ghost" size="xs" icon={ArrowRight} iconRight>View all</AnimatedButton>
                    </div>
                    <div>
                        {recentAppts.map((appt, idx) => (
                            <motion.div
                                key={appt.id}
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 22px',
                                    borderBottom: idx < recentAppts.length - 1 ? '1px solid var(--border)' : 'none',
                                    transition: 'background .12s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    width: 34, height: 34, borderRadius: 10,
                                    background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Calendar size={14} color="#60a5fa" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-1)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {appt.patient?.user?.name}
                                    </p>
                                    <p style={{ fontSize: 11.5, color: 'var(--text-3)', margin: 0, marginTop: 2 }}>
                                        {appt.doctor?.user?.name} • {formatDate(appt.appointment_date, { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                    <span style={{ fontSize: 11.5, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Clock size={10} /> {formatTime(appt.appointment_time)}
                                    </span>
                                    <StatusBadge status={appt.status} size="sm" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedCard>

                {/* Activity + Doctor performance */}
                <AnimatedCard hover={false}>
                    <h3 className="section-title">Live Activity</h3>
                    <p className="label" style={{ marginTop: 2, marginBottom: 16 }}>Real-time updates</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {ACTIVITY.map((a, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 10, fontSize: 14,
                                    background: `${a.color}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    {a.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 12, color: 'var(--text-2)', margin: 0, lineHeight: 1.5 }}>{a.text}</p>
                                    <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0, marginTop: 2 }}>{a.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                        <h4 className="section-title" style={{ marginBottom: 12 }}>Doctor Performance</h4>
                        <ResponsiveContainer width="100%" height={90}>
                            <BarChart data={doctorPerformance} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                                <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 11 }}
                                />
                                <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </AnimatedCard>
            </div>

        </PageWrapper>
    );
}
