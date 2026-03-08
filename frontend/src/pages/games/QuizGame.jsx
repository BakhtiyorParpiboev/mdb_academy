import React, { useState, useEffect, useCallback } from 'react';
import { X, Clock, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, BrainCircuit } from 'lucide-react';

const QUESTIONS = [
    {
        category: 'HTML',
        question: "HTML-da ro'yxat yaratish uchun qaysi teg ishlatiladi?",
        code: null,
        options: ['<list>', '<ul>', '<ol> yoki <ul>', '<items>'],
        correct: 2,
        explanation: "HTML-da <ol> (ordered list) tartibli, <ul> (unordered list) tartibsiz ro'yxat yaratadi."
    },
    {
        category: 'CSS',
        question: "CSS-da elementni markazlashtirish uchun qaysi usul eng yaxshi?",
        code: `.container {\n  display: ???;\n  justify-content: center;\n  align-items: center;\n}`,
        options: ['block', 'inline', 'flex', 'grid'],
        correct: 2,
        explanation: "Flexbox (display: flex) zamonaviy markazlashtirish usuli hisoblanadi. justify-content va align-items bilan ishlaydi."
    },
    {
        category: 'JavaScript',
        question: "Bu kod nima natija beradi?",
        code: `console.log(typeof null);`,
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correct: 2,
        explanation: "JavaScript-da typeof null = 'object' — bu tilning mashhur xatosi (bug). null aslida ob'ekt emas."
    },
    {
        category: 'HTML',
        question: "HTML5-da semantik teg qaysi?",
        code: null,
        options: ['<div>', '<span>', '<article>', '<b>'],
        correct: 2,
        explanation: "<article> semantik teg bo'lib, mustaqil kontentni belgilaydi. <div> va <span> semantik emas."
    },
    {
        category: 'CSS',
        question: "Bu CSS qoidasi nima qiladi?",
        code: `* {\n  box-sizing: border-box;\n}`,
        options: [
            "Barcha elementlarni yashiradi",
            "Padding va border width ichiga kiradi",
            "Marginlarni olib tashlaydi",
            "Fon rangini o'zgartiradi"
        ],
        correct: 1,
        explanation: "box-sizing: border-box padding va border-ni element width/height ichiga kiritadi. Bu layout yaratishni osonlashtiradi."
    },
    {
        category: 'JavaScript',
        question: "let va const o'rtasidagi farq nima?",
        code: `let x = 10;\nx = 20; // ✅ ishlaydi\n\nconst y = 10;\ny = 20; // ❌ xato`,
        options: [
            "Farqi yo'q",
            "let qayta tayinlanadi, const yo'q",
            "const tezroq ishlaydi",
            "let faqat raqamlar uchun"
        ],
        correct: 1,
        explanation: "let bilan e'lon qilingan o'zgaruvchi qayta tayinlanishi mumkin. const bilan e'lon qilingan o'zgaruvchi qayta tayinlanmaydi."
    },
    {
        category: 'Python',
        question: "Python-da ro'yxatga yangi element qo'shish uchun qaysi metod?",
        code: `fruits = ["olma", "banan"]\nfruits.???("uzum")`,
        options: ['add()', 'push()', 'append()', 'insert()'],
        correct: 2,
        explanation: "Python-da list.append() metodi ro'yxat oxiriga yangi element qo'shadi."
    },
    {
        category: 'JavaScript',
        question: "Bu kod nima natija beradi?",
        code: `console.log(2 + "2");`,
        options: ['"4"', '"22"', '4', 'NaN'],
        correct: 1,
        explanation: "JavaScript-da raqam + string = string concatenation. 2 + '2' = '22' (string)."
    },
    {
        category: 'CSS',
        question: "CSS Grid-da 3 ta ustun yaratish uchun qanday yoziladi?",
        code: `.grid {\n  display: grid;\n  ???\n}`,
        options: [
            'columns: 3',
            'grid-template-columns: repeat(3, 1fr)',
            'grid-columns: 3',
            'flex-columns: 3'
        ],
        correct: 1,
        explanation: "grid-template-columns: repeat(3, 1fr) — 3 ta teng bo'lgan ustun yaratadi. 1fr = 1 fraction unit."
    },
    {
        category: 'Python',
        question: "Bu kod nima natija beradi?",
        code: `x = [1, 2, 3]\nprint(x[-1])`,
        options: ['1', '2', '3', 'Error'],
        correct: 2,
        explanation: "Python-da manfiy indeks oxiridan sanaydi. x[-1] = oxirgi element = 3."
    }
];

const TIMER_DURATION = 30;

