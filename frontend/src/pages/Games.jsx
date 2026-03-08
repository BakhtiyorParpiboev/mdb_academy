import React, { useState } from 'react';
import {
    Gamepad2, BrainCircuit, PenTool, Search, Eye, ArrowUpDown, Trophy, Users,
    Zap, Star, Play, Lock, Flame, Target, Medal
} from 'lucide-react';
import './Games.css';

import QuizGame from './games/QuizGame';
import CodeCompletionGame from './games/CodeCompletionGame';
import BugFinderGame from './games/BugFinderGame';
import OutputPredictorGame from './games/OutputPredictorGame';
import FlashcardGame from './games/FlashcardGame';
import DragDropGame from './games/DragDropGame';

const CATEGORIES = [
    { id: 'all', label: 'Hammasi' },
    { id: 'html', label: 'HTML & CSS' },
    { id: 'js', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'mixed', label: 'Aralash' }
];

const GAMES_LIST = [
    {
        id: 'quiz',
        title: "Dasturlash Viktorinasi",
        desc: "HTML, CSS, JS va Python bo'yicha tezkor savollar. Vaqt bilan bellashasiz! Combo tizimi bilan ko'proq XP ishlang.",
        icon: <BrainCircuit size={28} />,
        color: 'purple',
        iconColor: '#a855f7',
        difficulty: 'easy',
        difficultyLabel: 'Oson',
        xp: '+50 XP',
        players: '1,247',
        langs: ['HTML', 'CSS', 'JS', 'Python'],
        categories: ['all', 'mixed'],
        isNew: false,
        component: 'quiz'
    },
    {
        id: 'completion',
        title: "Kodni Tugallash",
        desc: "Chala qoldirilgan kod qatorlarini o'rniga to'g'ri sintaksisni yozib chiqing. Maslahat tizimi mavjud!",
        icon: <PenTool size={28} />,
        color: 'blue',
        iconColor: '#3b82f6',
        difficulty: 'medium',
        difficultyLabel: "O'rta",
        xp: '+100 XP',
        players: '983',
        langs: ['HTML', 'CSS', 'JS', 'Python'],
        categories: ['all', 'mixed'],
        isNew: false,
        component: 'completion'
    },
    {
        id: 'bugfinder',
        title: "Xatoni Top! (Bug Finder)",
        desc: "Berilgan kodda xato yashiringan. Qaysi qatorda ekanini toping va to'g'rilang. Haqiqiy debugging tajribasi!",
        icon: <Search size={28} />,
        color: 'red',
        iconColor: '#ef4444',
        difficulty: 'hard',
        difficultyLabel: 'Qiyin',
        xp: '+150 XP',
        players: '756',
        langs: ['HTML', 'CSS', 'JS', 'Python'],
        categories: ['all', 'mixed'],
        isNew: false,
        component: 'bugfinder'
    },
    {
        id: 'output',
        title: "Natijani Bashorat Qil",
        desc: "Kod ko'rsatiladi — natijasini oldindan aytib bering! JavaScript va Python ning qiziq qoidalarini o'rganing.",
        icon: <Eye size={28} />,
        color: 'cyan',
        iconColor: '#06b6d4',
        difficulty: 'hard',
        difficultyLabel: 'Qiyin',
        xp: '+120 XP',
        players: '521',
        langs: ['JS', 'Python'],
        categories: ['all', 'js', 'python'],
        isNew: true,
        component: 'output'
    },
    {
        id: 'dragdrop',
        title: "Kod Tartibchisi",
        desc: "Aralashtirilgan kod qatorlarini to'g'ri tartibga keltiring. Drag-and-drop yoki ↑↓ tugmalar bilan!",
        icon: <ArrowUpDown size={28} />,
        color: 'amber',
        iconColor: '#f59e0b',
        difficulty: 'medium',
        difficultyLabel: "O'rta",
        xp: '+100 XP',
        players: '634',
        langs: ['HTML', 'CSS', 'JS', 'Python'],
        categories: ['all', 'mixed'],
        isNew: true,
        component: 'dragdrop'
    },
    {
        id: 'flashcard',
        title: "Flashcard Sprint",
        desc: "Sintaksis va uning vazifasini moslashtiring! Xotira o'yini — tezroq tugatgan ko'proq XP oladi.",
        icon: <Gamepad2 size={28} />,
        color: 'green',
        iconColor: '#22c55e',
        difficulty: 'easy',
        difficultyLabel: 'Oson',
        xp: '+80 XP',
        players: '1,102',
        langs: ['HTML', 'CSS', 'JS'],
        categories: ['all', 'html', 'js'],
        isNew: false,
        component: 'flashcard'
    },
    {
        id: 'htmlbuilder',
        title: "HTML Quruvchi",
        desc: "Berilgan dizaynga mos HTML kod yozing. Vizual natijani real-time ko'ring!",
        icon: <Target size={28} />,
        color: 'pink',
        iconColor: '#ec4899',
        difficulty: 'medium',
        difficultyLabel: "O'rta",
        xp: '+130 XP',
        players: '412',
        langs: ['HTML', 'CSS'],
        categories: ['all', 'html'],
        isNew: true,
        component: null
    },
    {
        id: 'speedtype',
        title: "Kod Jangchisi",
        desc: "Vaqtga qarshi kod yozing! Tezlik va aniqlik baholanadi. Leaderboard-da yuqori o'rin egallang!",
        icon: <Flame size={28} />,
        color: 'indigo',
        iconColor: '#6366f1',
        difficulty: 'hard',
        difficultyLabel: 'Qiyin',
        xp: '+200 XP',
        players: '289',
        langs: ['JS', 'Python'],
        categories: ['all', 'js', 'python'],
        isNew: true,
        component: null
    }
];

