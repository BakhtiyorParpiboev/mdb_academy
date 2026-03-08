import React, { useState } from 'react';
import { X, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Eye } from 'lucide-react';

const PREDICTIONS = [
    {
        category: 'JavaScript',
        code: `let x = 5;\nlet y = "5";\nconsole.log(x == y);`,
        options: ['true', 'false', 'undefined', 'Error'],
        correct: 0,
        explanation: "== operatori faqat qiymatni solishtiradi (type coercion). 5 == '5' → true. === ishlatilsa false bo'lardi."
    },
    {
        category: 'Python',
        code: `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)`,
        options: ['[1, 2, 3]', '[1, 2, 3, 4]', '[4]', 'Error'],
        correct: 1,
        explanation: "Python-da ro'yxatlar reference sifatida uzatiladi. y = x deganda x va y bir xil ro'yxatga ishora qiladi."
    },
    {
        category: 'JavaScript',
        code: `console.log(1 + "2" + 3);`,
        options: ['"6"', '"123"', '"33"', '6'],
        correct: 1,
        explanation: "Chapdan o'ngga: 1 + '2' = '12' (string), keyin '12' + 3 = '123' (string). Type coercion ishlaydi."
    },
    {
        category: 'Python',
        code: `def foo(a, b=[]):\n    b.append(a)\n    return b\n\nprint(foo(1))\nprint(foo(2))`,
        options: ['[1]\\n[2]', '[1]\\n[1, 2]', 'Error', '[1, 2]\\n[1, 2]'],
        correct: 1,
        explanation: "Python-da default mutable argument (list) faqat bir marta yaratiladi. Har safar bir xil list-ga qo'shiladi."
    },
    {
        category: 'JavaScript',
        code: `let a = [1, 2, 3];\nlet b = [1, 2, 3];\nconsole.log(a === b);`,
        options: ['true', 'false', 'undefined', 'Error'],
        correct: 1,
        explanation: "Massivlar ob'ekt sifatida reference bo'yicha solishtiriladi. a va b turli ob'ektlar, shuning uchun false."
    },
    {
        category: 'Python',
        code: `print(type(3.14).__name__)`,
        options: ['"number"', '"float"', '"decimal"', '"double"'],
        correct: 1,
        explanation: "Python-da 3.14 — float turidagi son. type().__name__ tur nomini string sifatida beradi."
    },
    {
        category: 'JavaScript',
        code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}`,
        options: ['0 1 2', '3 3 3', '0 0 0', 'undefined'],
        correct: 1,
        explanation: "var function-scoped. setTimeout ishlaganda loop allaqachon tugagan va i = 3. let ishlatilsa 0 1 2 chiqardi."
    },
    {
        category: 'Python',
        code: `x = "hello"\nprint(x[1:4])`,
        options: ['"hell"', '"ell"', '"ello"', '"hel"'],
        correct: 1,
        explanation: "Slicing: x[1:4] — 1-indeksdan 4-indeksgacha (4 kirmaydi). 'h-e-l-l-o' → 'ell'."
    }
];

export default function OutputPredictorGame({ onClose, onXPEarned }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [xp, setXp] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleSelect = (idx) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        if (idx === PREDICTIONS[currentIdx].correct) {
            setScore(s => s + 1);
            setXp(x => x + 15);
        }
    };

    const handleNext = () => {
        if (currentIdx + 1 >= PREDICTIONS.length) {
            setGameOver(true);
            if (onXPEarned) onXPEarned(xp);
            return;
        }
        setCurrentIdx(i => i + 1);
        setSelected(null);
        setAnswered(false);
    };

    const handleRestart = () => {
        setCurrentIdx(0);
        setSelected(null);
        setAnswered(false);
        setScore(0);
        setXp(0);
        setGameOver(false);
    };

    const p = PREDICTIONS[currentIdx];

    if (gameOver) {
        const pct = Math.round((score / PREDICTIONS.length) * 100);
        return (
            <div className="game-play-overlay" onClick={onClose}>
                <div className="game-play-modal" onClick={e => e.stopPropagation()}>
                    <div className="game-modal-header">
                        <div className="game-modal-title">
                            <Eye size={24} style={{ color: '#06b6d4' }} />
                            <h2>Natijani Bashorat Qil — Natijalar</h2>
                        </div>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className="game-modal-body">
                        <div className="game-results">
                            <div className="game-results-icon">{pct >= 80 ? '🔮🏆' : '🔮'}</div>
                            <h2>{pct >= 80 ? 'Bashoratchi!' : 'Yaxshi urinish!'}</h2>
                            <p>{PREDICTIONS.length} ta savoldan {score} tasiga to'g'ri javob berdingiz</p>
                            <div className="results-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{score}/{PREDICTIONS.length}</div>
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
                        <Eye size={24} style={{ color: '#06b6d4' }} />
                        <h2>Natijani Bashorat Qil</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="game-xp-earned"><Zap size={14} /> {xp} XP</span>
                        <span className="question-counter">{currentIdx + 1} / {PREDICTIONS.length}</span>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>
                <div className="game-modal-body">
                    <div style={{ marginBottom: '12px' }}>
                        <span className="lang-tag">{p.category}</span>
                    </div>
                    <div className="quiz-question">Bu kod qanday natija beradi?</div>

                    <pre className="quiz-code-block"><code>{p.code}</code></pre>

                    <div className="quiz-options">
                        {p.options.map((opt, idx) => {
                            let cls = 'quiz-option';
                            if (answered) {
                                if (idx === p.correct) cls += ' correct';
                                else if (idx === selected && idx !== p.correct) cls += ' wrong';
                            }
                            return (
                                <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={answered}>
                                    <span className="option-letter">{'ABCD'[idx]}</span>
                                    <code style={{ fontSize: '0.85rem' }}>{opt}</code>
                                </button>
                            );
                        })}
                    </div>

                    {answered && (
                        <>
                            <div className={`quiz-explanation ${selected === p.correct ? 'correct' : 'wrong'}`}>
                                <strong>
                                    {selected === p.correct ? (
                                        <><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />To'g'ri! +15 XP</>
                                    ) : (
                                        <><XCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Noto'g'ri!</>
                                    )}
                                </strong>
                                {p.explanation}
                            </div>
                            <button className="next-btn" onClick={handleNext} style={{ width: '100%' }}>
                                {currentIdx + 1 >= PREDICTIONS.length ? 'Natijalar' : 'Keyingisi'} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
