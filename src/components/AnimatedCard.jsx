// ═══════════════════════════════════════════════════════
// ANIMATED CARD — theme-aware wrapper
// ═══════════════════════════════════════════════════════
import { motion } from 'framer-motion';

export default function AnimatedCard({
    children, hover = true, padding = 'p-5',
    className = '', style = {}, onClick,
}) {
    const paddingVal = padding === 'p-0' ? 0 : padding === 'p-5' ? 20 : 24;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .3, ease: [.4, 0, .2, 1] }}
            onClick={onClick}
            className={['card', hover ? 'card-hover' : '', className].join(' ')}
            style={{ padding: paddingVal, ...style, cursor: onClick ? 'pointer' : undefined }}
        >
            {children}
        </motion.div>
    );
}
