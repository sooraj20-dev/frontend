// ═══════════════════════════════════════════════════════
// DOCTOR DASHBOARD PAGE
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, DollarSign, Users, Plus, FileText, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper.jsx';
import StatCard from '../../components/StatCard.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AnimatedButton from '../../components/AnimatedButton.jsx';
import Modal from '../../components/Modal.jsx';
import FormInput from '../../components/FormInput.jsx';
import { SkeletonStatCard } from '../../components/Skeleton.jsx';
import { getDoctorByUserId } from '../../services/doctorService.js';
import { getAppointmentsByDoctor, updateAppointmentStatus } from '../../services/appointmentService.js';
import { prescriptions } from '../../mock/database.js';
import { useAuthStore } from '../../store/index.js';
import { formatDate, formatTime, formatCurrency, isToday, getInitials, getAvatarGradient } from '../../utils/index.js';
import { useForm } from 'react-hook-form';

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showRxModal, setShowRxModal] = useState(false);
    const [rxAppt, setRxAppt] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const load = async () => {
        try {
            const doc = await getDoctorByUserId(user.id);
            setDoctor(doc);
            const appts = await getAppointmentsByDoctor(doc.id);
            setAppointments(appts);
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const todayAppts = appointments.filter(a => isToday(a.appointment_date));
    const upcoming = appointments.filter(a => a.status === 'Scheduled').slice(0, 5);
    const totalEarnings = appointments.filter(a => a.status === 'Completed').length * (doctor?.fee || 0);

    const handleComplete = async (id) => {
        await updateAppointmentStatus(id, 'Completed');
        toast.success('Appointment marked as completed');
        load();
    };

    const addPrescription = async (data) => {
        prescriptions.push({ id: Date.now(), appointment_id: rxAppt.id, ...data });
        toast.success('Prescription added!');
        setShowRxModal(false); reset();
    };

    return (
        <PageWrapper title={`Good day, ${user.name.split(' ').slice(-1)[0]}!`} subtitle="Here's your schedule overview.">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {loading ? (
                    [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
                ) : (
                    <>
                        <StatCard title="Today's Appointments" value={todayAppts.length} icon={Calendar} color="blue" delay={0} />
                        <StatCard title="Total Patients" value={appointments.length} icon={Users} color="teal" delay={1} />
                        <StatCard title="Appointments" value={appointments.length} icon={Clock} color="purple" delay={2} />
                        <StatCard title="Estimated Earnings" value={totalEarnings} icon={DollarSign} color="green" prefix="$" delay={3} />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Timeline */}
                <AnimatedCard className="xl:col-span-2" hover={false} padding="p-0">
                    <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/8">
                        <div>
                            <h3 className="font-semibold text-white">Today's Appointments</h3>
                            <p className="text-xs text-gray-500">{todayAppts.length} scheduled for today</p>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {todayAppts.length === 0 ? (
                            <div className="flex flex-col items-center py-12 text-gray-500">
                                <span className="text-4xl mb-3">😌</span>
                                <p className="text-sm">No appointments today. Enjoy your day!</p>
                            </div>
                        ) : todayAppts.map((appt, idx) => (
                            <motion.div
                                key={appt.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors"
                            >
                                <div className="text-center flex-shrink-0 w-12">
                                    <p className="text-xs text-gray-500">TIME</p>
                                    <p className="text-sm font-bold text-white">{formatTime(appt.appointment_time)}</p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
                                    style={{ background: getAvatarGradient(appt.patient?.user?.name) }}
                                    onClick={() => setSelectedPatient(appt)}
                                >
                                    {getInitials(appt.patient?.user?.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white">{appt.patient?.user?.name}</p>
                                    <p className="text-xs text-gray-500">Age {appt.patient?.age} • {appt.patient?.gender}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={appt.status} size="sm" />
                                    {appt.status === 'Scheduled' && (
                                        <div className="flex gap-1">
                                            <button onClick={() => { setRxAppt(appt); setShowRxModal(true); }}
                                                className="p-1.5 rounded-lg text-teal-400 hover:bg-teal-400/10 transition-colors" title="Add Rx">
                                                <FileText size={14} />
                                            </button>
                                            <button onClick={() => handleComplete(appt.id)}
                                                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="Complete">
                                                ✓
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {todayAppts.length === 0 && upcoming.length > 0 && (
                        <div className="px-6 pb-5">
                            <p className="text-sm font-semibold text-white mb-3">Upcoming Appointments</p>
                            <div className="space-y-2">
                                {upcoming.slice(0, 3).map(a => (
                                    <div key={a.id} className="flex items-center justify-between p-3 bg-slate-700/40 rounded-xl">
                                        <div>
                                            <p className="text-sm text-white">{a.patient?.user?.name}</p>
                                            <p className="text-xs text-gray-500">{formatDate(a.appointment_date, { month: 'short', day: 'numeric' })} • {formatTime(a.appointment_time)}</p>
                                        </div>
                                        <StatusBadge status={a.status} size="sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </AnimatedCard>

                {/* Doctor info + Quick stats */}
                <div className="space-y-4">
                    {doctor && (
                        <AnimatedCard hover={false}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                                    style={{ background: getAvatarGradient(doctor.user?.name) }}>
                                    {getInitials(doctor.user?.name)}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{doctor.user?.name}</p>
                                    <p className="text-xs text-gray-500">{doctor.specialization}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Department</span>
                                    <span className="text-blue-400 font-medium">{doctor.department?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Consultation Fee</span>
                                    <span className="text-emerald-400 font-bold">{formatCurrency(doctor.fee)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Total Appointments</span>
                                    <span className="text-white font-medium">{appointments.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Completed</span>
                                    <span className="text-white font-medium">{appointments.filter(a => a.status === 'Completed').length}</span>
                                </div>
                            </div>
                        </AnimatedCard>
                    )}

                    {/* AI Health Assistant UI */}
                    <AnimatedCard hover={false} className="relative overflow-hidden" padding="p-5">
                        <div className="absolute inset-0 gradient-blue-purple opacity-10" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center">🤖</div>
                                <div>
                                    <p className="text-sm font-semibold text-white">AI Health Assistant</p>
                                    <p className="text-xs text-gray-400">Beta</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-300 mb-3">
                                AI suggests: 3 patients may need follow-up based on their history.
                            </p>
                            <div className="space-y-2">
                                {['Patient #1024 - Cardiac follow-up', 'Patient #1031 - Medication review'].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                        {s}
                                    </div>
                                ))}
                            </div>
                            <AnimatedButton variant="outline" size="xs" className="mt-3 border-purple-500/50 text-purple-300">
                                View AI Insights
                            </AnimatedButton>
                        </div>
                    </AnimatedCard>
                </div>
            </div>

            {/* Patient Drawer */}
            <AnimatePresence>
                {selectedPatient && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-white/10 z-50 overflow-y-auto scroll-area"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-white">Patient Details</h3>
                                <button onClick={() => setSelectedPatient(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3"
                                    style={{ background: getAvatarGradient(selectedPatient.patient?.user?.name) }}>
                                    {getInitials(selectedPatient.patient?.user?.name)}
                                </div>
                                <p className="font-bold text-white text-lg">{selectedPatient.patient?.user?.name}</p>
                                <p className="text-sm text-gray-400">{selectedPatient.patient?.gender} • {selectedPatient.patient?.age} years</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Phone', value: selectedPatient.patient?.phone },
                                    { label: 'Address', value: selectedPatient.patient?.address },
                                    { label: 'Appointment', value: formatDate(selectedPatient.appointment_date) },
                                    { label: 'Time', value: formatTime(selectedPatient.appointment_time) },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-slate-800/60 rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                                        <p className="text-sm text-white">{value}</p>
                                    </div>
                                ))}
                            </div>
                            {selectedPatient.prescription && (
                                <div className="mt-4 bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                                    <p className="text-xs text-teal-400 font-semibold mb-1">Prescription</p>
                                    <p className="text-sm text-white">{selectedPatient.prescription.diagnosis}</p>
                                    <p className="text-xs text-gray-400 mt-1">{selectedPatient.prescription.note}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Prescription Modal */}
            <Modal isOpen={showRxModal} onClose={() => { setShowRxModal(false); reset(); }} title="Add Prescription" size="md"
                footer={
                    <>
                        <AnimatedButton variant="ghost" onClick={() => { setShowRxModal(false); reset(); }}>Cancel</AnimatedButton>
                        <AnimatedButton icon={FileText} onClick={handleSubmit(addPrescription)}>Save Prescription</AnimatedButton>
                    </>
                }>
                <div className="space-y-4">
                    {rxAppt && (
                        <div className="bg-slate-800/60 rounded-xl p-3 text-sm">
                            <p className="text-gray-400">Patient: <span className="text-white font-medium">{rxAppt.patient?.user?.name}</span></p>
                            <p className="text-gray-400">Date: <span className="text-white">{formatDate(rxAppt.appointment_date)}</span></p>
                        </div>
                    )}
                    <FormInput label="Diagnosis" placeholder="e.g. Hypertension" error={errors.diagnosis?.message}
                        {...register('diagnosis', { required: 'Required' })} />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes & Instructions</label>
                        <textarea {...register('note', { required: 'Required' })} rows={4}
                            placeholder="Medication, dosage, instructions..."
                            className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 resize-none" />
                    </div>
                </div>
            </Modal>
        </PageWrapper>
    );
}
