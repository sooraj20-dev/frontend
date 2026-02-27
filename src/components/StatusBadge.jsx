// ═══════════════════════════════════════════════════════
// STATUS BADGE — uses CSS badge classes
// ═══════════════════════════════════════════════════════
const STATUS_CLASS = {
    Scheduled: 'badge-scheduled',
    Completed: 'badge-completed',
    Cancelled: 'badge-cancelled',
    Paid: 'badge-paid',
    Pending: 'badge-pending',
};

export default function StatusBadge({ status, size = 'md', showDot = true }) {
    const cls = STATUS_CLASS[status] || '';
    return (
        <span className={`badge ${cls}`} style={{ fontSize: size === 'sm' ? 11 : 12 }}>
            {showDot && <span className="badge-dot" style={{ background: 'currentColor', opacity: .8 }} />}
            {status}
        </span>
    );
}
