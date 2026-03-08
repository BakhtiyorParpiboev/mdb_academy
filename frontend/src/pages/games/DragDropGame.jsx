import React, { useState, useRef } from 'react';
import { X, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, GripVertical, ArrowUpDown } from 'lucide-react';

const PUZZLES = [
    {
        category: 'HTML',
        instruction: "To'g'ri HTML tuzilmasini yarating — teglarni to'g'ri tartibda joylashtiring:",
        lines: ['<!DOCTYPE html>', '<html>', '<head>', '<title>Sahifa</title>', '</head>', '<body>', '<h1>Salom</h1>', '</body>', '</html>'],
        correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    },
    {
        category: 'JavaScript',
        instruction: "For loop yordamida massiv elementlarini chiqaring:",
        lines: [
            'const mevalar = ["olma", "banan", "uzum"];',
            'for (let i = 0; i < mevalar.length; i++) {',
            '  console.log(mevalar[i]);',
            '}'
        ],
        correctOrder: [0, 1, 2, 3]
    },
    {
        category: 'CSS',
        instruction: "CSS Grid bilan 3 ustunli layout yarating:",
        lines: [
            '.container {',
            '  display: grid;',
            '  grid-template-columns: repeat(3, 1fr);',
            '  gap: 20px;',
            '  padding: 20px;',
            '}'
        ],
        correctOrder: [0, 1, 2, 3, 4, 5]
    },
    {
        category: 'Python',
        instruction: "Funksiya yaratib, uni chaqiring:",
        lines: [
            'def salomlash(ism):',
            '    xabar = f"Salom, {ism}!"',
            '    return xabar',
            '',
            'natija = salomlash("Ali")',
            'print(natija)'
        ],
        correctOrder: [0, 1, 2, 3, 4, 5]
    },
    {
        category: 'JavaScript',
        instruction: "Async/await bilan API so'rov yuboring:",
        lines: [
            'async function getData() {',
            '  try {',
            '    const response = await fetch("/api/data");',
            '    const data = await response.json();',
            '    console.log(data);',
            '  } catch (error) {',
            '    console.error(error);',
            '  }',
            '}'
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function DragDropGame({ onClose, onXPEarned }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [items, setItems] = useState(() => {
        const puzzle = PUZZLES[0];
        return shuffleArray(puzzle.lines.map((line, idx) => ({ id: idx, text: line, originalIdx: idx })));
    });
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [xp, setXp] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [draggedIdx, setDraggedIdx] = useState(null);

    const loadPuzzle = (idx) => {
        const puzzle = PUZZLES[idx];
        setItems(shuffleArray(puzzle.lines.map((line, i) => ({ id: i, text: line, originalIdx: i }))));
        setChecked(false);
        setIsCorrect(false);
        setDraggedIdx(null);
    };

    const handleDragStart = (idx) => {
        setDraggedIdx(idx);
    };

    const handleDragOver = (e, idx) => {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === idx) return;
        const newItems = [...items];
        const dragged = newItems[draggedIdx];
        newItems.splice(draggedIdx, 1);
        newItems.splice(idx, 0, dragged);
        setItems(newItems);
        setDraggedIdx(idx);
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
    };

    const moveItem = (fromIdx, direction) => {
        const toIdx = fromIdx + direction;
        if (toIdx < 0 || toIdx >= items.length) return;
        const newItems = [...items];
        [newItems[fromIdx], newItems[toIdx]] = [newItems[toIdx], newItems[fromIdx]];
        setItems(newItems);
    };

    const handleCheck = () => {
        const puzzle = PUZZLES[currentIdx];
        const correct = items.every((item, idx) => item.originalIdx === puzzle.correctOrder[idx]);
        setChecked(true);
        setIsCorrect(correct);
        if (correct) {
            setScore(s => s + 1);
            setXp(x => x + 20);
        }
    };

    const handleNext = () => {
        if (currentIdx + 1 >= PUZZLES.length) {
            setGameOver(true);
            if (onXPEarned) onXPEarned(xp);
            return;
        }
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        loadPuzzle(nextIdx);
    };

    const handleRestart = () => {
        setCurrentIdx(0);
        setScore(0);
        setXp(0);
        setGameOver(false);
        loadPuzzle(0);
    };

    const puzzle = PUZZLES[currentIdx];

    if (gameOver) {
        const pct = Math.round((score / PUZZLES.length) * 100);
        return (
            <div className="game-play-overlay" onClick={onClose}>
                <div className="game-play-modal" onClick={e => e.stopPropagation()}>
                    <div className="game-modal-header">
                        <div className="game-modal-title">
                            <ArrowUpDown size={24} style={{ color: '#f59e0b' }} />
                            <h2>Kod Tartibchisi — Natijalar</h2>
                        </div>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                    <div className="game-modal-body">
                        <div className="game-results">
                            <div className="game-results-icon">{pct >= 80 ? '📐🏆' : '📐'}</div>
                            <h2>{pct >= 80 ? 'Tartibchi!' : 'Yaxshi urinish!'}</h2>
                            <p>{PUZZLES.length} ta topshiriqdan {score} tasini to'g'ri joyladingiz</p>
                            <div className="results-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{score}/{PUZZLES.length}</div>
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
                        <ArrowUpDown size={24} style={{ color: '#f59e0b' }} />
                        <h2>Kod Tartibchisi</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="game-xp-earned"><Zap size={14} /> {xp} XP</span>
                        <span className="question-counter">{currentIdx + 1} / {PUZZLES.length}</span>
                        <button className="game-modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>
                <div className="game-modal-body">
                    <div style={{ marginBottom: '12px' }}>
                        <span className="lang-tag">{puzzle.category}</span>
                    </div>
                    <div className="quiz-question">{puzzle.instruction}</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        📱 Elementlarni sudrab yoki ↑↓ tugmalar bilan tartibga keltiring
                    </p>

                    <div className="drag-items-container">
                        {items.map((item, idx) => {
                            let cls = 'drag-item';
                            if (draggedIdx === idx) cls += ' dragging';
                            if (checked) {
                                cls += item.originalIdx === puzzle.correctOrder[idx] ? ' correct-position' : ' wrong-position';
                            }
                            return (
                                <div
                                    key={item.id}
                                    className={cls}
                                    draggable={!checked}
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {!checked && <GripVertical size={16} style={{ color: 'var(--text-secondary)', cursor: 'grab' }} />}
                                            {checked && (
                                                item.originalIdx === puzzle.correctOrder[idx]
                                                    ? <CheckCircle size={16} style={{ color: '#22c55e' }} />
                                                    : <XCircle size={16} style={{ color: '#ef4444' }} />
                                            )}
                                            <code style={{ fontSize: '0.85rem' }}>{item.text || '(bo\'sh qator)'}</code>
                                        </div>
                                        {!checked && (
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveItem(idx, -1); }}
                                                    style={{ padding: '2px 6px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                                    disabled={idx === 0}
                                                >↑</button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveItem(idx, 1); }}
                                                    style={{ padding: '2px 6px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                                    disabled={idx === items.length - 1}
                                                >↓</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {!checked && (
                        <button className="submit-answer-btn" onClick={handleCheck}>
                            ✅ Tekshirish
                        </button>
                    )}

                    {checked && (
                        <>
                            <div className={`quiz-explanation ${isCorrect ? 'correct' : 'wrong'}`}>
                                <strong>
                                    {isCorrect ? (
                                        <><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Mukammal tartib! +20 XP</>
                                    ) : (
                                        <><XCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Tartib noto'g'ri. To'g'ri tartibga e'tibor bering.</>
                                    )}
                                </strong>
                            </div>
                            <button className="next-btn" onClick={handleNext} style={{ width: '100%' }}>
                                {currentIdx + 1 >= PUZZLES.length ? 'Natijalar' : 'Keyingisi'} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
