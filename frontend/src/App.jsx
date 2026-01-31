import React, { useState } from 'react';
import DiscoveryView from './components/DiscoveryView';
import ProjectsView from './components/ProjectsView';
import FavoritesView from './components/FavoritesView';
import MessagesView from './components/MessagesView';
import StatisticsView from './components/StatisticsView';
import AdminView from './components/AdminView';
import SettingsView from './components/SettingsView';

/**
 * Main Application Component
 * 
 * Manages the global state for:
 * 1. Navigation (activeView)
 * 2. Inter-view communication (e.g., navigating to chat from favorites)
 */
function App() {
    // Top-level state for managing the visible view
    const [activeView, setActiveView] = useState('discovery');

    // State to handle "deep linking" to a specific chat context
    const [activeChatUser, setActiveChatUser] = useState(null);

    /**
     * Switching view handler that creates a seamless navigation experience.
     * Can be passed down to child components that need to trigger navigation.
     */
    const handleNavigateToChat = (userName) => {
        setActiveChatUser(userName);
        setActiveView('messages');
    };

    return (
        <div className="app-container">
            {/* 
                SIDEBAR NAVIGATION 
                Fixed lateral menu containing main navigation links.
                Uses state 'activeView' to highlight the current section.
            */}
            <aside className="sidebar">
                <div className="logo-container">
                    <i className="fa-solid fa-film"></i>
                    <span>Canary<span className="highlight">Cast</span>.ai</span>
                </div>

                <nav className="nav-menu">
                    {/* Primary Application Views */}
                    <div className="nav-section">
                        <p className="nav-label">MENU PRINCIPAL</p>
                        <ul>
                            <li className={activeView === 'discovery' ? 'active' : ''}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('discovery'); }}>
                                    <i className="fa-solid fa-bolt"></i> Discovery AI
                                </a>
                            </li>
                            <li className={activeView === 'projects' ? 'active' : ''}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('projects'); }}>
                                    <i className="fa-solid fa-briefcase"></i> Mis Proyectos
                                </a>
                            </li>
                            <li className={activeView === 'favorites' ? 'active' : ''}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('favorites'); }}>
                                    <i className="fa-regular fa-bookmark"></i> Favoritos
                                </a>
                            </li>
                            <li className={activeView === 'messages' ? 'active' : ''}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('messages'); }}>
                                    <i className="fa-regular fa-message"></i> Mensajes
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Administration & Configuration Views */}
                    <div className="nav-section">
                        <p className="nav-label">ADMINISTRACIÓN</p>
                        <ul>
                            <li className={activeView === 'stats' ? 'active' : ''}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('stats'); }}>
                                    <i className="fa-solid fa-chart-pie"></i> Estadísticas
                                </a>
                            </li>
                            <li className={activeView === 'admin' ? 'active' : ''}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('admin'); }}>
                                    <i className="fa-solid fa-users-gear"></i> Gestión de Talento
                                </a>
                            </li>
                            <li className={activeView === 'settings' ? 'active' : ''}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('settings'); }}>
                                    <i className="fa-solid fa-gear"></i> Configuración
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Sidebar Footer: User Profile */}
                <div className="user-profile">
                    <img src="https://ui-avatars.com/api/?name=Director+Casting&background=333&color=fff" alt="User" />
                    <div className="user-info">
                        <h4>Ana García</h4>
                        <p>Directora de Casting</p>
                    </div>
                </div>
            </aside>

            {/* 
                MAIN CONTENT AREA
                 conditionally renders the component based on 'activeView' state.
            */}
            <main className="main-content">
                {activeView === 'discovery' && <DiscoveryView />}
                {activeView === 'projects' && <ProjectsView />}
                {activeView === 'favorites' && <FavoritesView onNavigateToChat={handleNavigateToChat} />}
                {activeView === 'messages' && <MessagesView activeChatUser={activeChatUser} />}
                {activeView === 'stats' && <StatisticsView />}
                {activeView === 'admin' && <AdminView />}
                {activeView === 'settings' && <SettingsView />}
            </main>
        </div>
    );
}

export default App;
