// ═══════════════════════════════════════════════════════
// ADMIN - PATIENTS MANAGEMENT PAGE
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import AnimatedButton from '../../components/AnimatedButton.jsx';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import FormInput from '../../components/FormInput.jsx';
import { getAllPatients, deletePatient, createPatient } from '../../services/patientService.js';
import { createUser } from '../../services/userService.js';
import { getInitials, getAvatarGradient } from '../../utils/index.js';
import { useForm } from 'react-hook-form';

export default function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const load = async () => {
        setLoading(true);
        const data = await getAllPatients();
        setPatients(data);
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const user = await createUser({ name: data.name, email: data.email, password: data.password, role: 'patient' });
            await createPatient({ user_id: user.id, age: Number(data.age), gender: data.gender, phone: data.phone, address: data.address });
            toast.success('Patient added!');
            setShowModal(false); reset(); load();
        } catch (err) { toast.error(err.message); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this patient?')) return;
        await deletePatient(id);
        toast.success('Patient removed');
        load();
    };

    const columns = [
        {
            key: 'user',
            label: 'Patient',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
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
        { key: 'age', label: 'Age', sortable: true, render: (age) => <span className="text-gray-300">{age} yrs</span> },
        {
            key: 'gender',
            label: 'Gender',
            render: (gender) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${gender === 'Male' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-pink-500/10 text-pink-300 border-pink-500/20'}`}>
                    {gender}
                </span>
            )
        },
        { key: 'phone', label: 'Phone' },
        { key: 'address', label: 'Address', render: (a) => <span className="text-gray-400 text-xs truncate max-w-xs block">{a}</span> },
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
            title="Patients"
            subtitle={`${patients.length} registered patients`}
            actions={<AnimatedButton icon={Plus} size="sm" onClick={() => setShowModal(true)}>Add Patient</AnimatedButton>}
        >
            <AnimatedCard hover={false}>
                <DataTable
                    columns={columns}
                    data={patients}
                    loading={loading}
                    searchable
                    searchKeys={['user.name', 'phone', 'gender']}
                    emptyMessage="No patients found"
                />
            </AnimatedCard>

            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); reset(); }}
                title="Register New Patient"
                footer={
                    <>
                        <AnimatedButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</AnimatedButton>
                        <AnimatedButton loading={submitting} onClick={handleSubmit(onSubmit)} icon={UserRound}>Register</AnimatedButton>
                    </>
                }
            >
                <div className="space-y-4">
                    <FormInput label="Full Name" placeholder="Alice Johnson" error={errors.name?.message}
                        {...register('name', { required: 'Required' })} />
                    <FormInput label="Email" type="email" placeholder="patient@email.com" error={errors.email?.message}
                        {...register('email', { required: 'Required' })} />
                    <FormInput label="Password" type="password" placeholder="••••••••" error={errors.password?.message}
                        {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} />
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Age" type="number" placeholder="30" error={errors.age?.message}
                            {...register('age', { required: 'Required' })} />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Gender <span className="text-red-400">*</span></label>
                            <select {...register('gender', { required: 'Required' })}
                                className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none focus:border-blue-500">
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <FormInput label="Phone" placeholder="+1-555-0100" error={errors.phone?.message}
                        {...register('phone', { required: 'Required' })} />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Address</label>
                        <textarea {...register('address')} rows={2} placeholder="123 Main St, City, State"
                            className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 resize-none" />
                    </div>
                </div>
            </Modal>
        </PageWrapper>
    );
}
