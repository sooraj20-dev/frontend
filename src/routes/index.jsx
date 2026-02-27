// ═══════════════════════════════════════════════════════
// APP ROUTES - React Router v7
// ═══════════════════════════════════════════════════════
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Pages
import LoginPage from '../pages/LoginPage.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminUsers from '../pages/admin/AdminUsers.jsx';
import AdminDoctors from '../pages/admin/AdminDoctors.jsx';
import AdminPatients from '../pages/admin/AdminPatients.jsx';
import AdminDepartments from '../pages/admin/AdminDepartments.jsx';
import AdminAppointments from '../pages/admin/AdminAppointments.jsx';
import AdminBills from '../pages/admin/AdminBills.jsx';

// Doctor pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard.jsx';
import DoctorAppointments from '../pages/doctor/DoctorAppointments.jsx';
import DoctorPatients from '../pages/doctor/DoctorPatients.jsx';
import DoctorPrescriptions from '../pages/doctor/DoctorPrescriptions.jsx';
import DoctorEarnings from '../pages/doctor/DoctorEarnings.jsx';

// Patient pages
import PatientDashboard from '../pages/patient/PatientDashboard.jsx';
import BookAppointment from '../pages/patient/BookAppointment.jsx';
import PatientAppointments from '../pages/patient/PatientAppointments.jsx';
import PatientPrescriptions from '../pages/patient/PatientPrescriptions.jsx';
import PatientBills from '../pages/patient/PatientBills.jsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },

    // ── Admin Routes ────────────────────────────────────
    {
        path: '/admin',
        element: <DashboardLayout role="admin" />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'doctors', element: <AdminDoctors /> },
            { path: 'patients', element: <AdminPatients /> },
            { path: 'departments', element: <AdminDepartments /> },
            { path: 'appointments', element: <AdminAppointments /> },
            { path: 'bills', element: <AdminBills /> },
        ],
    },

    // ── Doctor Routes ───────────────────────────────────
    {
        path: '/doctor',
        element: <DashboardLayout role="doctor" />,
        children: [
            { index: true, element: <DoctorDashboard /> },
            { path: 'appointments', element: <DoctorAppointments /> },
            { path: 'patients', element: <DoctorPatients /> },
            { path: 'prescriptions', element: <DoctorPrescriptions /> },
            { path: 'earnings', element: <DoctorEarnings /> },
        ],
    },

    // ── Patient Routes ──────────────────────────────────
    {
        path: '/patient',
        element: <DashboardLayout role="patient" />,
        children: [
            { index: true, element: <PatientDashboard /> },
            { path: 'book', element: <BookAppointment /> },
            { path: 'appointments', element: <PatientAppointments /> },
            { path: 'prescriptions', element: <PatientPrescriptions /> },
            { path: 'bills', element: <PatientBills /> },
        ],
    },

    // ── Catch all – redirect to login ───────────────────
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
