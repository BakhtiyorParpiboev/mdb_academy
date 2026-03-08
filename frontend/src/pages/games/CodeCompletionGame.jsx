import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, PenTool } from 'lucide-react';

const CHALLENGES = [
    {
        category: 'HTML',
        instruction: "HTML-da havola yaratish uchun bo'sh joyni to'ldiring:",
        codeBefore: '<',
        codeAfter: ' href="https://example.com">Havola</a>',
        answer: 'a',
        hint: "Anchor (langar) tegi"
    },
    {
        category: 'CSS',
        instruction: "Elementga ichki bo'shliq qo'shish uchun CSS xususiyatini yozing:",
        codeBefore: '.box {\n  ',
        codeAfter: ': 20px;\n}',
        answer: 'padding',
        hint: "Ichki bo'shliq = ..."
    },
    {
        category: 'JavaScript',
        instruction: "Konsolga xabar chiqarish uchun to'ldiring:",
        codeBefore: '',
        codeAfter: '("Salom, Dunyo!");',
        answer: 'console.log',
        hint: "console.??? — konsolga yozish buyrug'i"
    },
    {
        category: 'Python',
        instruction: "Python-da funksiya e'lon qilish uchun kalit so'zni yozing:",
        codeBefore: '',
        codeAfter: ' salom():\n    print("Salom!")',
        answer: 'def',
        hint: "define ning qisqartmasi"
    },
    {
        category: 'CSS',
        instruction: "Elementlarni gorizontal joylash uchun CSS xususiyatini yozing:",
        codeBefore: '.container {\n  display: ',
        codeAfter: ';\n}',
        answer: 'flex',
        hint: "Zamonaviy layout tizimi"
    },
    {
        category: 'JavaScript',
        instruction: "Massivga yangi element qo'shish metodini yozing:",
        codeBefore: 'const arr = [1, 2, 3];\narr.',
        codeAfter: '(4);',
        answer: 'push',
        hint: "Massiv oxiriga element qo'shadi"
    },
    {
        category: 'HTML',
        instruction: "HTML-da rasm qo'shish tegini yozing:",
        codeBefore: '<',
        codeAfter: ' src="rasm.png" alt="Rasm">',
        answer: 'img',
        hint: "Image so'zidan olingan"
    },
    {
        category: 'Python',
        instruction: "Python-da sikl yaratish kalit so'zini yozing:",
        codeBefore: '',
        codeAfter: ' i in range(10):\n    print(i)',
        answer: 'for',
        hint: "Takrorlanuvchi sikl uchun kalit so'z"
    }
];

