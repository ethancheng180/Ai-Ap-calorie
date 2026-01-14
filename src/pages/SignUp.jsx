import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createUserProfile } from '../services/userDatabase';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { updateProfile } from 'firebase/auth'; // Import updateProfile
import '../styles/Auth.css';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const firstNameRef = useRef(); // New Ref
    const lastNameRef = useRef();  // New Ref
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
            const user = userCredential.user;

            const firstName = firstNameRef.current.value;
            const lastName = lastNameRef.current.value;
            const fullName = `${firstName} ${lastName}`.trim();

            // 1. Update the Auth Profile (so currentUser.displayName works instantly)
            await updateProfile(user, {
                displayName: fullName
            });

            // 2. Create user profile in Firestore with extra details
            await createUserProfile(user, {
                firstName,
                lastName,
                displayName: fullName // Explicitly saving to DB too
            });

            navigate('/');
        } catch (err) {
            console.error(err);
            const errorMessage = err.message ? err.message.replace('Firebase: ', '') : 'Failed to create an account.';
            setError(errorMessage);
        }

        setLoading(false);
    }

    return (
        <div className="auth-container">
            <div className="auth-content">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join us to track your health journey</p>

                {error && <div className="alert-error" style={{ marginBottom: '1rem', color: '#ff4d4f', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name Fields Row */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label" htmlFor="first-name">First Name</label>
                            <input
                                id="first-name"
                                type="text"
                                ref={firstNameRef}
                                className="auth-input"
                                placeholder="John"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label" htmlFor="last-name">Last Name</label>
                            <input
                                id="last-name"
                                type="text"
                                ref={lastNameRef}
                                className="auth-input"
                                placeholder="Doe"
                                required
                            />
                        </div>
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
                                style={{ paddingRight: '3rem' }}
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

                    <div className="input-group">
                        <label className="input-label" htmlFor="password-confirm">Confirm Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password-confirm"
                                type={showConfirmPassword ? 'text' : 'password'}
                                ref={passwordConfirmRef}
                                className="auth-input"
                                placeholder="••••••••"
                                required
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button disabled={loading} className="auth-button" type="submit" style={{ marginTop: '1.5rem' }}>
                        Sign Up
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'white', fontWeight: 600, textDecoration: 'none', marginLeft: '0.25rem' }}>Log In</Link>
                </div>
            </div>
        </div>
    );
}
