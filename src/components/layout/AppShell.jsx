import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppShell() {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-primary)',
            transition: 'background-color var(--duration-normal) var(--ease-out-smooth)'
        }}>
            {/* Desktop Sidebar - Hidden on small screens normally, but forcing display for MVP desktop-first focus */}
            <Sidebar />

            <main style={{
                flex: 1,
                padding: 'var(--space-6) var(--space-8)',
                maxWidth: '1400px', // Limit content width on super wide screens
            }}>
                <Outlet />
            </main>
        </div>
    );
}
