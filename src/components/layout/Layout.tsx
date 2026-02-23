import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './layout.css';

const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        </div>
    );
};

export default Layout;
