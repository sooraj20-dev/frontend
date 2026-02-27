// ═══════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes/index.jsx';
import { useUIStore } from './store/index.js';

export default function App() {
  const { theme } = useUIStore();

  // Apply theme to html element so CSS variables cascade everywhere
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.background = 'var(--bg-app)';
    document.body.style.color = 'var(--text-1)';
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ top: 70, right: 16 }}
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--bg-surface, #1e293b)',
            color: 'var(--text-1, #f1f5f9)',
            border: '1px solid var(--border-strong, rgba(255,255,255,.12))',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 20px 60px rgba(0,0,0,.35)',
            maxWidth: 360,
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: 'transparent' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'transparent' },
          },
        }}
      />
    </>
  );
}
