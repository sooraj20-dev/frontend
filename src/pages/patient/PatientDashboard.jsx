// ═══════════════════════════════════════════════════════
// PATIENT DASHBOARD PAGE
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, CreditCard, ArrowRight, Check, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper.jsx';
import StatCard from '../../components/StatCard.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AnimatedButton from '../../components/AnimatedButton.jsx';
import { SkeletonStatCard } from '../../components/Skeleton.jsx';
import { getPatientByUserId } from '../../services/patientService.js';
import { getAppointmentsByPatient } from '../../services/appointmentService.js';
import { getBillsByPatient } from '../../services/billService.js';
import { useAuthStore } from '../../store/index.js';
import { formatDate, formatTime, formatCurrency } from '../../utils/index.js';

export default function PatientDashboard() {
    const { user } = useAuthStore();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const p = await getPatientByUserId(user.id);
                setPatient(p);
                const [appts, b] = await Promise.all([
                    getAppointmentsByPatient(p.id),
                    getBillsByPatient(p.id),
                ]);
                setAppointments(appts);
                setBills(b);
            } finally { setLoading(false); }
        };
        load();
    }, []);

    const upcoming = appointments.filter(a => a.status === 'Scheduled');
    const completed = appointments.filter(a => a.status === 'Completed');
    const pendingBills = bills.filter(b => b.status === 'Pending');

    const progressSteps = [
        { label: 'Scheduled', icon: Calendar, done: true },
        { label: 'Confirmed', icon: Check, done: upcoming.length > 0 },
        { label: 'Completed', icon: Check, done: completed.length > 0 },
        { label: 'Billed', icon: CreditCard, done: bills.length > 0 },
    ];

    return (
        <PageWrapper title={`Hello, ${user.name.split(' ')[0]}!`} subtitle="Track your health journey below.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {loading ? (
                    [...Array(3)].map((_, i) => <SkeletonStatCard key={i} />)
                ) : (
                    <>
                        <StatCard title="Upcoming Appointments" value={upcoming.length} icon={Calendar} color="blue" delay={0} />
                        <StatCard title="Total Appointments" value={appointments.length} icon={Clock} color="teal" delay={1} />
                        <StatCard title="Pending Bills" value={pendingBills.length} icon={CreditCard} color="orange" delay={2} />
                    </>
                )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                    { label: 'Book Appointment', icon: '📅', desc: 'Schedule with a doctor', to: '/patient/book', color: '#3b82f6' },
                    { label: 'View Prescriptions', icon: '💊', desc: 'Your medical prescriptions', to: '/patient/prescriptions', color: '#14b8a6' },
                    { label: 'View Bills', icon: '💳', desc: 'Payment and billing info', to: '/patient/bills', color: '#f59e0b' },
                ].map(q => (
                    <Link to={q.to} key={q.label}>
                        <motion.div
                            whileHover={{ y: -4, scale: 1.01 }}
                            className="p-5 rounded-2xl border card-hover cursor-pointer"
                            style={{ background: `${q.color}10`, borderColor: `${q.color}25` }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{q.icon}</span>
                                <h3 className="font-semibold text-white">{q.label}</h3>
                            </div>
                            <p className="text-xs text-gray-400">{q.desc}</p>
                            <ArrowRight size={14} className="mt-3" style={{ color: q.color }} />
                        </motion.div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Upcoming appointments */}
                <AnimatedCard hover={false} padding="p-0">
                    <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-white/8">
                        <h3 className="font-semibold text-white">Upcoming Appointments</h3>
                        <Link to="/patient/appointments">
                            <AnimatedButton variant="ghost" size="xs" icon={ArrowRight} iconRight>View all</AnimatedButton>
                        </Link>
                    </div>
                    {upcoming.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No upcoming appointments</p>
                            <Link to="/patient/book"><AnimatedButton size="sm" className="mt-3">Book Now</AnimatedButton></Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {upcoming.slice(0, 3).map((appt, idx) => (
                                <motion.div key={appt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-4 px-5 py-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Calendar size={16} className="text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white text-sm">{appt.doctor?.user?.name}</p>
                                        <p className="text-xs text-gray-500">{appt.doctor?.specialization}</p>
                                        <p className="text-xs text-blue-400 mt-1">{formatDate(appt.appointment_date, { month: 'short', day: 'numeric' })} • {formatTime(appt.appointment_time)}</p>
                                    </div>
                                    <StatusBadge status={appt.status} size="sm" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatedCard>

                {/* Progress tracker + Pending bills */}
                <div className="space-y-4">
                    {/* Status progress */}
                    {appointments.length > 0 && (
                        <AnimatedCard hover={false}>
                            <h3 className="font-semibold text-white mb-5">Appointment Journey</h3>
                            <div className="flex items-center justify-between">
                                {progressSteps.map((step, idx) => (
                                    <div key={step.label} className="flex items-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${step.done ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-500'}`}>
                                                <step.icon size={14} />
                                            </div>
                                            <span className={`text-xs ${step.done ? 'text-blue-400' : 'text-gray-600'}`}>{step.label}</span>
                                        </div>
                                        {idx < progressSteps.length - 1 && (
                                            <div className={`h-px w-8 mx-1 mt-[-16px] ${step.done ? 'bg-blue-500' : 'bg-slate-700'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Pending bills */}
                    <AnimatedCard hover={false}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">Pending Bills</h3>
                            <Link to="/patient/bills">
                                <AnimatedButton variant="ghost" size="xs">View all</AnimatedButton>
                            </Link>
                        </div>
                        {pendingBills.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No pending bills 🎉</p>
                        ) : (
                            <div className="space-y-2">
                                {pendingBills.map(b => (
                                    <div key={b.id} className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                                        <div>
                                            <p className="text-sm text-white">{b.appointment?.doctor?.user?.name}</p>
                                            <p className="text-xs text-gray-500">{formatDate(b.created_at, { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <span className="font-bold text-yellow-400">{formatCurrency(b.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </AnimatedCard>
                </div>
            </div>
        </PageWrapper>
    );
}
