// ═══════════════════════════════════════════════════════
// SKELETON LOADERS — theme-aware
// ═══════════════════════════════════════════════════════
export function SkeletonStatCard() {
    return (
        <div className="stat-card" style={{ pointerEvents: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 11, width: 80, marginBottom: 14, borderRadius: 5 }} />
                    <div className="skeleton" style={{ height: 28, width: 60, marginBottom: 14, borderRadius: 5 }} />
                    <div className="skeleton" style={{ height: 11, width: 100, borderRadius: 5 }} />
                </div>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0 }} />
            </div>
        </div>
    );
}

export function SkeletonCard({ height = 180 }) {
    return <div className="card skeleton" style={{ height }} />;
}

export function SkeletonTable({ rows = 5 }) {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ height: 30, width: 220, borderRadius: 8 }} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                            {[40, 120, 90, 80, 70].map((w, ci) => (
                                <td key={ci} style={{ padding: '14px 16px' }}>
                                    <div className="skeleton" style={{ height: 13, width: w, borderRadius: 5 }} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
