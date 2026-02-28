// ═══════════════════════════════════════════════════════
// NAVBAR — Theme toggle, notifications, profile
// ═══════════════════════════════════════════════════════
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Menu, ChevronDown, LogOut, Settings, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store/index.js';
import { getInitials, getAvatarGradient } from '../utils/index.js';

const NOTIF_ICON = { success: CheckCircle, info: Bell, warning: AlertTriangle };
const NOTIF_COLOR = { success: 'var(--color-success)', info: 'var(--color-primary)', warning: 'var(--color-warning)' };

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme, notifications, markAllRead } = useUIStore();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [search, setSearch] = useState('');
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const navBtnStyle = {
        width: 36, height: 36, borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer',
        color: 'var(--text-2)', flexShrink: 0,
        transition: 'all 0.15s ease',
    };

    return (
        <header className="app-navbar" role="banner">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                aria-label="Open navigation menu"
                style={{ ...navBtnStyle, display: 'none' }}
                className="show-sm"
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-light)'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary-mid)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
                <Menu size={17} />
            </button>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
                <Search
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
                    size={14}
                />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search patients, doctors, records..."
                    aria-label="Global search"
                    style={{
                        width: '100%', paddingLeft: 38, paddingRight: 14, height: 36,
                        background: 'var(--bg-panel)', border: '1px solid var(--border)',
                        borderRadius: 8, fontSize: 13, color: 'var(--text-1)',
                        fontFamily: 'inherit', outline: 'none', transition: 'all .18s',
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = 'var(--color-primary)';
                        e.target.style.background = 'var(--bg-card)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(30,90,168,0.1)';
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.background = 'var(--bg-panel)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    style={navBtnStyle}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-light)'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary-mid)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={theme}
                            initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.7, opacity: 0, rotate: 20 }}
                            transition={{ duration: .18 }}
                        >
                            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                        </motion.div>
                    </AnimatePresence>
                </button>

                {/* Notifications */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        onClick={() => { setNotifOpen(p => !p); markAllRead?.(); }}
                        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                        style={{ ...navBtnStyle, position: 'relative' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-light)'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary-mid)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                        <Bell size={15} />
                        {unreadCount > 0 && (
                            <span
                                aria-hidden="true"
                                style={{
                                    position: 'absolute', top: -3, right: -3,
                                    width: 17, height: 17, borderRadius: '50%',
                                    background: 'var(--color-error)', fontSize: 9, fontWeight: 800, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid var(--bg-app)',
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: .97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: .97 }}
                                transition={{ duration: .15 }}
                                role="dialog"
                                aria-label="Notifications panel"
                                style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 340,
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
                                    borderRadius: 12, boxShadow: 'var(--shadow-lg)',
                                    zIndex: 90, overflow: 'hidden',
                                }}
                            >
                                <div style={{
                                    padding: '14px 18px', borderBottom: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Notifications</span>
                                    {unreadCount > 0 && (
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                                            background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                                        }}>
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                                    {(notifications || []).slice(0, 5).map(n => (
                                        <div key={n.id} style={{
                                            padding: '12px 18px', borderBottom: '1px solid var(--border)',
                                            fontSize: 13, color: 'var(--text-2)', cursor: 'default',
                                            background: n.read ? 'transparent' : 'var(--color-primary-light)',
                                            display: 'flex', alignItems: 'flex-start', gap: 10,
                                            transition: 'background .12s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                                            onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'var(--color-primary-light)'}
                                        >
                                            <div style={{
                                                width: 7, height: 7, borderRadius: '50%',
                                                background: n.read ? 'var(--text-dim)' : 'var(--color-primary)',
                                                flexShrink: 0, marginTop: 5,
                                            }} aria-hidden="true" />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: 'var(--text-1)', lineHeight: 1.4 }}>{n.message}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                                                    <Clock size={10} />
                                                    {n.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!notifications || notifications.length === 0) && (
                                        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                                            <Bell size={28} style={{ margin: '0 auto 12px', opacity: .3, display: 'block' }} />
                                            No notifications yet
                                        </div>
                                    )}
                                </div>
                                <button style={{
                                    width: '100%', padding: '11px', background: 'var(--bg-panel)',
                                    border: 'none', borderTop: '1px solid var(--border)',
                                    fontSize: 12, fontWeight: 600, color: 'var(--color-primary)',
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background .12s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                                >
                                    View all activity
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile dropdown */}
                <div style={{ position: 'relative' }} ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(p => !p)}
                        aria-label="Open profile menu"
                        aria-expanded={profileOpen}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 8, padding: '4px 10px 4px 5px', cursor: 'pointer',
                            height: 36, transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-panel)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                    >
                        <div style={{
                            width: 26, height: 26, fontSize: 10, borderRadius: 6,
                            background: getAvatarGradient(user?.name), color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                            flexShrink: 0,
                        }}>
                            {getInitials(user?.name)}
                        </div>
                        <span className="hide-sm" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
                            {user?.name?.split(' ')[0]}
                        </span>
                        <ChevronDown size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                    </button>

                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: .96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: .96 }}
                                transition={{ duration: .15 }}
                                role="menu"
                                style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 208,
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
                                    borderRadius: 12, boxShadow: 'var(--shadow-lg)', zIndex: 90, overflow: 'hidden',
                                }}
                            >
                                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{user?.name}</div>
                                    <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{user?.email}</div>
                                </div>
                                {[
                                    { icon: Settings, label: 'Profile Settings', action: () => { } },
                                    { icon: LogOut, label: 'Sign Out', action: logout, danger: true },
                                ].map(item => (
                                    <button
                                        key={item.label}
                                        role="menuitem"
                                        onClick={() => { item.action(); setProfileOpen(false); }}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                                            padding: '10px 14px', background: 'none', border: 'none',
                                            color: item.danger ? 'var(--color-error)' : 'var(--text-2)', cursor: 'pointer',
                                            fontSize: 13, fontFamily: 'inherit', textAlign: 'left', transition: 'background .12s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'var(--color-error-light)' : 'var(--bg-panel)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <item.icon size={14} strokeWidth={2} />
                                        {item.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
