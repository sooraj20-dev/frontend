// ═══════════════════════════════════════════════════════
// DOCTOR - PATIENTS PAGE  
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import PageWrapper from '../../components/PageWrapper.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import DataTable from '../../components/DataTable.jsx';
import { getDoctorByUserId } from '../../services/doctorService.js';
import { getAppointmentsByDoctor } from '../../services/appointmentService.js';
import { useAuthStore } from '../../store/index.js';
import { getInitials, getAvatarGradient, formatDate } from '../../utils/index.js';

export default function DoctorPatients() {
    const { user } = useAuthStore();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const doc = await getDoctorByUserId(user.id);
            const appts = await getAppointmentsByDoctor(doc.id);
            // Unique patients
            const seen = new Set();
            const unique = appts.filter(a => {
                if (seen.has(a.patient_id)) return false;
                seen.add(a.patient_id);
                return true;
            }).map(a => ({ ...a.patient, lastVisit: a.appointment_date }));
            setPatients(unique);
            setLoading(false);
        };
        load();
    }, []);

    const columns = [
        {
            key: 'user', label: 'Patient', render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: getAvatarGradient(row.user?.name) }}>
                        {getInitials(row.user?.name)}
                    </div>
                    <div>
                        <p className="font-medium text-white">{row.user?.name}</p>
                        <p className="text-xs text-gray-500">{row.user?.email}</p>
                    </div>
                </div>
            )
        },
        { key: 'age', label: 'Age', render: age => `${age} yrs` },
        { key: 'gender', label: 'Gender' },
        { key: 'phone', label: 'Phone' },
        { key: 'lastVisit', label: 'Last Visit', render: d => formatDate(d, { month: 'short', day: 'numeric', year: 'numeric' }) },
    ];

    return (
        <PageWrapper title="My Patients" subtitle={`${patients.length} unique patients`}>
            <AnimatedCard hover={false}>
                <DataTable columns={columns} data={patients} loading={loading} searchable searchKeys={['user.name', 'gender']} />
            </AnimatedCard>
        </PageWrapper>
    );
}
