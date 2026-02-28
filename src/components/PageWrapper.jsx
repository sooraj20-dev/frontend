// ═══════════════════════════════════════════════════════
// PAGE WRAPPER — consistent page shell, 8px grid, animated
// ═══════════════════════════════════════════════════════
import { motion } from 'framer-motion';

export default function PageWrapper({ title, subtitle, actions, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: .28, ease: [.4, 0, .2, 1] }}
            className="page-shell"
        >
            {/* Page header */}
            {(title || actions) && (
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 16,
                    marginBottom: 28,
                    flexWrap: 'wrap',
                }}>
                    {title && (
                        <div style={{ paddingLeft: 14, borderLeft: '3px solid var(--color-primary)', borderRadius: '0 2px 2px 0' }}>
                            <h1 className="page-title">{title}</h1>
                            {subtitle && <p className="page-subtitle">{subtitle}</p>}
                        </div>
                    )}
                    {actions && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            {actions}
                        </div>
                    )}
                </div>
            )}

            {/* Page content — 24px gap (3 × 8px grid) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {children}
            </div>
        </motion.div>
    );
}
