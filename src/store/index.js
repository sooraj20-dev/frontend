// ═══════════════════════════════════════════════════════
// AUTH STORE - Zustand Global State
// ═══════════════════════════════════════════════════════
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            updateUser: (data) => set(state => ({ user: { ...state.user, ...data } })),
            getRole: () => get().user?.role,
        }),
        {
            name: 'medicare-auth',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

// ── UI STORE ──────────────────────────────────────────
export const useUIStore = create((set, get) => ({
    sidebarCollapsed: false,
    theme: 'light',
    notifications: [
        { id: 1, type: 'appointment', message: 'New appointment booked by Alice Johnson', time: '2 min ago', read: false },
        { id: 2, type: 'bill', message: 'Payment received from Bob Martinez - $280', time: '15 min ago', read: false },
        { id: 3, type: 'alert', message: 'Dr. Torres has 5 appointments today', time: '1 hr ago', read: true },
        { id: 4, type: 'info', message: 'System maintenance scheduled for Sunday', time: '3 hr ago', read: true },
    ],
    loading: {},
    modals: {},

    toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    toggleTheme: () => set(state => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
    })),
    markNotificationRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
    markAllRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),
    addNotification: (notif) => set(state => ({
        notifications: [{ id: Date.now(), ...notif, read: false, time: 'Just now' }, ...state.notifications]
    })),

    setLoading: (key, value) => set(state => ({ loading: { ...state.loading, [key]: value } })),
    isLoading: (key) => get().loading[key] || false,
    openModal: (key) => set(state => ({ modals: { ...state.modals, [key]: true } })),
    closeModal: (key) => set(state => ({ modals: { ...state.modals, [key]: false } })),
    isModalOpen: (key) => get().modals[key] || false,
}));

// ── DATA STORE ────────────────────────────────────────
export const useDataStore = create((set) => ({
    doctors: [],
    patients: [],
    departments: [],
    appointments: [],
    bills: [],

    setDoctors: (doctors) => set({ doctors }),
    setPatients: (patients) => set({ patients }),
    setDepartments: (departments) => set({ departments }),
    setAppointments: (appointments) => set({ appointments }),
    setBills: (bills) => set({ bills }),

    addDoctor: (doctor) => set(state => ({ doctors: [...state.doctors, doctor] })),
    addPatient: (patient) => set(state => ({ patients: [...state.patients, patient] })),
    addAppointment: (appt) => set(state => ({ appointments: [...state.appointments, appt] })),

    updateAppointment: (id, data) => set(state => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...data } : a)
    })),
    removeAppointment: (id) => set(state => ({
        appointments: state.appointments.filter(a => a.id !== id)
    })),
    updateBill: (id, data) => set(state => ({
        bills: state.bills.map(b => b.id === id ? { ...b, ...data } : b)
    })),
}));
