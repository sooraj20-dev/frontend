// ═══════════════════════════════════════════════════════
// ADMIN - USERS MANAGEMENT
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import { getAllUsers, deleteUser } from '../../services/userService.js';
import { getInitials, getAvatarGradient, formatDate } from '../../utils/index.js';

const roleColors = { admin: '#8b5cf6', doctor: '#3b82f6', patient: '#14b8a6' };

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        await deleteUser(id);
        toast.success('User deleted');
        load();
    };

    const columns = [
        {
            key: 'name',
            label: 'User',
            sortable: true,
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: getAvatarGradient(row.name) }}>
                        {getInitials(row.name)}
                    </div>
                    <div>
                        <p className="font-medium text-white">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (role) => (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{ background: `${roleColors[role]}20`, color: roleColors[role], border: `1px solid ${roleColors[role]}30` }}>
                    {role}
                </span>
            )
        },
        { key: 'created_at', label: 'Joined', render: (d) => <span className="text-gray-400 text-sm">{formatDate(d, { month: 'short', day: 'numeric', year: 'numeric' })}</span> },
        {
            key: 'id',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
                </div>
            )
        },
    ];

    const roleCounts = users.reduce((a, u) => ({ ...a, [u.role]: (a[u.role] || 0) + 1 }), {});

    return (
        <PageWrapper title="Users" subtitle={`${users.length} total registered users`}>
            <div className="grid grid-cols-3 gap-3">
                {['admin', 'doctor', 'patient'].map(r => (
                    <div key={r} className="bg-slate-800/60 border border-white/8 rounded-xl p-4 text-center"
                        style={{ borderColor: `${roleColors[r]}25` }}>
                        <p className="text-2xl font-bold" style={{ color: roleColors[r] }}>{roleCounts[r] || 0}</p>
                        <p className="text-xs text-gray-500 capitalize mt-1">{r}s</p>
                    </div>
                ))}
            </div>
            <AnimatedCard hover={false}>
                <DataTable
                    columns={columns}
                    data={users}
                    loading={loading}
                    searchable
                    searchKeys={['name', 'email', 'role']}
                    emptyMessage="No users found"
                />
            </AnimatedCard>
        </PageWrapper>
    );
}
