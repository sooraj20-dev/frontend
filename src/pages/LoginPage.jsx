// ═══════════════════════════════════════════════════════
// LOGIN PAGE - Stunning animated auth
// ═══════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, HeartPulse, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser } from '../services/userService.js';
import { useAuthStore } from '../store/index.js';
import FormInput from '../components/FormInput.jsx';
import AnimatedButton from '../components/AnimatedButton.jsx';

const quickLogins = [
    { role: 'Admin', color: '#8b5cf6', email: 'admin@medicare.pro', password: 'admin123', badge: '👑' },
    { role: 'Doctor', color: '#3b82f6', email: 'james.wilson@medicare.pro', password: 'doctor123', badge: '🩺' },
    { role: 'Patient', color: '#14b8a6', email: 'alice@example.com', password: 'patient123', badge: '👤' },
];

export default function LoginPage() {
    const { isAuthenticated, user, login } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    if (isAuthenticated) return <Navigate to={`/${user.role}`} replace />;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await loginUser(data.email, data.password);
            login(res.user, res.token);
            toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
            navigate(`/${res.user.role}`, { replace: true });
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const fillLogin = (ql) => {
        setValue('email', ql.email);
        setValue('password', ql.password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
            {/* Background design element */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-50 blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-teal-50 blur-[100px] opacity-60" />
            </div>

            <div className="relative z-10 w-full max-w-[440px]">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-6 shadow-lg shadow-blue-200">
                        <HeartPulse size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to MediCare Pro</h1>
                    <p className="text-slate-500 mt-2 text-sm">Enterprise Hospital Management Solution</p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <FormInput
                            label="Email Address"
                            type="email"
                            icon={Mail}
                            placeholder="name@company.com"
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                            })}
                        />
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                                <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">Forgot?</button>
                            </div>
                            <FormInput
                                type="password"
                                icon={Lock}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register('password', { required: 'Password is required' })}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Quick Demo */}
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] text-center mb-4">Quick Demo Access</p>
                        <div className="flex gap-3">
                            {quickLogins.map(ql => (
                                <button
                                    key={ql.role}
                                    onClick={() => fillLogin(ql)}
                                    className="flex-1 py-2 px-1 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-center group"
                                >
                                    <div className="text-sm mb-0.5 group-hover:scale-110 transition-transform">{ql.badge}</div>
                                    <div className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600">{ql.role}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center flex flex-col gap-4">
                    <p className="text-xs text-slate-400">
                        By signing in, you agree to our <span className="text-slate-600 font-medium cursor-pointer">Terms of Service</span>
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-300 font-medium tracking-wide uppercase">
                        <Shield size={10} />
                        Enterprise Grade Security
                    </div>
                </div>
            </div>
        </div>
    );
}
