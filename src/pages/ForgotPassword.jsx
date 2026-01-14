import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

export default function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage('Success! Check your inbox for password reset instructions.');
        } catch (err) {
            // "auth/user-not-found" is the key error to handle specifically
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else {
                setError('Failed to reset password. Please try again.');
            }
            console.error(err);
        }

        setLoading(false);
    }

    return (
        <div className="auth-container">
            <div className="auth-content">
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">Enter your email to receive a reset link.</p>

                {error && <div className="alert-error" style={{ marginBottom: '1rem', color: '#ff4d4f', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}
                {message && <div className="alert-success" style={{ marginBottom: '1rem', color: '#34C759', background: 'rgba(52,199,89,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <button disabled={loading} className="auth-button" type="submit">
                        Reset Password
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