export default function CodeCompletionGame({ onClose, onXPEarned }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [xp, setXp] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45);
    const [gameOver, setGameOver] = useState(false);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        if (answered || gameOver) return;
        if (timeLeft <= 0) {
            handleCheck();
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, answered, gameOver]);

    const handleCheck = () => {
        const correct = userInput.trim().toLowerCase() === CHALLENGES[currentIdx].answer.toLowerCase();
        setIsCorrect(correct);
        setAnswered(true);
        if (correct) {
            setScore(s => s + 1);
            const earned = showHint ? 8 : 15;
            setXp(x => x + earned);
        }
    };

    const handleNext = () => {
        if (currentIdx + 1 >= CHALLENGES.length) {
            setGameOver(true);
            if (onXPEarned) onXPEarned(xp);
            return;
        }
        setCurrentIdx(i => i + 1);
        setUserInput('');
        setAnswered(false);
        setIsCorrect(false);
        setTimeLeft(45);
        setShowHint(false);
    };

    const handleRestart = () => {
        setCurrentIdx(0);
        setUserInput('');
        setAnswered(false);
        setIsCorrect(false);
        setScore(0);
        setXp(0);
        setTimeLeft(45);
        setGameOver(false);
        setShowHint(false);
    };

    const ch = CHALLENGES[currentIdx];
    const timerPercent = (timeLeft / 45) * 100;

    if (gameOver) {
        const percentage = Math.round((score / CHALLENGES.length) * 100);
        return (
            <div className="game-play-overlay" onClick={onClose}>
                <div className="game-play-modal" onClick={e => e.stopPropagation()}>
                    <div className="game-modal-header">
                        <div className="game-modal-title">
                            <PenTool size={24} style={{ color: 'var(--accent-blue-500)' }} />
                            <h2>Kodni Tugallash — Natijalar</h2>
                        </div>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className="game-modal-body">
                        <div className="game-results">
                            <div className="game-results-icon">{percentage >= 80 ? '🏆' : percentage >= 50 ? '👏' : '💪'}</div>
                            <h2>{percentage >= 80 ? 'Ajoyib!' : percentage >= 50 ? 'Yaxshi!' : 'Mashq qiling!'}</h2>
                            <p>{CHALLENGES.length} ta topshiriqdan {score} tasini to'g'ri bajardingiz</p>
                            <div className="results-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{score}/{CHALLENGES.length}</div>
                                    <div className="result-stat-label">To'g'ri</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value" style={{ color: '#f59e0b' }}>+{xp}</div>
                                    <div className="result-stat-label">XP</div>
                                </div>
                            </div>
                            <div className="game-results-actions">
                                <button className="btn btn-outline" onClick={handleRestart}><RotateCcw size={16} /> Qayta</button>
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
                        <PenTool size={24} style={{ color: 'var(--accent-blue-500)' }} />
                        <h2>Kodni Tugallash</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="game-xp-earned"><Zap size={14} /> {xp} XP</span>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>

                <div className="game-modal-body">
                    <div className="game-timer-bar">
                        <div className="game-timer-fill" style={{ width: `${timerPercent}%` }} />
                    </div>
                    <div className="game-timer-text">
                        <span className={`timer-display ${timeLeft <= 10 ? 'warning' : ''}`}>
                            <Clock size={16} /> {timeLeft}s
                        </span>
                        <span className="question-counter">{currentIdx + 1} / {CHALLENGES.length}</span>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <span className="lang-tag">{ch.category}</span>
                    </div>

                    <div className="quiz-question">{ch.instruction}</div>

                    <pre className="quiz-code-block">
                        <code>
                            <span>{ch.codeBefore}</span>
                            <span className="blank">{answered ? (isCorrect ? ch.answer : `${userInput} → ${ch.answer}`) : '???'}</span>
                            <span>{ch.codeAfter}</span>
                        </code>
                    </pre>

                    {!answered && (
                        <>
                            <div className="code-input-wrapper">
                                <input
                                    type="text"
                                    className="code-input"
                                    value={userInput}
                                    onChange={e => setUserInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && userInput.trim() && handleCheck()}
                                    placeholder="Javobingizni yozing..."
                                    autoFocus
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <button
                                    className="submit-answer-btn"
                                    onClick={handleCheck}
                                    disabled={!userInput.trim()}
                                    style={{ flex: 1 }}
                                >
                                    Tekshirish
                                </button>
                                {!showHint && (
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setShowHint(true)}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        💡 Maslahat (-7 XP)
                                    </button>
                                )}
                            </div>

                            {showHint && (
                                <div className="quiz-explanation correct">
                                    <strong>💡 Maslahat:</strong> {ch.hint}
                                </div>
                            )}
                        </>
                    )}

                    {answered && (
                        <>
                            <div className={`quiz-explanation ${isCorrect ? 'correct' : 'wrong'}`}>
                                <strong>
                                    {isCorrect ? (
                                        <><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />To'g'ri! {showHint ? '+8' : '+15'} XP</>
                                    ) : (
                                        <><XCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Noto'g'ri! To'g'ri javob: <code style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{ch.answer}</code></>
                                    )}
                                </strong>
                            </div>
                            <button className="next-btn" onClick={handleNext} style={{ width: '100%' }}>
                                {currentIdx + 1 >= CHALLENGES.length ? 'Natijalar' : 'Keyingisi'} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
