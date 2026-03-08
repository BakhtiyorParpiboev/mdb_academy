import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Trophy, Flame, User, Github, Award, Code, BookOpen, Bookmark,
    Zap, Shield, Gamepad2, Calendar, TrendingUp, Star, Lock, ExternalLink,
    Edit3, Camera, X, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Portfolio.css';

const DAYS_UZ = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];

const ALL_ACHIEVEMENTS = [
    { id: 'first_step', icon: '🏆', title: "Birinchi Qadam", desc: "Ro'yxatdan o'tdi", badgeType: 'first_step' },
    { id: 'fire_5', icon: '🔥', title: "Yong'in!", desc: "5 kunlik streak", badgeType: 'fire_5' },
    { id: 'coder_10', icon: '💻', title: "Kod Ustasi", desc: "10 marta kod yozdi", badgeType: 'coder_10' },
    { id: 'quiz_master', icon: '🧠', title: "Viktorina Ustasi", desc: "5 ta viktorinani tugatdi", badgeType: 'quiz_master' },
    { id: 'perfect', icon: '🎯', title: "Mukammal Ball", desc: "100% to'g'ri javob", badgeType: 'perfect' },
    { id: 'speed', icon: '⚡', title: "Tezkor", desc: "2 daqiqada yakunlash", badgeType: 'speed' },
    { id: 'bug_hunter', icon: '🐛', title: "Bug Hunter", desc: "Barcha xatolarni topish", badgeType: 'bug_hunter' },
    { id: 'streak_30', icon: '💎', title: "30 Kun!", desc: "30 kunlik streak", badgeType: 'streak_30' },
    { id: 'first_project', icon: '🚀', title: "Loyihachi", desc: "Birinchi loyiha yaratdi", badgeType: 'first_project' },
    { id: 'ai_user', icon: '🤖', title: "AI Foydalanuvchi", desc: "AI bilan 10 ta chat", badgeType: 'ai_user' },
];

