// ═══════════════════════════════════════════════════════
// BILL SERVICE - Mock REST API
// ═══════════════════════════════════════════════════════
import { bills, appointments, patients, doctors, users } from '../mock/database.js';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

const enrichBill = (bill) => {
    const appt = appointments.find(a => a.id === bill.appointment_id);
    const patient = appt ? patients.find(p => p.id === appt.patient_id) : null;
    const doctor = appt ? doctors.find(d => d.id === appt.doctor_id) : null;
    const patientUser = patient ? users.find(u => u.id === patient.user_id) : null;
    const doctorUser = doctor ? users.find(u => u.id === doctor.user_id) : null;
    return {
        ...bill,
        appointment: appt ? {
            ...appt,
            patient: patient ? { ...patient, user: patientUser } : null,
            doctor: doctor ? { ...doctor, user: doctorUser } : null,
        } : null,
    };
};

export const getAllBills = async () => {
    await delay();
    return bills.map(enrichBill);
};

export const getBillById = async (id) => {
    await delay(200);
    const bill = bills.find(b => b.id === Number(id));
    if (!bill) throw new Error('Bill not found');
    return enrichBill(bill);
};

export const getBillByAppointment = async (appointmentId) => {
    await delay(200);
    const bill = bills.find(b => b.appointment_id === Number(appointmentId));
    return bill ? enrichBill(bill) : null;
};

export const getBillsByPatient = async (patientId) => {
    await delay();
    const patientAppointments = appointments.filter(a => a.patient_id === Number(patientId));
    const apptIds = patientAppointments.map(a => a.id);
    return bills.filter(b => apptIds.includes(b.appointment_id)).map(enrichBill);
};

export const updateBillStatus = async (id, status) => {
    await delay();
    const idx = bills.findIndex(b => b.id === Number(id));
    if (idx === -1) throw new Error('Bill not found');
    bills[idx].status = status;
    return enrichBill(bills[idx]);
};

export const getTotalRevenue = async () => {
    await delay(200);
    const paid = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);
    const pending = bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.amount, 0);
    return { totalPaid: paid, totalPending: pending, total: paid + pending };
};
