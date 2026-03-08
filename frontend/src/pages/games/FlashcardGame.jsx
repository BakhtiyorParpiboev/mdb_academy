import React, { useState, useEffect, useCallback } from 'react';
import { X, Zap, RotateCcw, Trophy, Clock, Gamepad2 } from 'lucide-react';

const CARD_PAIRS = [
    { syntax: '<a>', description: 'Havola yaratish' },
    { syntax: 'display: flex', description: 'Flexbox layout' },
    { syntax: 'console.log()', description: 'Konsolga yozish' },
    { syntax: 'addEventListener()', description: 'Hodisa qo\'shish' },
    { syntax: 'querySelector()', description: 'Element tanlash' },
    { syntax: 'position: absolute', description: 'Mutlaq joylash' },
    { syntax: 'Array.map()', description: 'Massiv almashtirish' },
    { syntax: 'border-radius', description: 'Burchak yumalatish' },
];

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function FlashcardGame({ onClose, onXPEarned }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [xp, setXp] = useState(0);

    useEffect(() => {
        initGame();
    }, []);

    useEffect(() => {
        if (gameOver || cards.length === 0) return;
        const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, [gameOver, cards]);

    const initGame = () => {
        const gameCards = [];
        CARD_PAIRS.forEach((pair, idx) => {
            gameCards.push({ id: idx * 2, pairId: idx, text: pair.syntax, type: 'syntax' });
            gameCards.push({ id: idx * 2 + 1, pairId: idx, text: pair.description, type: 'description' });
        });
        setCards(shuffle(gameCards));
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setTimeElapsed(0);
        setGameOver(false);
        setXp(0);
    };

    const handleCardClick = (cardId) => {
        if (flipped.length >= 2) return;
        if (flipped.includes(cardId)) return;
        if (matched.includes(cardId)) return;

        const newFlipped = [...flipped, cardId];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [first, second] = newFlipped;
            const card1 = cards.find(c => c.id === first);
            const card2 = cards.find(c => c.id === second);

            if (card1.pairId === card2.pairId && card1.type !== card2.type) {
                const newMatched = [...matched, first, second];
                setMatched(newMatched);
                setFlipped([]);
                const earned = 5;
                setXp(x => x + earned);

                if (newMatched.length === cards.length) {
                    const timeBonus = Math.max(0, 30 - Math.floor(timeElapsed / 5));
                    const moveBonus = Math.max(0, 20 - moves);
                    const totalXP = xp + earned + timeBonus + moveBonus;
                    setXp(totalXP);
                    setTimeout(() => {
                        setGameOver(true);
                        if (onXPEarned) onXPEarned(totalXP);
                    }, 600);
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (gameOver) {
        return (
            <div className="game-play-overlay" onClick={onClose}>
                <div className="game-play-modal" onClick={e => e.stopPropagation()}>
                    <div className="game-modal-header">
                        <div className="game-modal-title">
                            <Gamepad2 size={24} style={{ color: '#22c55e' }} />
                            <h2>Flashcard Sprint — Natijalar</h2>
                        </div>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className="game-modal-body">
                        <div className="game-results">
                            <div className="game-results-icon">🎴🏆</div>
                            <h2>Barcha juftliklar topildi!</h2>
                            <p>Siz {moves} ta urinishda {CARD_PAIRS.length} ta juftlikni topdingiz</p>
                            <div className="results-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{moves}</div>
                                    <div className="result-stat-label">Urinishlar</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value" style={{ color: '#22c55e' }}>{formatTime(timeElapsed)}</div>
                                    <div className="result-stat-label">Vaqt</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value" style={{ color: '#f59e0b' }}>+{xp}</div>
                                    <div className="result-stat-label">XP</div>
                                </div>
                            </div>
                            <div className="game-results-actions">
                                <button className="btn btn-outline" onClick={initGame}><RotateCcw size={16} /> Qayta</button>
                                <button className="btn btn-primary" onClick={onClose}><Trophy size={16} /> Yakunlash</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-play-overlay" onClick={onClose}>
            <div className="game-play-modal" onClick={e => e.stopPropagation()}>
                <div className="game-modal-header">
                    <div className="game-modal-title">
                        <Gamepad2 size={24} style={{ color: '#22c55e' }} />
                        <h2>Flashcard Sprint</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="game-xp-earned"><Zap size={14} /> {xp} XP</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {formatTime(timeElapsed)}
                        </span>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>
                <div className="game-modal-body">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', textAlign: 'center' }}>
                        Sintaksis va uning tavsifini moslashtiring! ({matched.length / 2}/{CARD_PAIRS.length} topildi, {moves} urinish)
                    </p>

                    <div className="flashcard-grid">
                        {cards.map(card => {
                            const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                            const isMatched = matched.includes(card.id);
                            return (
                                <div
                                    key={card.id}
                                    className={`flashcard ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                                    onClick={() => handleCardClick(card.id)}
                                >
                                    <div className="flashcard-inner">
                                        <div className="flashcard-front">?</div>
                                        <div className="flashcard-back" style={{
                                            fontSize: card.type === 'syntax' ? '0.72rem' : '0.7rem',
                                            fontFamily: card.type === 'syntax' ? "'Fira Code', monospace" : 'inherit',
                                            color: card.type === 'syntax' ? 'var(--accent-blue-500)' : 'var(--text-primary)'
                                        }}>
                                            {card.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
