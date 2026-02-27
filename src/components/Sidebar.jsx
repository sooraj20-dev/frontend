// ═══════════════════════════════════════════════════════
// SIDEBAR — Professional, clean, fully theme-aware
// ═══════════════════════════════════════════════════════
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserRound, Building2, Calendar,
    FileText, CreditCard, Stethoscope, HeartPulse,
    LogOut, ChevronLeft, ChevronRight, Activity, X,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../store/index.js';
import { getInitials, getAvatarGradient } from '../utils/index.js';

/* ── Nav config ───────────────────────────────────────── */
const NAV = {
    admin: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { label: 'Users', icon: Users, path: '/admin/users' },
        { label: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
        { label: 'Patients', icon: UserRound, path: '/admin/patients' },
        { label: 'Departments', icon: Building2, path: '/admin/departments' },
        { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
        { label: 'Bills', icon: CreditCard, path: '/admin/bills' },
    ],
    doctor: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/doctor' },
        { label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
        { label: 'My Patients', icon: UserRound, path: '/doctor/patients' },
        { label: 'Prescriptions', icon: FileText, path: '/doctor/prescriptions' },
        { label: 'Earnings', icon: CreditCard, path: '/doctor/earnings' },
    ],
    patient: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/patient' },
        { label: 'Book Appointment', icon: Calendar, path: '/patient/book' },
        { label: 'Appointments', icon: Activity, path: '/patient/appointments' },
        { label: 'Prescriptions', icon: FileText, path: '/patient/prescriptions' },
        { label: 'Bills', icon: CreditCard, path: '/patient/bills' },
    ],
};

const ROLE_META = {
    admin: { label: 'Administrator', color: '#8b5cf6', bg: 'rgba(139,92,246,.12)', border: 'rgba(139,92,246,.25)' },
    doctor: { label: 'Physician', color: '#3b82f6', bg: 'rgba(59,130,246,.12)', border: 'rgba(59,130,246,.25)' },
    patient: { label: 'Patient', color: '#14b8a6', bg: 'rgba(20,184,166,.12)', border: 'rgba(20,184,166,.25)' },
};

/* ── Sidebar widths ───────────────────────────────────── */
const EXPANDED_W = 240;
const COLLAPSED_W = 68;

export default function Sidebar({ mobile = false, onCloseMobile }) {
    const { user, logout } = useAuthStore();
    const { sidebarCollapsed, toggleSidebar } = useUIStore();
    const location = useLocation();

    const nav = NAV[user?.role] || [];
    const role = ROLE_META[user?.role] || ROLE_META.admin;
    const collapsed = mobile ? false : sidebarCollapsed;
    const w = collapsed ? COLLAPSED_W : EXPANDED_W;

    const isActive = (path) =>
        path.endsWith('/admin') || path.endsWith('/doctor') || path.endsWith('/patient')
            ? location.pathname === path
            : location.pathname.startsWith(path);

    return (
        <motion.aside
            initial={false}
            animate={{ width: w }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            style={{
                height: '100%',
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                zIndex: 30,
            }}
        >
            {/* ── Logo ── */}
            <div style={{
                padding: collapsed ? '0' : '0 20px',
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: 12,
                flexShrink: 0,
            }}>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(37,99,235,.2)',
                    flexShrink: 0,
                }}>
                    <HeartPulse size={18} color="#fff" strokeWidth={2.5} />
                </div>

                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-display font-bold text-lg text-slate-900 tracking-tight"
                        style={{ flex: 1 }}
                    >
                        MediCare<span className="text-blue-600">Pro</span>
                    </motion.div>
                )}

                {mobile && (
                    <button
                        onClick={onCloseMobile}
                        style={{
                            marginLeft: 'auto',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-3)',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* ── User Profile (Collapsed/Expanded) ── */}
            <div style={{ padding: collapsed ? '10px 0' : '0 16px 20px', display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'stretch' }}>
                {!collapsed && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '8px',
                            background: getAvatarGradient(user?.name),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 13, fontWeight: 700
                        }}>
                            {getInitials(user?.name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="text-[13px] font-bold text-slate-900 truncate">{user?.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{role.label}</div>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div style={{
                        width: 36, height: 36, borderRadius: '8px',
                        background: getAvatarGradient(user?.name),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 13, fontWeight: 700,
                        marginBottom: '10px'
                    }}>
                        {getInitials(user?.name)}
                    </div>
                )}
            </div>

            {/* ── Navigation ── */}
            <nav style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
            }}>
                {!collapsed && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-3 mb-2">Main Menu</div>}

                {nav.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={mobile ? onCloseMobile : undefined}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: collapsed ? '10px 0' : '10px 14px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontSize: '13.5px',
                                fontWeight: active ? 600 : 500,
                                color: active ? '#2563eb' : 'var(--text-2)',
                                background: active ? 'rgba(37,99,235,0.06)' : 'transparent',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                position: 'relative'
                            }}
                        >
                            <item.icon
                                size={18}
                                strokeWidth={active ? 2.5 : 2}
                                style={{ flexShrink: 0 }}
                            />
                            {!collapsed && <span>{item.label}</span>}
                            {active && !collapsed && (
                                <motion.div
                                    layoutId="sidebar-active-pill"
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: '#2563eb'
                                    }}
                                />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* ── Footer ── */}
            <div style={{
                padding: '20px 12px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: collapsed ? '10px 0' : '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Sign Out</span>}
                </button>

                {!mobile && (
                    <button
                        onClick={toggleSidebar}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: 32,
                            background: 'var(--bg-app)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-3)',
                            cursor: 'pointer'
                        }}
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                )}
            </div>
        </motion.aside>
    );
}
