// ═══════════════════════════════════════════════════════
// DOCTOR - APPOINTMENTS PAGE
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AnimatedButton from '../../components/AnimatedButton.jsx';
import { getDoctorByUserId } from '../../services/doctorService.js';
import { getAppointmentsByDoctor, updateAppointmentStatus } from '../../services/appointmentService.js';
import { useAuthStore } from '../../store/index.js';
import { formatDate, formatTime } from '../../utils/index.js';

export default function DoctorAppointments() {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const doc = await getDoctorByUserId(user.id);
        const appts = await getAppointmentsByDoctor(doc.id);
        setAppointments(appts);
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleStatus = async (id, status) => {
        await updateAppointmentStatus(id, status);
        toast.success(`Appointment ${status.toLowerCase()}`);
        load();
    };

    const columns = [
        { key: 'id', label: '#', render: id => <span className="text-gray-500">#{id}</span> },
        {
            key: 'patient', label: 'Patient', render: (_, row) => (
                <div>
                    <p className="text-white font-medium">{row.patient?.user?.name}</p>
                    <p className="text-xs text-gray-500">Age {row.patient?.age} • {row.patient?.gender}</p>
                </div>
            )
        },
        { key: 'appointment_date', label: 'Date', sortable: true, render: d => <span className="text-gray-300">{formatDate(d, { month: 'short', day: 'numeric', year: 'numeric' })}</span> },
        { key: 'appointment_time', label: 'Time', render: t => <span className="text-gray-400">{formatTime(t)}</span> },
        { key: 'status', label: 'Status', render: s => <StatusBadge status={s} /> },
        {
            key: 'id', label: 'Actions', render: (_, row) => (
                <div className="flex gap-1.5">
                    {row.status === 'Scheduled' && (
                        <>
                            <button onClick={() => handleStatus(row.id, 'Completed')} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors"><CheckCircle size={14} /></button>
                            <button onClick={() => handleStatus(row.id, 'Cancelled')} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"><XCircle size={14} /></button>
                        </>
                    )}
                </div>
            )
        },
    ];

    return (
        <PageWrapper title="My Appointments" subtitle={`${appointments.length} total`}>
            <AnimatedCard hover={false}>
                <DataTable columns={columns} data={appointments} loading={loading} searchable searchKeys={['patient.user.name', 'status']} />
            </AnimatedCard>
        </PageWrapper>
    );
}
