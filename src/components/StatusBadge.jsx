// ═══════════════════════════════════════════════════════
// STATUS BADGE — WCAG AA: icon + label (not color alone)
// ═══════════════════════════════════════════════════════
import { CheckCircle, Clock, XCircle, CreditCard, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
    Scheduled: { cls: 'badge-scheduled', Icon: Clock, label: 'Scheduled' },
    Completed: { cls: 'badge-completed', Icon: CheckCircle, label: 'Completed' },
    Cancelled: { cls: 'badge-cancelled', Icon: XCircle, label: 'Cancelled' },
    Paid: { cls: 'badge-paid', Icon: CreditCard, label: 'Paid' },
    Pending: { cls: 'badge-pending', Icon: AlertCircle, label: 'Pending' },
};

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
    const config = STATUS_CONFIG[status] || { cls: '', Icon: AlertCircle, label: status };
    const Icon = config.Icon;
    const fontSize = size === 'sm' ? 11 : size === 'xs' ? 10 : 12;
    const iconSize = size === 'sm' ? 11 : size === 'xs' ? 10 : 12;

    return (
        <span
            className={`badge ${config.cls}`}
            style={{ fontSize }}
            role="status"
            aria-label={config.label}
        >
            {showIcon && <Icon size={iconSize} strokeWidth={2.5} aria-hidden="true" />}
            {config.label}
        </span>
    );
}
