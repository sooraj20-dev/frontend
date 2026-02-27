// ═══════════════════════════════════════════════════════
// NAVBAR — Theme toggle, notifications, profile
// ═══════════════════════════════════════════════════════
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Menu, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store/index.js';
import { getInitials, getAvatarGradient } from '../utils/index.js';

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme, notifications, markAllRead } = useUIStore();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [search, setSearch] = useState('');
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="app-navbar">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                style={{
                    background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer',
                    padding: 8, borderRadius: 10, display: 'none', flexShrink: 0
                }}
                className="show-sm"
            >
                <Menu size={18} />
            </button>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: 460, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', flexShrink: 0 }} size={14} />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search anything..."
                    style={{
                        width: '100%', paddingLeft: 38, paddingRight: 14, height: 38,
                        background: '#f1f5f9', border: '1px solid #e2e8f0',
                        borderRadius: 10, fontSize: 13, color: 'var(--text-1)',
                        fontFamily: 'inherit', outline: 'none', transition: 'all .2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f1f5f9'; e.target.style.boxShadow = 'none'; }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0',
                        background: '#fff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)', flexShrink: 0,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={theme} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: .15 }}>
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </motion.div>
                    </AnimatePresence>
                </button>

                {/* Notifications */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        onClick={() => { setNotifOpen(p => !p); markAllRead?.(); }}
                        style={{
                            width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0',
                            background: '#fff', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)', position: 'relative', flexShrink: 0,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                        <Bell size={16} />
                        {unreadCount > 0 && (
                            <span
                                style={{
                                    position: 'absolute', top: -4, right: -4,
                                    width: 18, height: 18, borderRadius: '50%',
                                    background: '#ef4444', fontSize: 10, fontWeight: 700, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid #fff',
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: .98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: .98 }}
                                transition={{ duration: .15 }}
                                style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320,
                                    background: '#fff', border: '1px solid #e2e8f0',
                                    borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                    zIndex: 90, overflow: 'hidden',
                                }}
                            >
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                                    Notifications
                                </div>
                                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                                    {(notifications || []).slice(0, 5).map(n => (
                                        <div key={n.id} style={{
                                            padding: '12px 20px', borderBottom: '1px solid #f8fafc',
                                            fontSize: 13, color: '#475569', cursor: 'default',
                                            background: n.read ? 'transparent' : 'rgba(37,99,235,0.02)',
                                        }}>
                                            <div style={{ color: '#1e293b' }}>{n.message}</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{n.time}</div>
                                        </div>
                                    ))}
                                    {(!notifications || notifications.length === 0) && (
                                        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications</div>
                                    )}
                                </div>
                                <button style={{ width: '100%', padding: '12px', background: '#f8fafc', border: 'none', borderTop: '1px solid #f1f5f9', fontSize: 12, fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>
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
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: '#fff', border: '1px solid #e2e8f0',
                            borderRadius: 10, padding: '4px 10px 4px 5px', cursor: 'pointer',
                            height: 36, transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.border = '1px solid #cbd5e1'}
                        onMouseLeave={e => e.currentTarget.style.border = '1px solid #e2e8f0'}
                    >
                        <div style={{ width: 26, height: 26, fontSize: 10, borderRadius: 6, background: getAvatarGradient(user?.name), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {getInitials(user?.name)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }} className="hide-sm">
                            {user?.name?.split(' ')[0]}
                        </span>
                        <ChevronDown size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    </button>

                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: .96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: .96 }}
                                transition={{ duration: .15 }}
                                style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 200,
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
                                    borderRadius: 14, boxShadow: 'var(--shadow-lg)', zIndex: 90, overflow: 'hidden',
                                }}
                            >
                                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{user?.name}</div>
                                    <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 1 }}>{user?.email}</div>
                                </div>
                                {[
                                    { icon: Settings, label: 'Profile Settings', action: () => { } },
                                    { icon: LogOut, label: 'Sign Out', action: logout, danger: true },
                                ].map(item => (
                                    <button
                                        key={item.label}
                                        onClick={() => { item.action(); setProfileOpen(false); }}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                                            padding: '10px 14px', background: 'none', border: 'none',
                                            color: item.danger ? '#ef4444' : 'var(--text-2)', cursor: 'pointer',
                                            fontSize: 13, fontFamily: 'inherit', textAlign: 'left', transition: 'background .12s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <item.icon size={14} />
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
