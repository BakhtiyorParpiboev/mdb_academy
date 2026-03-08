import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen, Terminal, Gamepad2, BrainCircuit, Users, ArrowRight,
    Zap, Trophy, Shield, Rocket, Code, Award, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const CODE_LINES = [
    { parts: [{ text: '# ', cls: 'comment' }, { text: "O'zbek tilida dasturlash", cls: 'comment' }] },
    { parts: [{ text: 'def ', cls: 'keyword' }, { text: 'salom', cls: 'func' }, { text: '(ism):', cls: 'punc' }] },
    { parts: [{ text: '    ', cls: '' }, { text: 'print', cls: 'func' }, { text: '(', cls: 'punc' }, { text: 'f"Salom, {ism}! 🚀"', cls: 'string' }, { text: ')', cls: 'punc' }] },
    { parts: [] },
    { parts: [{ text: 'salom', cls: 'func' }, { text: '(', cls: 'punc' }, { text: '"Dasturchi"', cls: 'string' }, { text: ')', cls: 'punc' }] },
    { parts: [{ text: '# >>> ', cls: 'comment' }, { text: 'Salom, Dasturchi! 🚀', cls: 'string' }] },
];

const LANGUAGES = [
    { name: 'Python', icon: '🐍', color: 'rgba(59, 130, 246, 0.1)', desc: "Eng mashhur til" },
    { name: 'JavaScript', icon: '⚡', color: 'rgba(245, 158, 11, 0.1)', desc: "Web dasturlash" },
    { name: 'HTML', icon: '🌐', color: 'rgba(239, 68, 68, 0.1)', desc: "Web sahifalar" },
    { name: 'CSS', icon: '🎨', color: 'rgba(139, 92, 246, 0.1)', desc: "Dizayn va stil" },
    { name: 'C++', icon: '⚙️', color: 'rgba(6, 182, 212, 0.1)', desc: "Tizim dasturlash" },
    { name: 'Java', icon: '☕', color: 'rgba(34, 197, 94, 0.1)', desc: "Ilova yaratish" },
];

const TESTIMONIALS = [
    {
        quote: "Bu platformada Python-ni o'rganib, 3 oyda birinchi dasturimni yozdim. Hamma narsa o'zbek tilida bo'lgani juda zo'r!",
        name: "Jasurbek T.", role: "Talaba, TATU", color: "#3b82f6"
    },
    {
        quote: "AI yordamchi va o'yinlar tufayli dasturlash zerikarli emas! XP va streak tuzilishi motivatsiya beradi.",
        name: "Madina K.", role: "Frontend Developer", color: "#8b5cf6"
    },
    {
        quote: "Kompilyator va darslarning birgalikda ishlashi — hech qayerda bunday qulay tizim ko'rmaganman.",
        name: "Sardor R.", role: "Freelancer", color: "#22c55e"
    },
];

