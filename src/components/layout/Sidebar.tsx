import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Video, Calendar, Settings, LogOut } from 'lucide-react';
import './layout.css';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Go Live', path: '/golive', icon: <Radio size={20} className="text-secondary" /> },
        { name: 'Destinations', path: '/destinations', icon: <Settings size={20} /> },
        { name: 'Videos', path: '/videos', icon: <Video size={20} /> },
        { name: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
    ];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Radio className="text-primary" size={28} />
                    <span className="logo-text text-gradient">StreamPulse</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item cursor-pointer text-danger hover:text-white hover:bg-red-500/10 transition-colors">
                        <span className="nav-icon"><LogOut size={20} /></span>
                        Sign Out
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