const LEADERBOARD = [
    { rank: 1, name: "Javohir_Dev", games: 47, xp: 2840, initial: 'J' },
    { rank: 2, name: "Malika_Coder", games: 43, xp: 2615, initial: 'M' },
    { rank: 3, name: "Sardor_JS", games: 39, xp: 2380, initial: 'S' },
    { rank: 4, name: "Dilnoza_Web", games: 35, xp: 2100, initial: 'D' },
    { rank: 5, name: "Abbos_Python", games: 31, xp: 1890, initial: 'A' }
];

const ACHIEVEMENTS = [
    { icon: '🏆', title: "Birinchi O'yin", desc: "Birinchi o'yinni tugatish", unlocked: true },
    { icon: '🔥', title: "3 Kun Streak", desc: "3 kun ketma-ket o'ying", unlocked: true },
    { icon: '🎯', title: "Mukammal Ball", desc: "100% to'g'ri javob", unlocked: false },
    { icon: '⚡', title: "Speed Demon", desc: "Viktorinani 2 daqiqada tugatish", unlocked: false },
    { icon: '🐛', title: "Bug Hunter", desc: "Barcha xatolarni topish", unlocked: false },
    { icon: '🧠', title: "Genius", desc: "5 ta o'yindan 4 tasida g'alaba", unlocked: false }
];