const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [typedLines, setTypedLines] = useState(0);

    // Typing animation
    useEffect(() => {
        if (typedLines < CODE_LINES.length) {
            const timer = setTimeout(() => setTypedLines(prev => prev + 1), 600);
            return () => clearTimeout(timer);
        }
    }, [typedLines]);

    const handleStart = (e) => {
        e.preventDefault();
        navigate(currentUser ? '/study' : '/login');
    };

    return (
        <div className="home-page">
            {/* ━━━ HERO ━━━ */}
            <section className="home-hero">
                <div className="container">
                    <div className="home-hero-badge">
                        <Sparkles size={14} /> O'zbek tilidagi #1 dasturlash platformasi
                    </div>
                    <h1>
                        Zamonaviy Dasturlashni<br />
                        <span>O'zbek Tilida O'rganing</span>
                    </h1>
                    <p className="home-hero-sub">
                        Interaktiv darslar, AI yordamchi, dasturlash o'yinlari va onlayn kompilyator —
                        hammasi bir joyda. Bepul boshlang va kelajagingizni bugun quring.
                    </p>
                    <div className="home-hero-actions">
                        <button onClick={handleStart} className="home-hero-btn primary">
                            <Rocket size={18} /> Hoziroq Boshlash
                        </button>
                        <Link to="/compiler" className="home-hero-btn secondary">
                            <Terminal size={18} /> Kodni Sinash
                        </Link>
                    </div>

                    {/* Animated Code Block */}
                    <div className="home-code-preview">
                        <div className="home-code-header">
                            <div className="home-code-dot" style={{ background: '#ef4444' }}></div>
                            <div className="home-code-dot" style={{ background: '#f59e0b' }}></div>
                            <div className="home-code-dot" style={{ background: '#22c55e' }}></div>
                            <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>main.py</span>
                        </div>
                        <div className="home-code-body">
                            {CODE_LINES.slice(0, typedLines).map((line, i) => (
                                <div key={i}>
                                    {line.parts.length === 0 ? <br /> : line.parts.map((p, j) => (
                                        <span key={j} className={p.cls}>{p.text}</span>
                                    ))}
                                </div>
                            ))}
                            {typedLines < CODE_LINES.length && <span className="typing-cursor"></span>}
                        </div>
                    </div>

                    {/* Hero Stats */}
                    <div className="home-stats-row">
                        <div className="home-stat">
                            <div className="home-stat-num">1000+</div>
                            <div className="home-stat-label">Foydalanuvchilar</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-num">6+</div>
                            <div className="home-stat-label">Dasturlash Tillari</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-num">50+</div>
                            <div className="home-stat-label">Interaktiv Darslar</div>
                        </div>
                        <div className="home-stat">
                            <div className="home-stat-num">24/7</div>
                            <div className="home-stat-label">AI Yordam</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ━━━ LANGUAGE CARDS ━━━ */}
            <section className="home-langs">
                <div className="container">
                    <div className="home-section-header">
                        <h2>Qaysi Tilni O'rganmoqchisiz?</h2>
                        <p>Eng mashhur dasturlash tillarini tanlang va hoziroq boshlang</p>
                    </div>
                    <div className="home-langs-grid">
                        {LANGUAGES.map(lang => (
                            <Link key={lang.name} to="/study" className="home-lang-card">
                                <div className="home-lang-icon" style={{ background: lang.color }}>
                                    {lang.icon}
                                </div>
                                <h3>{lang.name}</h3>
                                <p>{lang.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ HOW IT WORKS ━━━ */}
            <section className="home-how">
                <div className="container">
                    <div className="home-section-header">
                        <h2>Qanday Ishlaydi?</h2>
                        <p>3 oddiy qadamda dasturchi bo'ling</p>
                    </div>
                    <div className="home-how-steps">
                        <div className="home-how-step">
                            <div className="home-how-num">1</div>
                            <h3>O'rganing</h3>
                            <p>O'zbek tilidagi interaktiv darslar va video qo'llanmalar bilan nazariyani o'zlashtiring.</p>
                        </div>
                        <div className="home-how-step">
                            <div className="home-how-num">2</div>
                            <h3>Mashq Qiling</h3>
                            <p>Onlayn kompilyatorda kod yozing, o'yinlarda bellashing va AI bilan savollaringizni hal qiling.</p>
                        </div>
                        <div className="home-how-step">
                            <div className="home-how-num">3</div>
                            <h3>Yarating</h3>
                            <p>O'z loyihalaringizni yarating, portfoliongizni to'ldiring va ish bozorida ajralib turing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ━━━ FEATURES ━━━ */}
            <section className="home-features">
                <div className="container">
                    <div className="home-section-header">
                        <h2>Platformamiz Imkoniyatlari</h2>
                        <p>Nima uchun "Men Dasturchi Bo'laman"?</p>
                    </div>
                    <div className="home-features-grid">
                        <Link to="/study" className="home-feature-card">
                            <div className="home-feature-icon blue"><BookOpen size={26} /></div>
                            <h3>Interaktiv Darslar</h3>
                            <p>HTML, CSS, JavaScript, Python va boshqa zamonaviy tillarni amaliy misollar va o'zbek tilidagi izohlar bilan o'rganing.</p>
                        </Link>
                        <Link to="/ai" className="home-feature-card">
                            <div className="home-feature-badge">Yangi ✨</div>
                            <div className="home-feature-icon purple"><BrainCircuit size={26} /></div>
                            <h3>AI Yordamchi</h3>
                            <p>Sun'iy intellekt yordamida savollaringizga javob oling, koddagi xatolarni toping va tushuntirishlar oling.</p>
                        </Link>
                        <Link to="/games" className="home-feature-card">
                            <div className="home-feature-icon red"><Gamepad2 size={26} /></div>
                            <h3>Dasturlash O'yinlari</h3>
                            <p>6 xil interaktiv o'yinda kod yozib XP va daraja yig'ing. Viktorina, bug finder, kodda tashla va boshqalar.</p>
                        </Link>
                        <Link to="/compiler" className="home-feature-card">
                            <div className="home-feature-icon teal"><Terminal size={26} /></div>
                            <h3>Onlayn Kompilyator</h3>
                            <p>Brauzeringizda Python, JavaScript, C++, Java va boshqa tillarda kod yozib, natijasini darhol ko'ring.</p>
                        </Link>
                        <Link to="/community" className="home-feature-card">
                            <div className="home-feature-icon green"><Users size={26} /></div>
                            <h3>Hamjamiyat</h3>
                            <p>Boshqa o'quvchilar bilan bellashing, reytingda peshqadam bo'ling, global leaderboardda o'rin oling.</p>
                        </Link>
                        <Link to={currentUser ? `/portfolio/${currentUser.displayName || 'user'}` : '/login'} className="home-feature-card">
                            <div className="home-feature-icon amber"><Award size={26} /></div>
                            <h3>Portfolio & Yutuqlar</h3>
                            <p>Streak, XP, daraja va yutuqlaringizni kuzating. Shaxsiy portfolio sahifangizni yarating va ko'rsating.</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━ BIG STATS ━━━ */}
            <section className="home-big-stats">
                <div className="container home-big-stats-inner">
                    <h2>Raqamlar O'zlari Gapiradi</h2>
                    <div className="home-big-stats-grid">
                        <div className="home-big-stat">
                            <div className="home-big-stat-icon">👨‍💻</div>
                            <div className="home-big-stat-num">1,000+</div>
                            <div className="home-big-stat-label">O'quvchilar</div>
                        </div>
                        <div className="home-big-stat">
                            <div className="home-big-stat-icon">📚</div>
                            <div className="home-big-stat-num">50+</div>
                            <div className="home-big-stat-label">Darslar</div>
                        </div>
                        <div className="home-big-stat">
                            <div className="home-big-stat-icon">🎮</div>
                            <div className="home-big-stat-num">6</div>
                            <div className="home-big-stat-label">O'yinlar</div>
                        </div>
                        <div className="home-big-stat">
                            <div className="home-big-stat-icon">🤖</div>
                            <div className="home-big-stat-num">24/7</div>
                            <div className="home-big-stat-label">AI Yordam</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ━━━ TESTIMONIALS ━━━ */}
            <section className="home-testimonials">
                <div className="container">
                    <div className="home-section-header">
                        <h2>O'quvchilarimiz Nima Deyishadi</h2>
                        <p>Minglab o'quvchilar allaqachon o'rganishni boshlagan</p>
                    </div>
                    <div className="home-testimonials-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="home-testimonial-card">
                                <p className="home-testimonial-quote">{t.quote}</p>
                                <div className="home-testimonial-author">
                                    <div className="home-testimonial-avatar" style={{ background: t.color }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="home-testimonial-name">{t.name}</div>
                                        <div className="home-testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ CTA ━━━ */}
            <section className="home-cta">
                <div className="container home-cta-inner">
                    <h2>Kelajagingizni Bugun Boshlang!</h2>
                    <p>
                        Dasturlash o'rganish hech qachon kech emas. Bepul ro'yxatdan o'ting
                        va o'zbek tilidagi eng zamonaviy dasturlash platformasida o'z yo'lingizni toping.
                    </p>
                    <button onClick={handleStart} className="home-cta-btn">
                        <Rocket size={20} /> Bepul Boshlash <ArrowRight size={18} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
