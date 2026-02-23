import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Video, Calendar, LayoutGrid, Layers, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './layout.css';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const [mockResults] = useState([
        { id: '1', title: 'Midnight City Vlog', type: 'Video', icon: <Video size={14} />, path: '/videos' },
        { id: '2', title: 'Tech Talk Late Show', type: 'Schedule', icon: <Calendar size={14} />, path: '/schedule' },
        { id: '3', title: 'Twitch Primary', type: 'Destination', icon: <LayoutGrid size={14} />, path: '/destinations' },
        { id: '4', title: 'Alert Overlays', type: 'Overlay', icon: <Layers size={14} />, path: '/overlays' },
        { id: '5', title: 'How to stream with StreamPulse', type: 'Guide', icon: <PlayCircle size={14} />, path: '/dashboard' },
    ]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredResults = mockResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchItemClick = (path: string, title: string) => {
        navigate(path);
        setSearchQuery('');
        setShowResults(false);

        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: `Navigated to ${title}`, type: 'info' }
        }));
    };

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
                    Welcome back, {user?.email?.split('@')[0] || 'Creator'}
                </span>
            </div>

            <div className="flex-center" style={{ gap: '1.5rem' }}>
                <div className="header-search hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full w-96 relative" ref={searchRef}>
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search videos, destinations..."
                        className="bg-transparent border-none text-sm w-full focus:outline-none text-white"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowResults(e.target.value.length > 0);
                        }}
                        onFocus={() => searchQuery.length > 0 && setShowResults(true)}
                    />

                    {showResults && searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1017]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                            <div className="p-2">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSearchItemClick(item.path, item.title)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all group text-left border-none bg-transparent cursor-pointer"
                                        >
                                            <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{item.title}</p>
                                                <p className="text-[10px] text-muted uppercase tracking-wider">{item.type}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-white">
                                        <p className="text-sm text-muted italic">No matches for "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button className="text-muted hover:text-white transition-colors bg-transparent border-none cursor-pointer relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full transform translate-x-1/2 -translate-y-1/2" />
                </button>

                <div className="user-profile">
                    <div className="avatar">{user?.email?.[0].toUpperCase() || 'JD'}</div>
                    <div className="hidden sm:flex flex-column" style={{ gap: '0.1rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.email?.split('@')[0] || 'Jane Doe'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Plan</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
