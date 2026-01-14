import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Settings, PieChart, Moon, Sun, LogOut, History } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const navItems = [
        { icon: Home, label: 'Overview', path: '/' },
        { icon: PlusCircle, label: 'Log Food', path: '/log' },
        { icon: History, label: 'History', path: '/history' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside style={{
            width: '280px',
            height: '100vh',
            position: 'sticky',
            top: 0,
            borderRight: '1px solid var(--color-bg-tertiary)',
            padding: 'var(--space-6) var(--space-4)',
            backgroundColor: 'var(--color-bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color var(--duration-normal) var(--ease-out-smooth), border-color var(--duration-normal) var(--ease-out-smooth)'
        }}>
            <div style={{ marginBottom: 'var(--space-8)', paddingLeft: 'var(--space-3)' }}>
                <h2 className="text-h2" style={{ color: 'var(--color-text-primary)' }}>CalorieAI</h2>
            </div>

            <nav className="flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-3) var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'var(--color-text-secondary)',
                            backgroundColor: isActive ? 'var(--color-text-primary)' : 'transparent', // Using black for active state like typical chic brutalism/apple or Accent color.
                            // Actually Apple often uses Accent text or gray background. Let's go with Black Active for high contrast modern look
                            transition: 'all 200ms ease',
                            fontWeight: isActive ? 500 : 400,
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-bg-tertiary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        width: '100%',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-base)',
                        transition: 'all 200ms ease',
                        cursor: 'pointer'
                    }}
                    className="theme-toggle"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button
                    onClick={async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error("Failed to log out", error);
                        }
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        width: '100%',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-base)',
                        transition: 'all 200ms ease',
                        cursor: 'pointer'
                    }}
                    className="logout-btn"
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}
