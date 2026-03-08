import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Study.css';

const Study = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [savedRoadmaps, setSavedRoadmaps] = useState([]);
    const [loadingMap, setLoadingMap] = useState({});
    // Top tending careers in Uzbekistan appended to general roles
    const roleBased = [
        "Frontend", "Backend", "Full Stack",
        "DevOps", "AI Engineer", "Data Analyst",
        "Android", "iOS", "Machine Learning",
        "Data Engineer", "QA", "UX/UI Design",
        "Software Architect", "Cyber Security", "Product Manager"
    ];

    const skillBased = [
        "JavaScript", "TypeScript", "Python", "Java",
        "C#", "C++", "PHP", "Go", "Ruby", "Rust",
        "Swift", "Kotlin", "SQL", "React", "Node.js",
        "PostgreSQL", "Docker", "Git & GitHub", "AWS",
        "System Design"
    ];

    useEffect(() => {
        const fetchSavedRoadmaps = async () => {
            if (!currentUser) return;
            try {
                const token = await currentUser.getIdToken();
                const res = await fetch('http://localhost:5000/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSavedRoadmaps(data.savedRoadmaps || []);
                }
            } catch (err) {
                console.error("Failed to fetch roadmaps", err);
            }
        };
        fetchSavedRoadmaps();
    }, [currentUser]);

    const handleToggleSave = async (roadmapName) => {
        if (!currentUser) return alert("Avval tizimga kiring!");

        setLoadingMap(prev => ({ ...prev, [roadmapName]: true }));
        try {
            const token = await currentUser.getIdToken();
            const res = await fetch('http://localhost:5000/api/user/roadmap/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ roadmapName })
            });

            if (res.ok) {
                const data = await res.json();
                setSavedRoadmaps(data.savedRoadmaps);
            }
        } catch (err) {
            console.error("Failed to toggle roadmap", err);
        } finally {
            setLoadingMap(prev => ({ ...prev, [roadmapName]: false }));
        }
    };

    return (
        <div className="roadmap-page">
            <div className="roadmap-header">
                <h1>Dasturchi Yo'l Xaritalari</h1>
                <p>
                    Men Dasturchi Bo'laman platformasi hamjamiyati tomonidan yaratilgan qo'llanmalar
                    va yo'l xaritalari. O'zbekistondagi bozor talabiga mos yo'nalishlarni o'rganing.
                </p>
            </div>

            <div className="roadmap-section">
                <div className="roadmap-divider">
                    <span className="roadmap-divider-text">Kasblar bo'yicha (Role-based Roadmaps)</span>
                </div>

                <div className="roadmap-grid">
                    {roleBased.map((role, idx) => {
                        const isSaved = savedRoadmaps.includes(role);
                        const isLoading = loadingMap[role];
                        return (
                            <button
                                key={idx}
                                className="roadmap-card"
                                onClick={() => navigate('/community')}
                                style={{ opacity: isLoading ? 0.7 : 1 }}
                            >
                                <span>{role}</span>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleSave(role);
                                    }}
                                    style={{ padding: '4px', cursor: 'pointer' }}
                                >
                                    <Bookmark
                                        size={18}
                                        className="roadmap-icon"
                                        fill={isSaved ? "currentColor" : "none"}
                                        style={{ color: isSaved ? "var(--accent-blue-500)" : "" }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="roadmap-section">
                <div className="roadmap-divider">
                    <span className="roadmap-divider-text">Texnologiyalar bo'yicha (Skill-based Roadmaps)</span>
                </div>

                <div className="roadmap-grid">
                    {skillBased.map((skill, idx) => {
                        const isSaved = savedRoadmaps.includes(skill);
                        const isLoading = loadingMap[skill];
                        return (
                            <button
                                key={idx}
                                className="roadmap-card"
                                onClick={() => navigate('/community')}
                                style={{ opacity: isLoading ? 0.7 : 1 }}
                            >
                                <span>{skill}</span>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleSave(skill);
                                    }}
                                    style={{ padding: '4px', cursor: 'pointer' }}
                                >
                                    <Bookmark
                                        size={18}
                                        className="roadmap-icon"
                                        fill={isSaved ? "currentColor" : "none"}
                                        style={{ color: isSaved ? "var(--accent-blue-500)" : "" }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Study;
