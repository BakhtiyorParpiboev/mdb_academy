import React, { useState } from 'react';
import { X, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Search } from 'lucide-react';

const BUGS = [
    {
        category: 'HTML',
        description: "Bu HTML kodda xato bor. Xato qayerda?",
        lines: [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '  <title>Sahifa</tittle>',
            '</head>',
            '<body>',
            '  <h1>Salom</h1>',
            '</body>',
            '</html>'
        ],
        bugLine: 3,
        explanation: "'</tittle>' noto'g'ri yozilgan. To'g'ri varianti: '</title>' (bitta 't' bilan)."
    },
    {
        category: 'JavaScript',
        description: "Bu JavaScript funksiya ishlayotgan ko'rinadi, lekin xato bor. Uni toping!",
        lines: [
            'function add(a, b) {',
            '  let sum = a + b;',
            '  console.log(sum);',
            '}',
            '',
            'let result = add(5, 3);',
            'console.log(result);'
        ],
        bugLine: 0,
        explanation: "Funksiya hech narsa qaytarmaydi (return yo'q). 'return a + b;' kerak. result = undefined bo'ladi."
    },
    {
        category: 'CSS',
        description: "Bu CSS kodi elementni markazlashtirishi kerak, lekin ishlamaydi. Xatoni toping!",
        lines: [
            '.container {',
            '  display: flex;',
            '  justify-content: centre;',
            '  align-items: center;',
            '  height: 100vh;',
            '}'
        ],
        bugLine: 2,
        explanation: "'centre' noto'g'ri yozilgan. CSS-da to'g'ri imlo: 'center' (Amerikan inglizchasi)."
    },
    {
        category: 'Python',
        description: "Bu Python kodi xato beradi. Xatoni toping!",
        lines: [
            'def salom(ism):',
            '    xabar = "Salom, " + ism',
            '    print(xabar)',
            '',
            'salom("Ali")',
            'salom(42)'
        ],
        bugLine: 5,
        explanation: "salom(42) da xato. Raqamni string bilan qo'shib bo'lmaydi. str(42) kerak yoki f-string ishlatish lozim."
    },
    {
        category: 'JavaScript',
        description: "Bu JavaScript kodi nima uchun ishlamaydi?",
        lines: [
            'const colors = ["qizil", "yashil", "ko\'k"];',
            '',
            'for (let i = 0; i <= colors.length; i++) {',
            '  console.log(colors[i]);',
            '}'
        ],
        bugLine: 2,
        explanation: "'i <= colors.length' noto'g'ri. Massiv indeksi 0 dan boshlanadi, shuning uchun 'i < colors.length' bo'lishi kerak. Aks holda undefined chiqadi."
    },
    {
        category: 'HTML',
        description: "Bu HTML formda xato bor. Toping!",
        lines: [
            '<form action="/submit" method="POST">',
            '  <label for="name">Ism:</label>',
            '  <input type="text" id="name">',
            '  <label for="email">Email:</label>',
            '  <input type="email" name="email">',
            '  <button type="submit">Yuborish</button>',
            '</form>'
        ],
        bugLine: 2,
        explanation: "Input-da 'name' atributi yo'q. Forma yuborilganda server bu maydonni ololmaydi. 'name=\"name\"' qo'shish kerak."
    }
];

export default function BugFinderGame({ onClose, onXPEarned }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedLine, setSelectedLine] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [xp, setXp] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleLineClick = (lineIdx) => {
        if (answered) return;
        setSelectedLine(lineIdx);
        setAnswered(true);
        const isCorrect = lineIdx === BUGS[currentIdx].bugLine;
        if (isCorrect) {
            setScore(s => s + 1);
            setXp(x => x + 20);
        }
    };

    const handleNext = () => {
        if (currentIdx + 1 >= BUGS.length) {
            setGameOver(true);
            if (onXPEarned) onXPEarned(xp);
            return;
        }
        setCurrentIdx(i => i + 1);
        setSelectedLine(null);
        setAnswered(false);
    };

    const handleRestart = () => {
        setCurrentIdx(0);
        setSelectedLine(null);
        setAnswered(false);
        setScore(0);
        setXp(0);
        setGameOver(false);
    };

    const bug = BUGS[currentIdx];

    if (gameOver) {
        const pct = Math.round((score / BUGS.length) * 100);
        return (
            <div className="game-play-overlay" onClick={onClose}>
                <div className="game-play-modal" onClick={e => e.stopPropagation()}>
                    <div className="game-modal-header">
                        <div className="game-modal-title">
                            <Search size={24} style={{ color: '#ef4444' }} />
                            <h2>Bug Finder — Natijalar</h2>
                        </div>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className="game-modal-body">
                        <div className="game-results">
                            <div className="game-results-icon">{pct >= 80 ? '🐛🏆' : '🐛'}</div>
                            <h2>{pct >= 80 ? 'Bug Hunter!' : 'Mashq qiling!'}</h2>
                            <p>{BUGS.length} ta xatodan {score} tasini topdingiz</p>
                            <div className="results-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{score}/{BUGS.length}</div>
                                    <div className="result-stat-label">Topilgan xatolar</div>
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
                        <Search size={24} style={{ color: '#ef4444' }} />
                        <h2>Xatoni Top!</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="game-xp-earned"><Zap size={14} /> {xp} XP</span>
                        <span className="question-counter">{currentIdx + 1} / {BUGS.length}</span>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>
                <div className="game-modal-body">
                    <div style={{ marginBottom: '12px' }}>
                        <span className="lang-tag">{bug.category}</span>
                    </div>
                    <div className="quiz-question">{bug.description}</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        👆 Xato bor qatorni bosing
                    </p>

                    <div className="quiz-code-block" style={{ padding: '0', overflow: 'hidden' }}>
                        {bug.lines.map((line, idx) => {
                            let cls = 'code-line-clickable';
                            if (answered && idx === bug.bugLine) cls += ' correct-line';
                            else if (answered && idx === selectedLine && idx !== bug.bugLine) cls += ' selected-bug';
                            return (
                                <div key={idx} className={cls} onClick={() => handleLineClick(idx)}>
                                    <span className="line-number">{idx + 1}</span>
                                    <span>{line || ' '}</span>
                                </div>
                            );
                        })}
                    </div>

                    {answered && (
                        <>
                            <div className={`quiz-explanation ${selectedLine === bug.bugLine ? 'correct' : 'wrong'}`} style={{ marginTop: '16px' }}>
                                <strong>
                                    {selectedLine === bug.bugLine ? (
                                        <><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />To'g'ri! +20 XP 🐛</>
                                    ) : (
                                        <><XCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Noto'g'ri! Xato {bug.bugLine + 1}-qatorda.</>
                                    )}
                                </strong>
                                {bug.explanation}
                            </div>
                            <button className="next-btn" onClick={handleNext} style={{ width: '100%', marginTop: '12px' }}>
                                {currentIdx + 1 >= BUGS.length ? 'Natijalar' : 'Keyingisi'} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
