// ═══════════════════════════════════════════════════════
// ADMIN - DEPARTMENTS MANAGEMENT
// ═══════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building2, Edit2, Trash2, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper.jsx';
import AnimatedCard from '../../components/AnimatedCard.jsx';
import AnimatedButton from '../../components/AnimatedButton.jsx';
import Modal from '../../components/Modal.jsx';
import FormInput from '../../components/FormInput.jsx';
import { getAllDepartments, createDepartment, deleteDepartment, getDepartmentById } from '../../services/departmentService.js';
import { getInitials, getAvatarGradient } from '../../utils/index.js';
import { useForm } from 'react-hook-form';

const deptColors = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#ec4899'];
const deptIcons = ['❤️', '🧠', '🦴', '👶', '🔬', '💊'];

export default function AdminDepartments() {
    const [depts, setDepts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [detailDept, setDetailDept] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const load = async () => {
        setLoading(true);
        const data = await getAllDepartments();
        setDepts(data);
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            await createDepartment(data);
            toast.success('Department created!');
            setShowModal(false); reset(); load();
        } catch (err) { toast.error(err.message); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        await deleteDepartment(id);
        toast.success('Department deleted');
        load();
    };

    const viewDetail = async (id) => {
        const detail = await getDepartmentById(id);
        setDetailDept(detail);
    };

    return (
        <PageWrapper
            title="Departments"
            subtitle={`${depts.length} active departments`}
            actions={<AnimatedButton icon={Plus} size="sm" onClick={() => setShowModal(true)}>Add Department</AnimatedButton>}
        >
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {depts.map((dept, idx) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.06 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="bg-slate-800/60 border rounded-2xl p-5 cursor-pointer card-hover"
                            style={{ borderColor: `${deptColors[idx % deptColors.length]}30` }}
                            onClick={() => viewDetail(dept.id)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="text-3xl mb-3">{deptIcons[idx % deptIcons.length]}</div>
                                <div className="flex gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"><Edit2 size={13} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(dept.id); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={13} /></button>
                                </div>
                            </div>
                            <h3 className="font-bold text-white text-lg">{dept.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Stethoscope size={14} style={{ color: deptColors[idx % deptColors.length] }} />
                                <span className="text-sm text-gray-400">{dept.doctorCount} doctors</span>
                            </div>
                            <div className="mt-3 h-1 rounded-full bg-slate-700">
                                <div className="h-1 rounded-full transition-all" style={{
                                    width: `${(dept.doctorCount / 4) * 100}%`,
                                    background: deptColors[idx % deptColors.length]
                                }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Add Department"
                footer={
                    <>
                        <AnimatedButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</AnimatedButton>
                        <AnimatedButton loading={submitting} onClick={handleSubmit(onSubmit)} icon={Building2}>Create</AnimatedButton>
                    </>
                }>
                <FormInput label="Department Name" placeholder="e.g. Radiology" error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })} />
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={!!detailDept} onClose={() => setDetailDept(null)} title={detailDept?.name} size="md">
                {detailDept && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-400">{detailDept.doctors?.length || 0} doctors in this department</p>
                        <div className="space-y-2">
                            {detailDept.doctors?.map(doc => (
                                <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                                        style={{ background: getAvatarGradient(doc.user?.name) }}>
                                        {getInitials(doc.user?.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{doc.user?.name}</p>
                                        <p className="text-xs text-gray-500">{doc.specialization}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </PageWrapper>
    );
}
