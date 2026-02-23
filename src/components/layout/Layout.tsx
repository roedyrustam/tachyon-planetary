import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer, ToastType } from '../ui/Toast';
import './layout.css';

const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

    useEffect(() => {
        const handleToast = (e: any) => {
            const { message, type } = e.detail;
            const id = Math.random().toString(36).substr(2, 9);
            setToasts(prev => [...prev, { id, message, type }]);
        };

        window.addEventListener('show-toast', handleToast);
        return () => window.removeEventListener('show-toast', handleToast);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="main-wrapper">
                <Header toggleSidebar={toggleSidebar} />

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default Layout;
