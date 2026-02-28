// ═══════════════════════════════════════════════════════
// FORM INPUT — theme-aware, icon support, error state
//              WCAG AA focus ring, proper error messaging
// ═══════════════════════════════════════════════════════
import { forwardRef, useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const FormInput = forwardRef(({
    label, placeholder, type = 'text', error, hint,
    icon: Icon, required, style, className, ...props
}, ref) => {
    const [showPwd, setShowPwd] = useState(false);
    const uid = useId();
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;
    const errorId = `${uid}-error`;
    const hintId = `${uid}-hint`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }} className={className}>
            {label && (
                <label
                    htmlFor={uid}
                    style={{
                        fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)',
                        userSelect: 'none', textTransform: 'uppercase', letterSpacing: '.05em',
                    }}
                >
                    {label}
                    {required && <span style={{ color: 'var(--color-error)', marginLeft: 3 }} aria-hidden="true">*</span>}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                {Icon && (
                    <div style={{
                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                        color: error ? 'var(--color-error)' : 'var(--text-3)',
                        pointerEvents: 'none', display: 'flex', transition: 'color .15s',
                    }}>
                        <Icon size={14} aria-hidden="true" />
                    </div>
                )}
                <input
                    id={uid}
                    ref={ref}
                    type={inputType}
                    placeholder={placeholder}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined}
                    aria-required={required}
                    {...props}
                    style={{
                        width: '100%',
                        paddingLeft: Icon ? 38 : 14,
                        paddingRight: isPassword ? 40 : (error ? 38 : 14),
                        height: 40,
                        background: 'var(--bg-input)',
                        border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-strong)'}`,
                        borderRadius: 8,
                        fontSize: 13.5,
                        color: 'var(--text-1)',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'all .15s',
                        boxShadow: error ? '0 0 0 3px var(--color-error-light)' : 'none',
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-primary)';
                        e.target.style.boxShadow = error
                            ? '0 0 0 3px var(--color-error-light)'
                            : '0 0 0 3px rgba(30,90,168,0.12)';
                        e.target.style.background = 'var(--bg-input-focus)';
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--border-strong)';
                        e.target.style.boxShadow = error ? '0 0 0 3px var(--color-error-light)' : 'none';
                        e.target.style.background = 'var(--bg-input)';
                    }}
                />
                {isPassword && (
                    <button
                        type="button"
                        aria-label={showPwd ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPwd(p => !p)}
                        style={{
                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-3)', display: 'flex', padding: 0,
                            transition: 'color .15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                    >
                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                )}
                {!isPassword && error && (
                    <div style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--color-error)', display: 'flex', pointerEvents: 'none',
                    }}>
                        <AlertCircle size={14} aria-hidden="true" />
                    </div>
                )}
            </div>
            {error && (
                <p id={errorId} role="alert" style={{ fontSize: 11.5, color: 'var(--color-error)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={11} aria-hidden="true" />
                    {error}
                </p>
            )}
            {hint && !error && (
                <p id={hintId} style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 1 }}>{hint}</p>
            )}
        </div>
    );
});
FormInput.displayName = 'FormInput';
export default FormInput;
