import React, { useState, useEffect } from 'react';
import { fetchTalents, toggleFavoriteApi } from '../services/api';
import TalentCard from './TalentCard';

/**
 * DiscoveryView Component
 * 
 * The main search page for the application.
 * Features:
 * - Semantic AI Search (simulated)
 * - Filtering by Island and Role
 * - Infinite scroll / Grid display of talents
 */
const DiscoveryView = () => {
    // UI State
    const [showNotifications, setShowNotifications] = useState(false);

    // Data State
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        island: 'all',
        role: 'all',
        search: ''
    });

    /**
     * Effect: Load talents whenever filters change.
     * Includes a debounce for  text search to avoid API spam.
     */
    useEffect(() => {
        const loadTalents = async () => {
            setLoading(true);
            try {
                const data = await fetchTalents(filters);
                setTalents(data);
            } catch (error) {
                console.error("Failed to load talents", error);
            }
            setLoading(false);
        };

        const timeoutId = setTimeout(() => {
            loadTalents();
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [filters]);

    /**
     * Updates local filter state based on input changes.
     */
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Toggles favorite status for a talent.
     * Uses optimistic UI updates for immediate feedback.
     */
    const handleFavorite = async (id) => {
        // Optimistic Update
        const updatedTalents = talents.map(t =>
            t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
        );
        setTalents(updatedTalents);

        // Server Sync
        try {
            await toggleFavoriteApi(id);
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            // Revert on failure would go here
        }
    };

    return (
        <div id="view-discovery" className="view-section active" style={{ display: 'block' }}>

            {/* Header with Search and Notification Bell */}
            <header className="top-header" style={{ position: 'relative' }}>
                <div className="header-titles">
                    <h1>Búsqueda de Talento</h1>
                    <p>Encuentra el perfil perfecto usando Inteligencia Artificial</p>
                </div>

                {/* Notification Dropdown Logic */}
                <div className="notification-area" style={{ position: 'relative' }}>
                    <button
                        className="icon-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <i className="fa-regular fa-bell"></i>
                        <span className="badge">3</span>
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown" style={{
                            position: 'absolute',
                            top: '50px',
                            right: '0',
                            width: '300px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            zIndex: 100
                        }}>
                            <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                                Notificaciones
                            </div>
                            {/* Static Notification Items */}
                            <div className="notif-list">
                                <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', fontSize: '13px', display: 'flex', gap: '10px' }}>
                                    <i className="fa-solid fa-bolt" style={{ color: 'var(--primary)', marginTop: '3px' }}></i>
                                    <div>
                                        <p style={{ marginBottom: '4px' }}><strong>Match 98% encontrado</strong></p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Elena R. encaja con "Campaña Verano"</p>
                                    </div>
                                </div>
                                {/* ... more items ... */}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* AI Search & Filter Section */}
            <section className="search-section">
                <div className="ai-search-box">
                    <div className="search-input-wrapper">
                        <i className="fa-solid fa-wand-magic-sparkles ai-icon"></i>
                        <input
                            type="text"
                            name="search"
                            placeholder="Describe lo que buscas... Ej: 'Mujer estilo mediterráneo para anuncio de playa'"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>

                <div className="filters-bar">
                    <div className="filter-group">
                        <label><i className="fa-solid fa-location-dot"></i> Isla</label>
                        <select name="island" onChange={handleFilterChange} value={filters.island}>
                            <option value="all">Todas las Islas</option>
                            <option value="Tenerife">Tenerife</option>
                            <option value="Gran Canaria">Gran Canaria</option>
                            <option value="Lanzarote">Lanzarote</option>
                            <option value="Fuerteventura">Fuerteventura</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label><i className="fa-solid fa-layer-group"></i> Categoría</label>
                        <select name="role" onChange={handleFilterChange} value={filters.role}>
                            <option value="all">Todas</option>
                            <option value="Model">Model</option>
                            <option value="Actor">Actor</option>
                            <option value="Extra">Extra</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="results-area">
                <div className="results-header">
                    <h3>Resultados ({talents.length})</h3>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Cargando talentos...</p>
                ) : (
                    <div className="talent-grid">
                        {talents.map(person => (
                            <TalentCard
                                key={person.id}
                                person={person}
                                onToggleFav={handleFavorite}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DiscoveryView;
