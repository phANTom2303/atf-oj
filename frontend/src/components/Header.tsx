import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import './Header.css';

interface HeaderProps {
    logo?: string;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ logo, title }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo">
                    {logo && <img src={logo} alt="Logo" />}
                    <h1>{title}</h1>
                </div>

                {isMobile ? (
                    <>
                        <button className="menu-toggle" onClick={toggleMenu}>
                            {menuOpen ? '✕' : '☰'}
                        </button>
                        {menuOpen && (
                            <nav className="mobile-nav">
                                <ul>
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/about">About</a></li>
                                    <li><a href="/contact">Contact</a></li>
                                </ul>
                            </nav>
                        )}
                    </>
                ) : (
                    <nav className="desktop-nav">
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;