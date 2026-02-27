// ═══════════════════════════════════════════════════════
// FORM INPUT — theme-aware, icon support, error state
// ═══════════════════════════════════════════════════════
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = forwardRef(({
    label, placeholder, type = 'text', error, hint,
    icon: Icon, required, style, className, ...props
}, ref) => {
    const [showPwd, setShowPwd] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }} className={className}>
            {label && (
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)', userSelect: 'none' }}>
                    {label}
                    {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                {Icon && (
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none', display: 'flex' }}>
                        <Icon size={14} />
                    </div>
                )}
                <input
                    ref={ref}
                    type={inputType}
                    placeholder={placeholder}
                    {...props}
                    style={{
                        width: '100%', paddingLeft: Icon ? 38 : 14,
                        paddingRight: isPassword ? 40 : 14,
                        height: 40, background: 'var(--bg-input)',
                        border: `1px solid ${error ? '#ef4444' : 'var(--border-strong)'}`,
                        borderRadius: 11, fontSize: 13.5, color: 'var(--text-1)',
                        fontFamily: 'inherit', outline: 'none', transition: 'all .15s',
                        boxShadow: error ? '0 0 0 3px rgba(239,68,68,.1)' : 'none',
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = error ? '#ef4444' : 'rgba(59,130,246,.6)';
                        e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,.12)' : '0 0 0 3px rgba(59,130,246,.12)';
                        e.target.style.background = 'var(--bg-input-hov)';
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = error ? '#ef4444' : 'var(--border-strong)';
                        e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,.1)' : 'none';
                        e.target.style.background = 'var(--bg-input)';
                    }}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPwd(p => !p)}
                        style={{
                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 0
                        }}
                    >
                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                )}
            </div>
            {error && <p style={{ fontSize: 11.5, color: '#ef4444', marginTop: 1 }}>{error}</p>}
            {hint && !error && <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 1 }}>{hint}</p>}
        </div>
    );
});
FormInput.displayName = 'FormInput';
export default FormInput;
