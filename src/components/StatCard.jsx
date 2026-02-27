// ═══════════════════════════════════════════════════════
// STAT CARD — animated counter, theme-aware
// ═══════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
    blue: { orb: '#3b82f6', text: '#60a5fa', grad: 'linear-gradient(135deg,#2563eb,#3b82f6)', light: 'rgba(59,130,246,.1)' },
    teal: { orb: '#14b8a6', text: '#2dd4bf', grad: 'linear-gradient(135deg,#0d9488,#14b8a6)', light: 'rgba(20,184,166,.1)' },
    purple: { orb: '#8b5cf6', text: '#a78bfa', grad: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', light: 'rgba(139,92,246,.1)' },
    green: { orb: '#22c55e', text: '#4ade80', grad: 'linear-gradient(135deg,#16a34a,#22c55e)', light: 'rgba(34,197,94,.1)' },
    orange: { orb: '#f59e0b', text: '#fbbf24', grad: 'linear-gradient(135deg,#d97706,#f59e0b)', light: 'rgba(245,158,11,.1)' },
    red: { orb: '#ef4444', text: '#f87171', grad: 'linear-gradient(135deg,#dc2626,#ef4444)', light: 'rgba(239,68,68,.1)' },
};

function useCounter(target, duration = 1200) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * ease));
            if (p < 1) ref.current = requestAnimationFrame(tick);
        };
        ref.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(ref.current);
    }, [target]);
    return val;
}

export default function StatCard({ title, value = 0, icon: Icon, color = 'blue', trend, trendLabel, prefix = '', delay = 0 }) {
    const c = COLOR_MAP[color] || COLOR_MAP.blue;
    const displayVal = useCounter(typeof value === 'number' ? Math.round(value) : 0, 1000);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: delay * 0.08, duration: .35, ease: [.4, 0, .2, 1] }}
            className="stat-card card-hover"
        >
            {/* Background orb */}
            <div className="stat-card__orb" style={{ background: c.orb }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-3)', marginBottom: 10 }}>
                        {title}
                    </p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif', lineHeight: 1 }}>
                        {prefix}{displayVal.toLocaleString()}
                    </p>
                    {trend !== undefined && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10,
                            padding: '2px 8px', borderRadius: 8, fontSize: 11.5, fontWeight: 700,
                            background: trend >= 0 ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)',
                            color: trend >= 0 ? '#22c55e' : '#ef4444',
                        }}>
                            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {trend >= 0 ? '+' : ''}{trend}%
                            {trendLabel && <span style={{ fontWeight: 400, opacity: .75 }}>{' '}{trendLabel}</span>}
                        </div>
                    )}
                </div>
                <div style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: c.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${c.orb}25`,
                }}>
                    {Icon && <Icon size={20} style={{ color: c.text }} />}
                </div>
            </div>
        </motion.div>
    );
}
