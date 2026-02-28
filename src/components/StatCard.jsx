// ═══════════════════════════════════════════════════════
// STAT CARD — animated counter, enterprise KPI style
// ═══════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
    blue: {
        orb: '#1E5AA8', textLight: '#1E5AA8', iconClass: 'kpi-icon-blue',
        trend: { pos: 'rgba(46,173,103,.12)', neg: 'rgba(214,69,69,.1)' },
    },
    teal: {
        orb: '#1FA79A', textLight: '#1FA79A', iconClass: 'kpi-icon-teal',
        trend: { pos: 'rgba(46,173,103,.12)', neg: 'rgba(214,69,69,.1)' },
    },
    purple: {
        orb: '#7C3AED', textLight: '#6D28D9', iconClass: 'kpi-icon-purple',
        trend: { pos: 'rgba(46,173,103,.12)', neg: 'rgba(214,69,69,.1)' },
    },
    green: {
        orb: '#2EAD67', textLight: '#2EAD67', iconClass: 'kpi-icon-green',
        trend: { pos: 'rgba(46,173,103,.12)', neg: 'rgba(214,69,69,.1)' },
    },
    orange: {
        orb: '#F4A300', textLight: '#D97706', iconClass: 'kpi-icon-orange',
        trend: { pos: 'rgba(46,173,103,.12)', neg: 'rgba(214,69,69,.1)' },
    },
    red: {
        orb: '#D64545', textLight: '#D64545', iconClass: 'kpi-icon-red',
        trend: { pos: 'rgba(46,173,103,.12)', neg: 'rgba(214,69,69,.1)' },
    },
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
    const positiveTrend = typeof trend === 'number' && trend >= 0;

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
                    <p style={{
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '.08em', color: 'var(--text-3)', marginBottom: 12,
                    }}>
                        {title}
                    </p>
                    <p className="kpi-value">
                        {prefix}{displayVal.toLocaleString()}
                    </p>
                    {trend !== undefined && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12,
                            padding: '3px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 700,
                            background: positiveTrend ? 'var(--color-success-light)' : 'var(--color-error-light)',
                            color: positiveTrend ? 'var(--color-success)' : 'var(--color-error)',
                        }}>
                            {positiveTrend
                                ? <TrendingUp size={11} aria-hidden="true" />
                                : <TrendingDown size={11} aria-hidden="true" />
                            }
                            <span aria-label={`${positiveTrend ? 'up' : 'down'} ${Math.abs(trend)} percent`}>
                                {positiveTrend ? '+' : ''}{trend}%
                            </span>
                            {trendLabel && (
                                <span style={{ fontWeight: 400, opacity: .8 }}>{' '}{trendLabel}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className={c.iconClass} style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {Icon && <Icon size={20} strokeWidth={2} aria-hidden="true" />}
                </div>
            </div>
        </motion.div>
    );
}
