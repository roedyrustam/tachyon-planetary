import React from 'react';
import { Menu, Bell, } from 'lucide-react';
import './layout.css';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <header className="top-header">
            <div className="flex-center">
                <button
                    className="mobile-menu-btn text-muted hover:text-white mr-4 bg-transparent border-none cursor-pointer"
                    onClick={toggleSidebar}
                >
                    <Menu size={24} />
                </button>
                <span className="hidden sm:inline-block font-medium text-muted">
                    Welcome back, Creator
                </span>
            </div>

            <div className="flex-center" style={{ gap: '1.5rem' }}>
                <button className="text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full transform translate-x-1/2 -translate-y-1/2" />
                </button>

                <div className="user-profile">
                    <div className="avatar">JD</div>
                    <div className="hidden sm:flex flex-column" style={{ gap: '0.1rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Jane Doe</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Plan</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
