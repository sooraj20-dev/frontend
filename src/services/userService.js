// ═══════════════════════════════════════════════════════
// USER SERVICE - Mock REST API
// Structure mirrors real API: async functions, error handling
// Replace fetch() calls here when backend is ready
// ═══════════════════════════════════════════════════════
import { users } from '../mock/database.js';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

// POST /api/auth/login
export const loginUser = async (email, password) => {
    await delay(600);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...safeUser } = user;
    return { token: `mock_jwt_${user.id}_${Date.now()}`, user: safeUser };
};

// GET /api/users
export const getAllUsers = async () => {
    await delay();
    return users.map(({ password: _, ...u }) => u);
};

// GET /api/users/:id
export const getUserById = async (id) => {
    await delay(200);
    const user = users.find(u => u.id === Number(id));
    if (!user) throw new Error('User not found');
    const { password: _, ...safeUser } = user;
    return safeUser;
};

// PUT /api/users/:id
export const updateUser = async (id, data) => {
    await delay();
    const idx = users.findIndex(u => u.id === Number(id));
    if (idx === -1) throw new Error('User not found');
    users[idx] = { ...users[idx], ...data };
    const { password: _, ...safeUser } = users[idx];
    return safeUser;
};

// DELETE /api/users/:id
export const deleteUser = async (id) => {
    await delay();
    const idx = users.findIndex(u => u.id === Number(id));
    if (idx === -1) throw new Error('User not found');
    users.splice(idx, 1);
    return { success: true };
};

// POST /api/users
export const createUser = async (data) => {
    await delay();
    const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        created_at: new Date().toISOString(),
        ...data
    };
    users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
};
