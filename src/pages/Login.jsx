import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import '../styles/Auth.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, sendLoginLink, completeLoginLink, isLoginLink, loginWithGoogle } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'magic-link'
    const navigate = useNavigate();

    // Check for incoming Magic Link on mount
    React.useEffect(() => {
        if (isLoginLink(window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }

            setLoading(true);
            completeLoginLink(email, window.location.href)
                .then(() => {
                    window.localStorage.removeItem('emailForSignIn');
                    navigate('/');
                })
                .catch((err) => {
                    setError('Invalid or expired login link. Please try again.');
                    setLoading(false);
                });
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setMessage('');
            setLoading(true);

            if (loginMethod === 'magic-link') {
                await sendLoginLink(emailRef.current.value);
                window.localStorage.setItem('emailForSignIn', emailRef.current.value);
                setMessage('Check your email! We sent you a magic link to sign in.');
            } else {
                await login(emailRef.current.value, passwordRef.current.value);
                navigate('/');
            }
        } catch (err) {
            // Show the actual error message from Firebase
            const errorMessage = err.message ? err.message.replace('Firebase: ', '') : 'Failed to log in. Please check your credentials.';
            setError(errorMessage);
        }

        setLoading(false);
    }

    return (
        <div className="auth-container">
            <div className="auth-content">
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Please Enter your Account details</p>

                {error && <div className="alert-error" style={{ marginBottom: '1rem', color: '#ff4d4f', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}
                {message && <div className="alert-success" style={{ marginBottom: '1rem', color: '#34C759', background: 'rgba(52,199,89,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Login Method Toggle */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('password')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '8px',
                                border: 'none',
                                background: loginMethod === 'password' ? 'var(--color-bg-secondary)' : 'transparent',
                                color: loginMethod === 'password' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: 500
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span>Password</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('magic-link')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '8px',
                                border: 'none',
                                background: loginMethod === 'magic-link' ? 'var(--color-bg-secondary)' : 'transparent',
                                color: loginMethod === 'magic-link' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: 500
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Sparkles size={16} />
                                <span>Magic Link</span>
                            </div>
                        </button>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            ref={emailRef}
                            className="auth-input"
                            placeholder="johndoe@gmail.com"
                            required
                        />
                    </div>

                    {loginMethod === 'password' && (
                        <div className="input-group">
                            <label className="input-label" htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    ref={passwordRef}
                                    className="auth-input"
                                    placeholder="••••••••"
                                    required
                                    style={{ paddingRight: '3rem' }} // Space for icon
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="auth-actions">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ accentColor: '#ff80ab' }} /> Keep me logged in
                        </label>
                        <Link to="/forgot-password" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Forgot Password</Link>
                    </div>

                    <button disabled={loading} className="auth-button" type="submit">
                        {loginMethod === 'magic-link' ? 'Send Login Link' : 'Sign in'}
                    </button>
                </form>

                <div className="auth-footer" style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        className="social-btn"
                        aria-label="Google"
                        onClick={async () => {
                            try {
                                setError('');
                                setLoading(true);
                                await loginWithGoogle();
                                navigate('/');
                            } catch (err) {
                                console.error('Google login failed:', err);
                                setError('Failed to sign in with Google.');
                                setLoading(false);
                            }
                        }}
                        style={{ width: '100%', maxWidth: '300px', gap: '10px' }}
                    >
                        <span style={{ fontWeight: 'bold', color: '#DB4437', fontSize: '1.2rem' }}>G</span>
                        <span style={{ color: 'var(--color-text-primary)' }}>Continue with Google</span>
                    </button>
                </div>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'white', fontWeight: 600, textDecoration: 'none', marginLeft: '0.25rem' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
