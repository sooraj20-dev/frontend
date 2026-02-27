// ═══════════════════════════════════════════════════════
// ANIMATED BUTTON — Theme-aware, framer motion
// ═══════════════════════════════════════════════════════
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const VARIANT_CLASSES = {
    primary: 'btn-primary',
    teal: 'btn-teal',
    success: 'btn-success',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    outline: 'btn-ghost',
    secondary: 'btn-ghost',
};
const SIZE_CLASSES = {
    xs: 'btn-sm',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    icon: 'btn-icon',
};

const AnimatedButton = forwardRef(({
    children, variant = 'primary', size = 'md',
    icon: Icon, iconRight = false, loading = false,
    fullWidth = false, className = '', style = {},
    onClick, disabled, type = 'button', title,
}, ref) => {
    return (
        <motion.button
            ref={ref}
            type={type}
            title={title}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: .96 } : {}}
            className={[
                'btn',
                VARIANT_CLASSES[variant] || 'btn-primary',
                SIZE_CLASSES[size] || 'btn-md',
                fullWidth ? 'btn-full' : '',
                className,
            ].join(' ')}
            style={{ opacity: (disabled || loading) ? .55 : 1, cursor: (disabled || loading) ? 'not-allowed' : 'pointer', ...style }}
        >
            {loading ? (
                <>
                    <motion.span
                        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .9, ease: 'linear' }}
                        style={{ display: 'inline-flex', width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'rgba(255,255,255,.9)', borderRadius: '50%', flexShrink: 0 }}
                    />
                    <span>Loading…</span>
                </>
            ) : (
                <>
                    {Icon && !iconRight && <Icon size={14} style={{ flexShrink: 0 }} />}
                    {children && <span>{children}</span>}
                    {Icon && iconRight && <Icon size={14} style={{ flexShrink: 0 }} />}
                </>
            )}
        </motion.button>
    );
});
AnimatedButton.displayName = 'AnimatedButton';
export default AnimatedButton;