export default function QuizGame({ onClose, onXPEarned }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [xp, setXp] = useState(0);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [gameOver, setGameOver] = useState(false);
    const [showXpPopup, setShowXpPopup] = useState(false);
    const [xpPopupValue, setXpPopupValue] = useState(0);

    useEffect(() => {
        if (answered || gameOver) return;
        if (timeLeft <= 0) {
            handleTimeUp();
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, answered, gameOver]);

    const handleTimeUp = () => {
        setAnswered(true);
        setCombo(0);
    };

    const handleSelect = (idx) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        const isCorrect = idx === QUESTIONS[currentQ].correct;
        if (isCorrect) {
            const newCombo = combo + 1;
            setCombo(newCombo);
            const baseXP = 10;
            const comboBonus = Math.min(newCombo, 5) * 2;
            const timeBonus = Math.floor(timeLeft / 5);
            const earned = baseXP + comboBonus + timeBonus;
            setScore(s => s + 1);
            setXp(x => x + earned);
            setXpPopupValue(earned);
            setShowXpPopup(true);
            setTimeout(() => setShowXpPopup(false), 1500);
        } else {
            setCombo(0);
        }
    };

    const handleNext = () => {
        if (currentQ + 1 >= QUESTIONS.length) {
            setGameOver(true);
            if (onXPEarned) onXPEarned(xp);
            return;
        }
        setCurrentQ(c => c + 1);
        setSelected(null);
        setAnswered(false);
        setTimeLeft(TIMER_DURATION);
    };

    const handleRestart = () => {
        setCurrentQ(0);
        setSelected(null);
        setAnswered(false);
        setScore(0);
        setXp(0);
        setCombo(0);
        setTimeLeft(TIMER_DURATION);
        setGameOver(false);
    };

    const q = QUESTIONS[currentQ];
    const timerPercent = (timeLeft / TIMER_DURATION) * 100;

    if (gameOver) {
        const percentage = Math.round((score / QUESTIONS.length) * 100);
        let emoji = '🎉';
        let message = "Ajoyib natija!";
        if (percentage < 50) { emoji = '💪'; message = "Yana mashq qiling!"; }
        else if (percentage < 80) { emoji = '👏'; message = "Yaxshi natija!"; }

        return (
            <div className="game-play-overlay" onClick={onClose}>
                <div className="game-play-modal" onClick={e => e.stopPropagation()}>
                    <div className="game-modal-header">
                        <div className="game-modal-title">
                            <BrainCircuit size={24} style={{ color: '#a855f7' }} />
                            <h2>Viktorina Tugadi!</h2>
                        </div>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className="game-modal-body">
                        <div className="game-results">
                            <div className="game-results-icon">{emoji}</div>
                            <h2>{message}</h2>
                            <p>Siz {QUESTIONS.length} ta savoldan {score} tasiga to'g'ri javob berdingiz</p>
                            <div className="results-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{score}/{QUESTIONS.length}</div>
                                    <div className="result-stat-label">To'g'ri javoblar</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value" style={{ color: '#f59e0b' }}>+{xp}</div>
                                    <div className="result-stat-label">XP ishlab topildi</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value" style={{ color: '#22c55e' }}>{percentage}%</div>
                                    <div className="result-stat-label">Aniqlik</div>
                                </div>
                            </div>
                            <div className="game-results-actions">
                                <button className="btn btn-outline" onClick={handleRestart}>
                                    <RotateCcw size={16} /> Qayta boshlash
                                </button>
                                <button className="btn btn-primary" onClick={onClose}>
                                    <Trophy size={16} /> Yakunlash
                                </button>
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
                        <BrainCircuit size={24} style={{ color: '#a855f7' }} />
                        <h2>Dasturlash Viktorinasi</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="game-xp-earned"><Zap size={14} /> {xp} XP</span>
                        {combo > 1 && <span className="combo-indicator">🔥 {combo}x Combo!</span>}
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>

                <div className="game-modal-body">
                    {/* Timer */}
                    <div className="game-timer-bar">
                        <div
                            className="game-timer-fill"
                            style={{ width: `${timerPercent}%` }}
                        />
                    </div>
                    <div className="game-timer-text">
                        <span className={`timer-display ${timeLeft <= 10 ? 'warning' : ''}`}>
                            <Clock size={16} /> {timeLeft}s
                        </span>
                        <span className="question-counter">
                            {currentQ + 1} / {QUESTIONS.length}
                        </span>
                    </div>

                    {/* Category badge */}
                    <div style={{ marginBottom: '12px' }}>
                        <span className="lang-tag">{q.category}</span>
                    </div>

                    {/* Question */}
                    <div className="quiz-question">{q.question}</div>

                    {/* Code block if present */}
                    {q.code && (
                        <pre className="quiz-code-block">
                            <code>{q.code}</code>
                        </pre>
                    )}

                    {/* Options */}
                    <div className="quiz-options">
                        {q.options.map((opt, idx) => {
                            let cls = 'quiz-option';
                            if (answered) {
                                if (idx === q.correct) cls += ' correct';
                                else if (idx === selected && idx !== q.correct) cls += ' wrong';
                            } else if (idx === selected) {
                                cls += ' selected';
                            }
                            return (
                                <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={answered}>
                                    <span className="option-letter">{'ABCD'[idx]}</span>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {answered && (
                        <div className={`quiz-explanation ${selected === q.correct ? 'correct' : 'wrong'}`}>
                            <strong>
                                {selected === q.correct ? (
                                    <><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />To'g'ri!</>
                                ) : timeLeft <= 0 && selected === null ? (
                                    <><Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Vaqt tugadi!</>
                                ) : (
                                    <><XCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Noto'g'ri!</>
                                )}
                            </strong>
                            {q.explanation}
                        </div>
                    )}

                    {answered && (
                        <button className="next-btn" onClick={handleNext} style={{ width: '100%' }}>
                            {currentQ + 1 >= QUESTIONS.length ? 'Natijalarni ko\'rish' : 'Keyingi savol'}
                            <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }} />
                        </button>
                    )}
                </div>
            </div>

            {showXpPopup && <div className="xp-popup">+{xpPopupValue} XP</div>}
        </div>
    );
}
