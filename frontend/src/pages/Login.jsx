import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup, loginWithGoogle, loginWithGithub } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, { username, firstName, lastName, phoneNumber });
            }
            navigate('/');
        } catch (err) {
            console.error("Auth error:", err);
            if (err.code === 'auth/invalid-credential') {
                setError("Email yoki parol noto'g'ri kiritildi.");
            } else if (err.code === 'auth/user-not-found') {
                setError("Foydalanuvchi topilmadi. Iltimos ro'yxatdan o'ting.");
            } else if (err.code === 'auth/wrong-password') {
                setError("Parol noto'g'ri kiritildi.");
            } else if (err.code === 'auth/email-already-in-use') {
                setError("Bu email allaqachon ro'yxatdan o'tgan.");
            } else if (err.code === 'auth/weak-password') {
                setError("Parol juda oddiy. Kamida 6 ta belgi kiriting.");
            } else {
                setError(err.message || "Tizimga kirishda xatolik yuz berdi.");
            }
        }
        setLoading(false);
    };

    const handleProviderLogin = async (providerFunc) => {
        setError('');
        setLoading(true);
        try {
            await providerFunc();
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to authenticate');
        }
        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="card login-card">
                <h2 className="login-title">
                    {isLogin ? 'Tizimga Kirish' : "Ro'yxatdan O'tish"}
                </h2>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Ism</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="form-input"
                                    placeholder="Ism"
                                />
                            </div>
                            <div className="form-group">
                                <label>Familiya</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="form-input"
                                    placeholder="Familiya"
                                />
                            </div>
                            <div className="form-group">
                                <label>Telefon Raqam</label>
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="form-input"
                                    placeholder="+998..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Foydalanuvchi nomi</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="form-input"
                                    placeholder="Username"
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Parol</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Parol"
                        />
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="btn btn-primary submit-btn"
                    >
                        {isLogin ? 'Kirish' : "Ro'yxatdan O'tish"}
                    </button>
                </form>

                <div className="login-divider">
                    <div className="divider-line"></div>
                    <span>Yoki</span>
                </div>

                <div className="provider-login">
                    <button
                        disabled={loading}
                        onClick={() => handleProviderLogin(loginWithGoogle)}
                        className="btn btn-outline provider-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px', height: '20px' }} />
                        Google orqali kiring
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => handleProviderLogin(loginWithGithub)}
                        className="btn btn-outline provider-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <img src="https://github.githubassets.com/favicons/favicon.png" alt="GitHub" style={{ width: '20px', height: '20px' }} />
                        GitHub orqali kiring
                    </button>
                </div>

                <div className="login-footer">
                    <span>
                        {isLogin ? "Akkountingiz yo'qmi?" : "Akkountingiz bormi?"}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="toggle-login-btn"
                    >
                        {isLogin ? "Ro'yxatdan O'tish" : 'Tizimga Kirish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
