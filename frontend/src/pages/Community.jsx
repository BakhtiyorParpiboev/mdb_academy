import React from 'react';
import { Settings, Wrench, HardHat } from 'lucide-react';
import './Community.css';

const Community = () => {
    return (
        <div className="community-page container">
            <div className="construction-container">
                <div className="animated-icons">
                    <Settings className="spin-icon slow" size={64} />
                    <Wrench className="bounce-icon" size={48} />
                    <Settings className="spin-icon reverse" size={56} />
                </div>

                <h1 className="construction-title">
                    Tez Kunda...
                </h1>

                <div className="construction-message">
                    <HardHat className="hardhat-icon" size={32} />
                    <h2>Bizning dasturchilar bu qism ustida ishlamoqda!</h2>
                </div>

                <p className="construction-subtitle">
                    Bu yerda tez orada juda katta va foydali hamjamiyat (Community) ishga tushadi.
                    Dasturlash sirlarini boshqalar bilan bo'lishish, savollarga javob topish va
                    birgalikda o'sish uchun eng yaxshi maydonga aylanadi.
                </p>

                <div className="progress-bar-container">
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <span className="progress-text">Tayyorgarlik jarayonida...</span>
                </div>
            </div>
        </div>
    );
};

export default Community;
