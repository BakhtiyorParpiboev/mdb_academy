import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun, Flame, LogOut, User, Menu, X, Zap } from 'lucide-react';

const Header = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { currentUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userStats, setUserStats] = useState({ xp: 0, streak: 0 });

    // Fetch real XP and streak from backend
    useEffect(() => {
        const fetchStats = async () => {
            if (!currentUser) {
                setUserStats({ xp: 0, streak: 0 });
                return;
            }
            try {
                const token = await currentUser.getIdToken();
                const [profileRes, streakRes] = await Promise.all([
                    fetch('http://localhost:5000/api/user/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/streak/status', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                let xp = 0;
                let streak = 0;

                if (profileRes.ok) {
                    const data = await profileRes.json();
                    xp = data.xp || 0;
                }
                if (streakRes.ok) {
                    const data = await streakRes.json();
                    streak = data.currentStreak || 0;
                }

                setUserStats({ xp, streak });

                // Also update streak on page load (triggers daily streak logic)
                fetch('http://localhost:5000/api/streak/update', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                }).catch(() => { });
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchStats();
    }, [currentUser]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container header-content">
                <div className="header-left">
                    <Link to="/" className="logo" onClick={closeMobileMenu}>
                        men dasturchi <span>bo'laman</span>
                    </Link>
                </div>

                {/* Mobile Toggle Button */}
                <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop and Mobile Nav Actions */}
                <div className={`header-actions-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <nav className="nav-links">
                        <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Home
                        </NavLink>
                        <NavLink to="/study" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Study
                        </NavLink>
                        <NavLink to="/ai" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            AI
                        </NavLink>
                        <NavLink to="/games" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Games
                        </NavLink>
                        <NavLink to="/compiler" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Online Compiler
                        </NavLink>
                    </nav>

                    <div className="header-right">
                        {currentUser && (
                            <div className="user-stats">
                                <div className="stat-item stat-xp">
                                    <Zap size={14} />
                                    <span>{userStats.xp.toLocaleString()}</span>
                                </div>
                                <div className="stat-item stat-streak">
                                    <Flame size={16} />
                                    <span>{userStats.streak}</span>
                                </div>
                            </div>
                        )}

                        <div className="theme-toggle" onClick={toggleTheme}>
                            <div className="theme-toggle-switch"></div>
                            <div style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 4px', fontSize: '10px', zIndex: 0, opacity: 0.5 }}>
                                <Moon size={12} color="#f8fafc" style={{ visibility: isDarkMode ? 'visible' : 'hidden' }} />
                                <Sun size={12} color="#0f172a" style={{ visibility: isDarkMode ? 'hidden' : 'visible' }} />
                            </div>
                        </div>

                        {!currentUser ? (
                            <div className="flex gap-2 auth-buttons">
                                <Link to="/login" className="btn btn-outline" onClick={closeMobileMenu}>Sign In</Link>
                                <Link to="/community" className="btn btn-primary" onClick={closeMobileMenu}>Join Us</Link>
                            </div>
                        ) : (
                            <div className="profile-dropdown flex items-center gap-4 border-l border-[var(--border-color)] pl-4 profile-border">
                                <Link to={`/portfolio/${currentUser.displayName || 'user'}`} onClick={closeMobileMenu} className="flex items-center gap-2">
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" className="profile-avatar" />
                                    ) : (
                                        <div className="profile-avatar flex items-center justify-center bg-[var(--accent-blue-100)] text-[var(--accent-blue-700)]">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {currentUser.displayName || 'Foydalanuvchi'}
                                    </span>
                                </Link>
                                <button onClick={() => { logout(); closeMobileMenu(); }} className="text-[var(--text-secondary)] hover:text-[var(--streak-color)] transition-colors" title="Log out">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
