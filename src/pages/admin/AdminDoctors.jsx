// ═══════════════════════════════════════════════════════
// ADMIN - DOCTORS MANAGEMENT PAGE
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Stethoscope, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import AnimatedButton from '../../components/AnimatedButton.jsx';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import FormInput from '../../components/FormInput.jsx';
import { getAllDoctors, createDoctor, deleteDoctor } from '../../services/doctorService.js';
import { getAllDepartments } from '../../services/departmentService.js';
import { createUser } from '../../services/userService.js';
import { getInitials, getAvatarGradient, formatCurrency } from '../../utils/index.js';
import { useForm } from 'react-hook-form';

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const load = async () => {
        setLoading(true);
        const [docs, depts] = await Promise.all([getAllDoctors(), getAllDepartments()]);
        setDoctors(docs);
        setDepartments(depts);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const user = await createUser({ name: data.name, email: data.email, password: data.password, role: 'doctor' });
            await createDoctor({ user_id: user.id, department_id: Number(data.department_id), specialization: data.specialization, fee: Number(data.fee) });
            toast.success('Doctor added successfully!');
            setShowModal(false);
            reset();
            load();
        } catch (err) { toast.error(err.message); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this doctor?')) return;
        await deleteDoctor(id);
        toast.success('Doctor removed');
        load();
    };

    const columns = [
        {
            key: 'user',
            label: 'Doctor',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: getAvatarGradient(row.user?.name) }}>
                        {getInitials(row.user?.name)}
                    </div>
                    <div>
                        <p className="font-medium text-white">{row.user?.name}</p>
                        <p className="text-xs text-gray-500">{row.user?.email}</p>
                    </div>
                </div>
            )
        },
        { key: 'specialization', label: 'Specialization', sortable: true },
        {
            key: 'department',
            label: 'Department',
            render: (_, row) => (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/20">
                    {row.department?.name}
                </span>
            )
        },
        {
            key: 'fee',
            label: 'Consultation Fee',
            render: (fee) => <span className="text-emerald-400 font-semibold">{formatCurrency(fee)}</span>
        },
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

    return (
        <PageWrapper
            title="Doctors"
            subtitle={`${doctors.length} registered doctors`}
            actions={
                <AnimatedButton icon={Plus} size="sm" onClick={() => setShowModal(true)}>Add Doctor</AnimatedButton>
            }
        >
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {departments.map((dept, idx) => (
                    <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-slate-800/60 border border-white/8 rounded-xl p-4 text-center"
                    >
                        <p className="text-2xl font-bold text-white">{dept.doctorCount}</p>
                        <p className="text-xs text-gray-500 mt-1">{dept.name}</p>
                    </motion.div>
                ))}
            </div>

            <AnimatedCard hover={false}>
                <DataTable
                    columns={columns}
                    data={doctors}
                    loading={loading}
                    searchable
                    searchKeys={['user.name', 'specialization', 'department.name']}
                    emptyMessage="No doctors found"
                />
            </AnimatedCard>

            {/* Add Doctor Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); reset(); }}
                title="Add New Doctor"
                size="md"
                footer={
                    <>
                        <AnimatedButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</AnimatedButton>
                        <AnimatedButton loading={submitting} onClick={handleSubmit(onSubmit)} icon={Stethoscope}>Add Doctor</AnimatedButton>
                    </>
                }
            >
                <div className="space-y-4">
                    <FormInput label="Full Name" placeholder="Dr. John Smith" error={errors.name?.message}
                        {...register('name', { required: 'Name is required' })} />
                    <FormInput label="Email" type="email" placeholder="doctor@medicare.pro" error={errors.email?.message}
                        {...register('email', { required: 'Email is required' })} />
                    <FormInput label="Password" type="password" placeholder="••••••••" error={errors.password?.message}
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                    <FormInput label="Specialization" placeholder="e.g. Cardiologist" error={errors.specialization?.message}
                        {...register('specialization', { required: 'Required' })} />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Department <span className="text-red-400">*</span></label>
                        <select {...register('department_id', { required: 'Required' })}
                            className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                            <option value="">Select Department</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <FormInput label="Consultation Fee ($)" type="number" placeholder="250" error={errors.fee?.message}
                        {...register('fee', { required: 'Required', min: { value: 1, message: 'Must be > 0' } })} />
                </div>
            </Modal>
        </PageWrapper>
    );
}
