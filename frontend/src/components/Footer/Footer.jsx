import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Send, Linkedin, Mail, Code2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand & About */}
                    <div className="footer-section brand-section">
                        <Link to="/" className="logo footer-logo">
                            <Code2 size={24} className="icon-blue" />
                            Men Dasturchi <span>Bo'laman</span>
                        </Link>
                        <p className="footer-description">
                            O'zbek tilidagi birinchi va mukammal interaktiv dasturlash o'rganish platformasi. O'rganing, mashq qiling va natijalarga erishing.
                        </p>
                        <div className="social-links">
                            <a href="https://github.com/BakhtiyorParpiboev" target="_blank" rel="noopener noreferrer" aria-label="Github"><Github size={20} /></a>
                            <a href="https://t.me/BAKHTIYOR_SE" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><Send size={20} /></a>
                            <a href="https://www.linkedin.com/in/bakhtiyor-parpiboev-2b4849326" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="mailto:bakhtiyor@kookmin.ac.kr" aria-label="Gmail"><Mail size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Tezkor havolalar</h4>
                        <ul className="footer-links">
                            <li><Link to="/study">Darslar</Link></li>
                            <li><Link to="/ai">Sun'iy Intellekt</Link></li>
                            <li><Link to="/games">O'yinlar</Link></li>
                            <li><Link to="/compiler">Kompilyator</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Manbalar</h4>
                        <ul className="footer-links">
                            <li><Link to="/portfolio/demo">Portfolio</Link></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Hamjamiyat</a></li>
                            <li><a href="#">Yordam markazi</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Huquqiy</h4>
                        <ul className="footer-links">
                            <li><a href="#">Maxfiylik siyosati</a></li>
                            <li><a href="#">Foydalanish shartlari</a></li>
                            <li><a href="#">Cookie siyosati</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Men Dasturchi Bo'laman.</p>
                    <p>Barcha huquqlar himoyalangan.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
