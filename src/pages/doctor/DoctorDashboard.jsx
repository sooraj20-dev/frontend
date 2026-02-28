// ═══════════════════════════════════════════════════════
// DOCTOR DASHBOARD PAGE — fully theme-aware
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Users, FileText, CheckCircle, X, Sparkles } from 'lucide-react';
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
    const navigate = useNavigate();
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

    const actionBtnStyle = (color) => ({
        padding: '6px', borderRadius: 7, border: '1px solid transparent',
        background: 'transparent', cursor: 'pointer', display: 'flex',
        transition: 'all .15s', color,
    });

    return (
        <PageWrapper title={`Good day, ${user.name.split(' ').slice(-1)[0]}!`} subtitle="Here's your schedule overview.">

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {loading ? (
                    [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
                ) : (
                    <>
                        <StatCard title="Today's Appointments" value={todayAppts.length} icon={Calendar} color="blue" delay={0} />
                        <StatCard title="Total Patients" value={appointments.length} icon={Users} color="teal" delay={1} />
                        <StatCard title="All Appointments" value={appointments.length} icon={Clock} color="purple" delay={2} />
                        <StatCard title="Estimated Earnings" value={totalEarnings} icon={DollarSign} color="green" prefix="$" delay={3} />
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 16 }}>

                {/* Today's Appointments Timeline */}
                <AnimatedCard hover={false} padding="p-0">
                    <div style={{
                        padding: '18px 22px 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border)',
                    }}>
                        <div>
                            <h3 className="section-title">Today's Appointments</h3>
                            <p className="label" style={{ marginTop: 3 }}>{todayAppts.length} scheduled for today</p>
                        </div>
                    </div>

                    <div>
                        {todayAppts.length === 0 ? (
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', padding: '48px 24px',
                                color: 'var(--text-3)', textAlign: 'center',
                            }}>
                                <span style={{ fontSize: 36, marginBottom: 12, lineHeight: 1 }}>😌</span>
                                <p style={{ fontSize: 13.5, color: 'var(--text-2)' }}>No appointments today. Enjoy your day!</p>
                            </div>
                        ) : todayAppts.map((appt, idx) => (
                            <motion.div
                                key={appt.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '14px 22px',
                                    borderBottom: idx < todayAppts.length - 1 ? '1px solid var(--border)' : 'none',
                                    transition: 'background .12s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Time column */}
                                <div style={{ textAlign: 'center', flexShrink: 0, width: 50 }}>
                                    <p className="label">Time</p>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginTop: 2 }}>
                                        {formatTime(appt.appointment_time)}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />

                                {/* Avatar */}
                                <div
                                    title={`View ${appt.patient?.user?.name}`}
                                    style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        background: getAvatarGradient(appt.patient?.user?.name),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontSize: 12, fontWeight: 700,
                                        flexShrink: 0, cursor: 'pointer',
                                        transition: 'transform .15s',
                                    }}
                                    onClick={() => setSelectedPatient(appt)}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {getInitials(appt.patient?.user?.name)}
                                </div>

                                {/* Patient info — clickable name navigates to prescription writer */}
                                <div
                                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                                    onClick={() => navigate(`/doctor/prescriptions/write?appointmentId=${appt.id}`)}
                                    title={`Write prescription for ${appt.patient?.user?.name}`}
                                >
                                    <p style={{
                                        margin: 0, fontSize: 13.5, fontWeight: 600,
                                        color: 'var(--color-primary)',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        textDecoration: 'underline', textDecorationColor: 'var(--color-primary-mid)',
                                        textUnderlineOffset: 3,
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.textDecorationColor = 'var(--color-primary)'}
                                        onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'var(--color-primary-mid)'}
                                    >
                                        {appt.patient?.user?.name}
                                    </p>
                                    <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
                                        Age {appt.patient?.age} · {appt.patient?.gender} · Click to write Rx
                                    </p>
                                </div>

                                {/* Status + Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                    <StatusBadge status={appt.status} size="sm" />
                                    {appt.status === 'Scheduled' && (
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            <button
                                                onClick={() => navigate(`/doctor/prescriptions/write?appointmentId=${appt.id}`)}
                                                title="Write Prescription"
                                                style={actionBtnStyle('var(--color-teal)')}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-teal-light)'; e.currentTarget.style.borderColor = 'var(--color-teal-mid)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                            >
                                                <FileText size={13} />
                                            </button>
                                            <button
                                                onClick={() => handleComplete(appt.id)}
                                                title="Mark Complete"
                                                style={actionBtnStyle('var(--color-success)')}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-success-light)'; e.currentTarget.style.borderColor = 'var(--color-success-mid)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                            >
                                                <CheckCircle size={13} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Upcoming section */}
                    {todayAppts.length === 0 && upcoming.length > 0 && (
                        <div style={{ padding: '16px 22px 20px' }}>
                            <h4 className="section-title" style={{ marginBottom: 12 }}>Upcoming Appointments</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {upcoming.slice(0, 3).map(a => (
                                    <div key={a.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 14px', background: 'var(--bg-panel)',
                                        border: '1px solid var(--border)', borderRadius: 10,
                                    }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{a.patient?.user?.name}</p>
                                            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
                                                {formatDate(a.appointment_date, { month: 'short', day: 'numeric' })} · {formatTime(a.appointment_time)}
                                            </p>
                                        </div>
                                        <StatusBadge status={a.status} size="sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </AnimatedCard>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Doctor Profile Card */}
                    {doctor && (
                        <AnimatedCard hover={false}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: getAvatarGradient(doctor.user?.name),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0,
                                }}>
                                    {getInitials(doctor.user?.name)}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{doctor.user?.name}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{doctor.specialization}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { label: 'Department', value: doctor.department?.name, valueColor: 'var(--color-primary)', bold: true },
                                    { label: 'Consultation Fee', value: formatCurrency(doctor.fee), valueColor: 'var(--color-success)', bold: true },
                                    { label: 'Total Appointments', value: appointments.length, valueColor: 'var(--text-1)' },
                                    { label: 'Completed', value: appointments.filter(a => a.status === 'Completed').length, valueColor: 'var(--text-1)' },
                                ].map(({ label, value, valueColor, bold }) => (
                                    <div key={label} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '8px 0', borderBottom: '1px solid var(--border)',
                                    }}>
                                        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{label}</span>
                                        <span style={{ fontSize: 13, color: valueColor, fontWeight: bold ? 600 : 400 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    )}

                    {/* AI Health Assistant Card */}
                    <AnimatedCard hover={false} style={{ overflow: 'hidden', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', inset: 0, opacity: 0.06,
                            background: 'linear-gradient(135deg, #7C3AED, #1FA79A)',
                            pointerEvents: 'none',
                        }} />
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 9,
                                    background: 'rgba(124,58,237,.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Sparkles size={16} style={{ color: '#7C3AED' }} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)' }}>AI Health Assistant</p>
                                    <span style={{
                                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
                                        background: 'rgba(124,58,237,.1)', color: '#7C3AED',
                                        textTransform: 'uppercase', letterSpacing: '.06em',
                                    }}>Beta</span>
                                </div>
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.5 }}>
                                3 patients may need follow-up based on their history.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                                {['Patient #1024 — Cardiac follow-up', 'Patient #1031 — Medication review'].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-2)' }}>
                                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7C3AED', flexShrink: 0 }} />
                                        {s}
                                    </div>
                                ))}
                            </div>
                            <AnimatedButton variant="ghost" size="sm" style={{ borderColor: 'rgba(124,58,237,.3)', color: '#7C3AED', fontSize: 12 }}>
                                View AI Insights
                            </AnimatedButton>
                        </div>
                    </AnimatedCard>
                </div>
            </div>

            {/* Patient Details Drawer */}
            <AnimatePresence>
                {selectedPatient && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,45,.4)', backdropFilter: 'blur(4px)', zIndex: 40 }}
                            onClick={() => setSelectedPatient(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                            style={{
                                position: 'fixed', right: 0, top: 0, bottom: 0, width: 320,
                                background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
                                zIndex: 50, overflowY: 'auto',
                            }}
                            className="scroll-area"
                            role="dialog"
                            aria-label="Patient Details"
                        >
                            <div style={{ padding: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Patient Details</h3>
                                    <button
                                        onClick={() => setSelectedPatient(null)}
                                        aria-label="Close patient details"
                                        style={{
                                            padding: '6px', borderRadius: 7, background: 'var(--bg-panel)',
                                            border: '1px solid var(--border)', color: 'var(--text-3)',
                                            cursor: 'pointer', display: 'flex', transition: 'all .15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 16,
                                        background: getAvatarGradient(selectedPatient.patient?.user?.name),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 700, fontSize: 20, margin: '0 auto 12px',
                                    }}>
                                        {getInitials(selectedPatient.patient?.user?.name)}
                                    </div>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>
                                        {selectedPatient.patient?.user?.name}
                                    </p>
                                    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 }}>
                                        {selectedPatient.patient?.gender} · {selectedPatient.patient?.age} years
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {[
                                        { label: 'Phone', value: selectedPatient.patient?.phone },
                                        { label: 'Address', value: selectedPatient.patient?.address },
                                        { label: 'Appointment', value: formatDate(selectedPatient.appointment_date) },
                                        { label: 'Time', value: formatTime(selectedPatient.appointment_time) },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{
                                            background: 'var(--bg-panel)', border: '1px solid var(--border)',
                                            borderRadius: 9, padding: '10px 14px',
                                        }}>
                                            <p className="label" style={{ marginBottom: 3 }}>{label}</p>
                                            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-1)' }}>{value || '—'}</p>
                                        </div>
                                    ))}
                                </div>

                                {selectedPatient.prescription && (
                                    <div style={{
                                        marginTop: 12, padding: 14,
                                        background: 'var(--color-teal-light)',
                                        border: '1px solid var(--color-teal-mid)',
                                        borderRadius: 10,
                                    }}>
                                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--color-teal)', marginBottom: 6 }}>Prescription</p>
                                        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-1)' }}>{selectedPatient.prescription.diagnosis}</p>
                                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{selectedPatient.prescription.note}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Prescription Modal */}
            <Modal
                isOpen={showRxModal}
                onClose={() => { setShowRxModal(false); reset(); }}
                title="Add Prescription"
                size="md"
                footer={
                    <>
                        <AnimatedButton variant="ghost" onClick={() => { setShowRxModal(false); reset(); }}>Cancel</AnimatedButton>
                        <AnimatedButton icon={FileText} onClick={handleSubmit(addPrescription)}>Save Prescription</AnimatedButton>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {rxAppt && (
                        <div style={{
                            background: 'var(--bg-panel)', border: '1px solid var(--border)',
                            borderRadius: 9, padding: '10px 14px', fontSize: 13,
                        }}>
                            <p style={{ margin: 0, color: 'var(--text-3)' }}>
                                Patient: <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{rxAppt.patient?.user?.name}</span>
                            </p>
                            <p style={{ margin: 0, color: 'var(--text-3)', marginTop: 3 }}>
                                Date: <span style={{ color: 'var(--text-2)' }}>{formatDate(rxAppt.appointment_date)}</span>
                            </p>
                        </div>
                    )}
                    <FormInput label="Diagnosis" placeholder="e.g. Hypertension" error={errors.diagnosis?.message}
                        {...register('diagnosis', { required: 'Required' })} />
                    <div>
                        <label style={{
                            display: 'block', fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase',
                            letterSpacing: '.05em', color: 'var(--text-2)', marginBottom: 6,
                        }}>
                            Notes & Instructions
                        </label>
                        <textarea
                            {...register('note', { required: 'Required' })}
                            rows={4}
                            placeholder="Medication, dosage, instructions..."
                            style={{
                                width: '100%', borderRadius: 8,
                                border: `1px solid ${errors.note ? 'var(--color-error)' : 'var(--border-strong)'}`,
                                background: 'var(--bg-input)', padding: '10px 14px',
                                fontSize: 13.5, color: 'var(--text-1)', outline: 'none',
                                fontFamily: 'inherit', resize: 'none', transition: 'all .15s',
                            }}
                            onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(30,90,168,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = errors.note ? 'var(--color-error)' : 'var(--border-strong)'; e.target.style.boxShadow = 'none'; }}
                        />
                        {errors.note && <p style={{ margin: 0, marginTop: 4, fontSize: 11.5, color: 'var(--color-error)' }}>{errors.note.message}</p>}
                    </div>
                </div>
            </Modal>
        </PageWrapper>
    );
}