const Portfolio = () => {
    const { username } = useParams();
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '', lastName: '', bio: '', githubLink: '', profilePic: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentUser) {
                    const token = await currentUser.getIdToken();
                    const [profileRes, activityRes] = await Promise.all([
                        fetch('http://localhost:5000/api/user/profile', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        }),
                        fetch('http://localhost:5000/api/user/activity', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                    ]);

                    if (profileRes.ok) {
                        const data = await profileRes.json();
                        setProfileData(data);
                    }
                    if (activityRes.ok) {
                        const data = await activityRes.json();
                        setActivityData(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    // Derived data
    const user = useMemo(() => ({
        username: profileData?.username || username || 'mehmon',
        fullName: profileData?.firstName && profileData?.lastName
            ? `${profileData.firstName} ${profileData.lastName}`
            : profileData?.username || 'Mehmon Foydalanuvchi',
        firstName: profileData?.firstName || '',
        lastName: profileData?.lastName || '',
        bio: profileData?.bio || "Hali o'ziga ta'rif yozmagan.",
        profilePic: profileData?.profilePic || null,
        githubLink: profileData?.githubLink || null,
        xp: profileData?.xp || 0,
        level: profileData?.level || 1,
        xpForNextLevel: profileData?.xpForNextLevel || 1000,
        xpProgress: profileData?.xpProgress || 0,
        joinedDate: profileData?.createdAt
            ? new Date(profileData.createdAt).toLocaleDateString('uz-UZ')
            : new Date().toLocaleDateString('uz-UZ'),
        streak: profileData?.streak?.currentStreak || 0,
        longestStreak: profileData?.streak?.longestStreak || 0,
        streakFreezes: profileData?.streak?.streakFreezes ?? 2,
        lastActiveDate: profileData?.streak?.lastActiveDate || null,
        savedRoadmaps: profileData?.savedRoadmaps || [],
        xpBreakdown: profileData?.xpBreakdown || {},
        achievements: profileData?.achievements || [],
        portfolioProjects: profileData?.portfolioProject || [],
        xpLogs: profileData?.xpLogs || [],
    }), [profileData, username]);

    // Open edit modal
    const handleOpenEdit = () => {
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            bio: profileData?.bio || '',
            githubLink: profileData?.githubLink || '',
            profilePic: profileData?.profilePic || ''
        });
        setShowEditModal(true);
    };

    // Save profile
    const handleSaveProfile = async () => {
        if (!currentUser) return;
        setSaving(true);
        try {
            const token = await currentUser.getIdToken();
            const res = await fetch('http://localhost:5000/api/user/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                const data = await res.json();
                // Refresh profile data
                setProfileData(prev => ({ ...prev, ...data.user }));
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    // Generate 7-day streak calendar
    const streakWeek = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayIdx = (d.getDay() + 6) % 7;
            const isActive = activityData.some(a => a.date === dateStr && a.actions > 0);
            const isToday = i === 0;
            days.push({ label: DAYS_UZ[dayIdx], date: d.getDate(), isActive, isToday });
        }
        return days;
    }, [activityData]);

    // Heatmap data
    const heatmapCells = useMemo(() => {
        if (activityData.length === 0) {
            const cells = [];
            const today = new Date();
            for (let i = 89; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                cells.push({ date: d.toISOString().split('T')[0], xp: 0, actions: 0 });
            }
            return cells;
        }
        return activityData;
    }, [activityData]);

    const getHeatmapLevel = (xp) => {
        if (xp === 0) return '';
        if (xp <= 20) return 'level-1';
        if (xp <= 50) return 'level-2';
        if (xp <= 100) return 'level-3';
        return 'level-4';
    };

    const achievementsList = useMemo(() => {
        const earnedTypes = new Set(user.achievements.map(a => a.badgeType));
        return ALL_ACHIEVEMENTS.map(ach => ({
            ...ach,
            unlocked: earnedTypes.has(ach.badgeType),
            earnedAt: user.achievements.find(a => a.badgeType === ach.badgeType)?.earnedAt
        }));
    }, [user.achievements]);

    const totalXpBreakdown = useMemo(() => {
        const breakdown = user.xpBreakdown;
        const total = Object.values(breakdown).reduce((s, v) => s + v, 0) || 1;
        return { breakdown, total };
    }, [user.xpBreakdown]);

    const projects = user.portfolioProjects.length > 0
        ? user.portfolioProjects
        : [
            { title: "Kalkulyator", language: "JavaScript", codeSnippet: "Oddiy web kalkulyator." },
            { title: "Shaxsiy blog", language: "HTML/CSS", codeSnippet: "O'zim haqimda ma'lumot sahifasi." }
        ];

    if (loading) {
        return (
            <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                <p style={{ color: 'var(--text-secondary)' }}>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '32px 24px 60px' }}>

            {/* Profile Banner — gradient covers all info */}
            <div className="profile-banner">
                <button className="profile-edit-btn" onClick={handleOpenEdit}>
                    <Edit3 size={15} /> Tahrirlash
                </button>
                <div className="profile-banner-content">
                    <div className="profile-avatar-wrapper">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt={user.username} className="profile-avatar-large" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                <User size={48} />
                            </div>
                        )}
                        <div className="profile-avatar-edit" onClick={handleOpenEdit}>
                            <Camera size={22} />
                        </div>
                        <div className="profile-level-badge">{user.level}</div>
                    </div>

                    <div className="profile-info">
                        <h1>{user.fullName}</h1>
                        <p className="profile-username">@{user.username}</p>
                        <p className="profile-bio">{user.bio}</p>
                        <div className="profile-meta-row">
                            <div className="profile-meta-item">
                                <Calendar size={14} />
                                <span>A'zo: {user.joinedDate}</span>
                            </div>
                            {user.githubLink && (
                                <div className="profile-meta-item">
                                    <Github size={14} />
                                    <a href={user.githubLink} target="_blank" rel="noreferrer">GitHub</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="profile-stats-grid">
                <div className="profile-stat-card">
                    <div className="profile-stat-icon xp"><Zap size={24} /></div>
                    <div>
                        <div className="profile-stat-value">{user.xp.toLocaleString()}</div>
                        <div className="profile-stat-label">Jami XP</div>
                    </div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-icon level"><TrendingUp size={24} /></div>
                    <div style={{ flex: 1 }}>
                        <div className="profile-stat-value">Level {user.level}</div>
                        <div className="profile-stat-label">{user.xp} / {user.xpForNextLevel} XP</div>
                        <div className="level-progress-wrap">
                            <div className="level-progress-bar">
                                <div className="level-progress-fill" style={{ width: `${user.xpProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-icon streak"><Flame size={24} /></div>
                    <div>
                        <div className="profile-stat-value">{user.streak}</div>
                        <div className="profile-stat-label">Joriy Streak</div>
                    </div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-icon longest"><Trophy size={24} /></div>
                    <div>
                        <div className="profile-stat-value">{user.longestStreak}</div>
                        <div className="profile-stat-label">Eng uzun Streak</div>
                    </div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-icon freeze"><Shield size={24} /></div>
                    <div>
                        <div className="profile-stat-value">{user.streakFreezes}</div>
                        <div className="profile-stat-label">Streak Freeze</div>
                    </div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-icon games"><Gamepad2 size={24} /></div>
                    <div>
                        <div className="profile-stat-value">{user.xpLogs.length}</div>
                        <div className="profile-stat-label">Faoliyatlar</div>
                    </div>
                </div>
            </div>

            {/* Streak Calendar + Activity Heatmap */}
            <div className="profile-section profile-layout-full">
                <div className="profile-section-header">
                    <h2><Flame size={22} style={{ color: '#ef4444' }} /> Streak Kalendar</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Oxirgi 90 kun</span>
                </div>
                <div className="streak-week">
                    {streakWeek.map((day, idx) => (
                        <div key={idx} className="streak-day">
                            <span className="streak-day-label">{day.label}</span>
                            <div className={`streak-day-circle ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}>
                                {day.isActive ? '✓' : day.date}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="heatmap-container">
                    <div className="heatmap-grid">
                        {heatmapCells.map((cell, idx) => (
                            <div key={idx} className={`heatmap-cell ${getHeatmapLevel(cell.xp)}`}
                                title={`${cell.date}: ${cell.xp} XP, ${cell.actions} faoliyat`} />
                        ))}
                    </div>
                </div>
                <div className="heatmap-legend">
                    <span>Kam</span>
                    <div className="heatmap-legend-cell" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}></div>
                    <div className="heatmap-legend-cell" style={{ background: 'rgba(34,197,94,0.2)' }}></div>
                    <div className="heatmap-legend-cell" style={{ background: 'rgba(34,197,94,0.4)' }}></div>
                    <div className="heatmap-legend-cell" style={{ background: 'rgba(34,197,94,0.6)' }}></div>
                    <div className="heatmap-legend-cell" style={{ background: '#22c55e' }}></div>
                    <span>Ko'p</span>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="profile-layout">
                {/* Achievements */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <h2><Award size={22} style={{ color: '#a855f7' }} /> Yutuqlar</h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {achievementsList.filter(a => a.unlocked).length}/{achievementsList.length}
                        </span>
                    </div>
                    <div className="achievements-gallery">
                        {achievementsList.map(ach => (
                            <div key={ach.id} className={`achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                                {!ach.unlocked && <Lock size={12} style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--text-secondary)', opacity: 0.5 }} />}
                                <div className="achievement-item-icon">{ach.icon}</div>
                                <h4>{ach.title}</h4>
                                <p>{ach.desc}</p>
                                {ach.unlocked && ach.earnedAt && (
                                    <div className="achievement-date">{new Date(ach.earnedAt).toLocaleDateString('uz-UZ')}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* XP Breakdown */}
                <div className="profile-section">
                    <div className="profile-section-header">
                        <h2><Zap size={22} style={{ color: '#f59e0b' }} /> XP Taqsimoti</h2>
                    </div>
                    {Object.keys(totalXpBreakdown.breakdown).length > 0 ? (
                        <div className="xp-breakdown-list">
                            {Object.entries(totalXpBreakdown.breakdown).map(([source, amount]) => (
                                <div key={source} className="xp-breakdown-row">
                                    <span className="xp-breakdown-label" style={{ textTransform: 'capitalize' }}>{source}</span>
                                    <div className="xp-breakdown-bar-bg">
                                        <div className={`xp-breakdown-bar-fill ${source}`}
                                            style={{ width: `${(amount / totalXpBreakdown.total) * 100}%` }}></div>
                                    </div>
                                    <span className="xp-breakdown-value">{amount} XP</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="profile-empty-state">
                            <p>Hali XP ishlab topilmagan</p>
                            <Link to="/games" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                                <Gamepad2 size={16} /> O'yinlarga o'tish
                            </Link>
                        </div>
                    )}
                    <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={18} style={{ color: '#22c55e' }} /> Saqlangan Yo'l Xaritalari
                        </h3>
                        {user.savedRoadmaps.length > 0 ? (
                            <div className="roadmap-tags">
                                {user.savedRoadmaps.map((rm, idx) => (
                                    <span key={idx} className="roadmap-tag"><Bookmark size={12} /> {rm}</span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                Hali yo'l xaritalar saqlanmagan.{' '}
                                <Link to="/study" style={{ color: 'var(--accent-blue-500)', fontWeight: 600 }}>Topish →</Link>
                            </p>
                        )}
                    </div>
                </div>

                {/* Projects — Full Width */}
                <div className="profile-section profile-layout-full">
                    <div className="profile-section-header">
                        <h2><Code size={22} style={{ color: 'var(--accent-blue-500)' }} /> Portfolio Loyihalari</h2>
                    </div>
                    {projects.length > 0 ? (
                        <div className="portfolio-projects-grid">
                            {projects.map((proj, i) => (
                                <div key={i} className="portfolio-project-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3>{proj.title}</h3>
                                        <span className="project-lang-badge">{proj.language}</span>
                                    </div>
                                    <p>{proj.codeSnippet || proj.description || 'Loyiha tavsifi mavjud emas.'}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="profile-empty-state">
                            <p>Hali loyihalar saqlanmagan.</p>
                            <Link to="/compiler" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                                <Code size={16} /> Kompilyatorga o'tish
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="edit-profile-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
                        <div className="edit-profile-header">
                            <h2>Profilni Tahrirlash</h2>
                            <button className="edit-profile-close" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="edit-profile-body">
                            {/* Avatar Preview */}
                            <div className="edit-avatar-section">
                                {editForm.profilePic ? (
                                    <img src={editForm.profilePic} alt="Preview" className="edit-avatar-preview" />
                                ) : (
                                    <div className="edit-avatar-placeholder-sm">
                                        <User size={36} />
                                    </div>
                                )}
                                <div className="edit-form-group" style={{ width: '100%' }}>
                                    <label>Profil rasmi (URL)</label>
                                    <input
                                        type="url"
                                        className="edit-form-input"
                                        placeholder="https://example.com/photo.jpg"
                                        value={editForm.profilePic}
                                        onChange={e => setEditForm(f => ({ ...f, profilePic: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="edit-form-row">
                                <div className="edit-form-group">
                                    <label>Ism</label>
                                    <input
                                        type="text"
                                        className="edit-form-input"
                                        placeholder="Ismingiz"
                                        value={editForm.firstName}
                                        onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label>Familiya</label>
                                    <input
                                        type="text"
                                        className="edit-form-input"
                                        placeholder="Familiyangiz"
                                        value={editForm.lastName}
                                        onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="edit-form-group">
                                <label>Bio (ta'rif)</label>
                                <textarea
                                    className="edit-form-input textarea"
                                    placeholder="O'zingiz haqingizda qisqacha..."
                                    value={editForm.bio}
                                    onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                                />
                            </div>

                            {/* GitHub Link */}
                            <div className="edit-form-group">
                                <label>GitHub havola</label>
                                <input
                                    type="url"
                                    className="edit-form-input"
                                    placeholder="https://github.com/username"
                                    value={editForm.githubLink}
                                    onChange={e => setEditForm(f => ({ ...f, githubLink: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="edit-profile-footer">
                            <button className="edit-btn-cancel" onClick={() => setShowEditModal(false)}>Bekor qilish</button>
                            <button className="edit-btn-save" onClick={handleSaveProfile} disabled={saving}>
                                <Save size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
