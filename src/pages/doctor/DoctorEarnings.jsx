// ═══════════════════════════════════════════════════════
// DOCTOR - EARNINGS PAGE
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import PageWrapper from '../../components/PageWrapper.jsx';
import StatCard from '../../components/StatCard.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import { getDoctorByUserId } from '../../services/doctorService.js';
import { getAppointmentsByDoctor } from '../../services/appointmentService.js';
import { useAuthStore } from '../../store/index.js';
import { formatCurrency } from '../../utils/index.js';

export default function DoctorEarnings() {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState([]);
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const load = async () => {
            const doc = await getDoctorByUserId(user.id);
            setDoctor(doc);
            const appts = await getAppointmentsByDoctor(doc.id);
            setAppointments(appts);
        };
        load();
    }, []);

    const completed = appointments.filter(a => a.status === 'Completed');
    const totalEarnings = completed.length * (doctor?.fee || 0);

    const monthlyData = [
        { month: 'Sep', earnings: completed.length > 0 ? (doctor?.fee || 0) * 2 : 0 },
        { month: 'Oct', earnings: completed.length > 0 ? (doctor?.fee || 0) * 3 : 0 },
        { month: 'Nov', earnings: completed.length > 0 ? (doctor?.fee || 0) * 4 : 0 },
        { month: 'Dec', earnings: completed.length > 0 ? (doctor?.fee || 0) * 2 : 0 },
        { month: 'Jan', earnings: completed.length > 0 ? (doctor?.fee || 0) * 5 : 0 },
        { month: 'Feb', earnings: totalEarnings },
    ];

    return (
        <PageWrapper title="Earnings Overview" subtitle="Track your consultation earnings">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Earnings" value={totalEarnings} icon={DollarSign} color="green" prefix="$" delay={0} />
                <StatCard title="Completed Sessions" value={completed.length} icon={Calendar} color="blue" delay={1} />
                <StatCard title="Consultation Fee" value={doctor?.fee || 0} icon={TrendingUp} color="teal" prefix="$" delay={2} />
            </div>
            <AnimatedCard hover={false}>
                <h3 className="font-semibold text-white mb-5">Monthly Earnings</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                        <Tooltip formatter={(v) => [formatCurrency(v), 'Earnings']} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                        <Bar dataKey="earnings" fill="#22c55e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </AnimatedCard>
        </PageWrapper>
    );
}
