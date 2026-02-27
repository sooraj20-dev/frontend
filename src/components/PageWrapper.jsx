// ═══════════════════════════════════════════════════════
// PAGE WRAPPER — consistent page shell
// ═══════════════════════════════════════════════════════
import { motion } from 'framer-motion';

export default function PageWrapper({ title, subtitle, actions, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: .28, ease: [.4, 0, .2, 1] }}
            className="page-shell"
        >
            {/* Page header */}
            {(title || actions) && (
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {title && (
                        <div>
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
            {/* Page content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {children}
            </div>
        </motion.div>
    );
}
