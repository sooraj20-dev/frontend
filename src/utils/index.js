// ═══════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes safely
export const cn = (...inputs) => twMerge(clsx(inputs));

// Format currency
export const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// Format date
export const formatDate = (dateStr, options = {}) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', ...options
    });
};

// Format time
export const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
};

// Get initials from name
export const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

// Generate avatar gradient from name
const gradients = [
    ['#6366f1', '#8b5cf6'], ['#3b82f6', '#0d9488'], ['#f59e0b', '#ef4444'],
    ['#10b981', '#3b82f6'], ['#8b5cf6', '#ec4899'], ['#0d9488', '#6366f1'],
];
export const getAvatarGradient = (name = '') => {
    const idx = name.charCodeAt(0) % gradients.length;
    return `linear-gradient(135deg, ${gradients[idx][0]}, ${gradients[idx][1]})`;
};

// Get status color
export const getStatusColor = (status) => {
    const map = {
        'Scheduled': 'badge-scheduled',
        'Completed': 'badge-completed',
        'Cancelled': 'badge-cancelled',
        'Paid': 'badge-paid',
        'Pending': 'badge-pending',
    };
    return map[status] || 'badge-scheduled';
};

// Debounce
export const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

// Animate counter
export const animateCounter = (start, end, duration, callback) => {
    const range = end - start;
    const startTime = performance.now();
    const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        callback(Math.round(start + range * eased));
        if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

// Get today's date
export const today = () => new Date().toISOString().split('T')[0];

// Check if appt is today
export const isToday = (dateStr) => dateStr === today();

// Group array by key
export const groupBy = (arr, key) =>
    arr.reduce((acc, item) => {
        const k = item[key];
        acc[k] = acc[k] ? [...acc[k], item] : [item];
        return acc;
    }, {});

// Truncate text
export const truncate = (text, length = 50) =>
    text?.length > length ? `${text.slice(0, length)}...` : text;
