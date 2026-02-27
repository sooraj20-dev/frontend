// ═══════════════════════════════════════════════════════
// DEPARTMENT SERVICE - Mock REST API
// ═══════════════════════════════════════════════════════
import { departments, doctors, users } from '../mock/database.js';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

export const getAllDepartments = async () => {
    await delay(200);
    return departments.map(dept => {
        const deptDoctors = doctors.filter(d => d.department_id === dept.id);
        return { ...dept, doctorCount: deptDoctors.length };
    });
};

export const getDepartmentById = async (id) => {
    await delay(200);
    const dept = departments.find(d => d.id === Number(id));
    if (!dept) throw new Error('Department not found');
    const deptDoctors = doctors.filter(d => d.department_id === dept.id).map(doc => {
        const user = users.find(u => u.id === doc.user_id);
        return { ...doc, user };
    });
    return { ...dept, doctors: deptDoctors };
};

export const createDepartment = async (data) => {
    await delay();
    const newDept = {
        id: Math.max(...departments.map(d => d.id)) + 1,
        ...data
    };
    departments.push(newDept);
    return { ...newDept, doctorCount: 0 };
};

export const updateDepartment = async (id, data) => {
    await delay();
    const idx = departments.findIndex(d => d.id === Number(id));
    if (idx === -1) throw new Error('Department not found');
    departments[idx] = { ...departments[idx], ...data };
    return departments[idx];
};

export const deleteDepartment = async (id) => {
    await delay();
    const idx = departments.findIndex(d => d.id === Number(id));
    if (idx === -1) throw new Error('Department not found');
    departments.splice(idx, 1);
    return { success: true };
};
