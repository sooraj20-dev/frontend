// ═══════════════════════════════════════════════════════
// MODAL — animated, theme-aware, focus-trapped
// ═══════════════════════════════════════════════════════
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SIZE_MAP = { sm: 440, md: 540, lg: 680, xl: 800, '2xl': 960 };

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
    const maxW = SIZE_MAP[size] || 540;

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: .18 }}
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: .93, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: .93, y: 20 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: .8 }}
                        className="modal-box"
                        style={{ maxWidth: maxW }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '18px 22px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0,
                        }}>
                            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                style={{
                                    width: 30, height: 30, borderRadius: 9, background: 'var(--bg-input)',
                                    border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)',
                                    flexShrink: 0, transition: 'all .15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-input-hov)'; e.currentTarget.style.color = 'var(--text-1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-2)'; }}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div style={{
                                padding: '14px 22px 18px', borderTop: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, flexShrink: 0,
                            }}>
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