const Games = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeGame, setActiveGame] = useState(null);
    const [totalXP, setTotalXP] = useState(0);

    const filteredGames = GAMES_LIST.filter(g => g.categories.includes(activeCategory));

    const handleGameClick = (game) => {
        if (!game.component) return;
        setActiveGame(game.component);
    };

    const handleCloseGame = () => {
        setActiveGame(null);
    };

    const handleXPEarned = (earnedXP) => {
        setTotalXP(prev => prev + earnedXP);
    };

    const renderGame = () => {
        switch (activeGame) {
            case 'quiz': return <QuizGame onClose={handleCloseGame} onXPEarned={handleXPEarned} />;
            case 'completion': return <CodeCompletionGame onClose={handleCloseGame} onXPEarned={handleXPEarned} />;
            case 'bugfinder': return <BugFinderGame onClose={handleCloseGame} onXPEarned={handleXPEarned} />;
            case 'output': return <OutputPredictorGame onClose={handleCloseGame} onXPEarned={handleXPEarned} />;
            case 'dragdrop': return <DragDropGame onClose={handleCloseGame} onXPEarned={handleXPEarned} />;
            case 'flashcard': return <FlashcardGame onClose={handleCloseGame} onXPEarned={handleXPEarned} />;
            default: return null;
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '60px' }}>
            {/* Hero Section */}
            <div className="games-hero">
                <div className="games-hero-icon">
                    <Gamepad2 size={40} />
                </div>
                <h1>Dasturlash O'yinlari</h1>
                <p className="games-hero-subtitle">
                    O'qish har doim ham zerikarli bo'lishi shart emas. Har xil turdagi minio'yinlar orqali miyangizni charxlang
                    va bir vaqtning o'zida reytingingizni (XP) oshirib boring!
                </p>
                <div className="games-live-stats">
                    <div className="live-stat">
                        <div className="live-stat-dot"></div>
                        <Gamepad2 size={14} /> <span>3,847 o'yin o'ynalgan</span>
                    </div>
                    <div className="live-stat">
                        <Users size={14} /> <span>524 faol o'yinchi</span>
                    </div>
                    {totalXP > 0 && (
                        <div className="live-stat" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                            <Zap size={14} style={{ color: '#f59e0b' }} /> <span style={{ color: '#f59e0b' }}>Siz: +{totalXP} XP</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="games-filter-bar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Games Grid */}
            <div className="games-grid">
                {filteredGames.map(game => (
                    <div
                        key={game.id}
                        className="game-card"
                        onClick={() => handleGameClick(game)}
                        style={!game.component ? { opacity: 0.7 } : {}}
                    >
                        <div className="game-card-header">
                            <div className={`game-card-icon-wrap ${game.color}`}>
                                {React.cloneElement(game.icon, { style: { color: game.iconColor } })}
                            </div>
                            <div className="game-card-badges">
                                <span className={`difficulty-badge ${game.difficulty}`}>
                                    {game.difficultyLabel}
                                </span>
                                {game.isNew && <span className="new-badge">YANGI</span>}
                            </div>
                        </div>

                        <div className="game-card-body">
                            <h3>{game.title}</h3>
                            <p>{game.desc}</p>
                            <div className="game-card-langs">
                                {game.langs.map(lang => (
                                    <span key={lang} className="lang-tag">{lang}</span>
                                ))}
                            </div>
                        </div>

                        <div className="game-card-footer">
                            <div className="game-card-stats">
                                <span className="game-stat xp">
                                    <Zap size={14} /> {game.xp}
                                </span>
                                <span className="game-stat players">
                                    <Users size={12} /> {game.players}
                                </span>
                            </div>
                            {game.component ? (
                                <button className="play-btn" onClick={(e) => { e.stopPropagation(); handleGameClick(game); }}>
                                    <Play size={14} /> O'ynash
                                </button>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <Lock size={14} /> Tez kunda
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Leaderboard Section */}
            <div className="games-leaderboard-section">
                <div className="leaderboard-header">
                    <h2><Trophy size={24} style={{ color: '#f59e0b' }} /> Top O'yinchilar</h2>
                </div>
                <div className="leaderboard-card">
                    {LEADERBOARD.map(player => (
                        <div key={player.rank} className="leaderboard-row">
                            <span className={`leaderboard-rank ${player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : 'normal'
                                }`}>
                                {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                            </span>
                            <div className="leaderboard-avatar">{player.initial}</div>
                            <div className="leaderboard-info">
                                <div className="leaderboard-name">{player.name}</div>
                                <div className="leaderboard-games">{player.games} o'yin o'ynagan</div>
                            </div>
                            <span className="leaderboard-xp">
                                <Zap size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                {player.xp.toLocaleString()} XP
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="games-achievements-section">
                <div className="achievements-header">
                    <h2><Medal size={24} style={{ color: '#a855f7' }} /> Yutuqlar</h2>
                </div>
                <div className="achievements-grid">
                    {ACHIEVEMENTS.map((ach, idx) => (
                        <div key={idx} className={`achievement-card ${!ach.unlocked ? 'locked' : ''}`}>
                            {!ach.unlocked && <Lock size={14} className="achievement-lock" />}
                            <div className="achievement-icon">{ach.icon}</div>
                            <h4>{ach.title}</h4>
                            <p>{ach.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Game Modal */}
            {activeGame && renderGame()}
        </div>
    );
};

export default Games;
