// ═══════════════════════════════════════════════════════
// DATA TABLE — search, sort, pagination, theme-aware
// ═══════════════════════════════════════════════════════
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

function getDeep(obj, path) {
    return path.split('.').reduce((acc, k) => (acc ?? {})[k], obj);
}

export default function DataTable({
    columns = [], data = [], loading = false,
    searchable = false, searchKeys = [], emptyMessage = 'No records found',
    rowsPerPage = 10,
}) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(1);

    const handleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    };

    const filtered = useMemo(() => {
        let d = [...data];
        if (search && searchKeys.length) {
            const q = search.toLowerCase();
            d = d.filter(row => searchKeys.some(k => (getDeep(row, k) ?? '').toString().toLowerCase().includes(q)));
        }
        if (sortKey) {
            d.sort((a, b) => {
                const av = getDeep(a, sortKey) ?? '';
                const bv = getDeep(b, sortKey) ?? '';
                const cmp = typeof av === 'number' ? av - bv : av.toString().localeCompare(bv.toString());
                return sortDir === 'asc' ? cmp : -cmp;
            });
        }
        return d;
    }, [data, search, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const sliced = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const skeleton = Array.from({ length: 5 });

    return (
        <div>
            {/* Search */}
            {searchable && (
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} size={13} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search…"
                        style={{
                            width: '100%', maxWidth: 320, paddingLeft: 34, paddingRight: 14, height: 34,
                            background: 'var(--bg-input)', border: '1px solid var(--border-strong)',
                            borderRadius: 10, fontSize: 13, color: 'var(--text-1)',
                            fontFamily: 'inherit', outline: 'none', transition: 'all .15s',
                        }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; }}
                    />
                </div>
            )}

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.label}
                                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                    style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        {col.label}
                                        {col.sortable && (
                                            <span style={{ display: 'flex', flexDirection: 'column', opacity: sortKey === col.key ? 1 : 0.3 }}>
                                                <ChevronUp size={9} style={{ color: sortKey === col.key && sortDir === 'asc' ? '#3b82f6' : 'inherit', marginBottom: -3 }} />
                                                <ChevronDown size={9} style={{ color: sortKey === col.key && sortDir === 'desc' ? '#3b82f6' : 'inherit' }} />
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            skeleton.map((_, i) => (
                                <tr key={i}>
                                    {columns.map((_, ci) => (
                                        <td key={ci}><div className="skeleton" style={{ height: 16, width: '85%', borderRadius: 6 }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : sliced.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13 }}>
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            <AnimatePresence>
                                {sliced.map((row, idx) => (
                                    <motion.tr
                                        key={row.id ?? idx}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03, duration: .2 }}
                                    >
                                        {columns.map(col => (
                                            <td key={col.label}>
                                                {col.render
                                                    ? col.render(getDeep(row, col.key), row)
                                                    : (getDeep(row, col.key) ?? '—')}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && filtered.length > rowsPerPage && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderTop: '1px solid var(--border)',
                    fontSize: 12.5, color: 'var(--text-3)',
                }}>
                    <span>{(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            style={{ padding: '5px 10px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-2)', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? .4 : 1 }}
                        >
                            <ChevronLeft size={13} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            const n = i + 1;
                            return (
                                <button key={n} onClick={() => setPage(n)}
                                    style={{
                                        width: 28, height: 28, borderRadius: 8, border: '1px solid',
                                        borderColor: page === n ? '#3b82f6' : 'var(--border)',
                                        background: page === n ? '#3b82f6' : 'var(--bg-input)',
                                        color: page === n ? '#fff' : 'var(--text-2)',
                                        fontWeight: page === n ? 700 : 500,
                                        cursor: 'pointer', fontSize: 12.5,
                                    }}
                                >{n}</button>
                            );
                        })}
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            style={{ padding: '5px 10px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-2)', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? .4 : 1 }}
                        >
                            <ChevronRight size={13} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
