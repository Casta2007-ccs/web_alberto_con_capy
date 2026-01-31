import React, { useState, useEffect } from 'react';
import { fetchTalents, toggleFavoriteApi } from '../services/api';
import TalentCard from './TalentCard';

/**
 * FavoritesView Component
 * 
 * Displays the user's saved/favorited talents.
 * Allows quick access to messaging from the saved list.
 */
const FavoritesView = ({ onNavigateToChat }) => {
    // State
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * Effect: Load favorites on component mount.
     */
    useEffect(() => {
        const loadFavorites = async () => {
            setLoading(true);
            try {
                // Fetch only favorites (simulated by filtering client-side for this demo)
                const allTalents = await fetchTalents({});
                const favs = allTalents.filter(t => t.isFavorite);
                setTalents(favs);
            } catch (err) {
                console.error("Error loading favorites", err);
            }
            setLoading(false);
        };
        loadFavorites();
    }, []);

    /**
     * Removes a talent from favorites.
     */
    const handleFavorite = async (id) => {
        // Optimistic update
        setTalents(prev => prev.filter(t => t.id !== id));
        await toggleFavoriteApi(id);
    };

    return (
        <div id="view-favorites" className="view-section active" style={{ display: 'block' }}>
            <header className="top-header">
                <div className="header-titles">
                    <h1>Favoritos</h1>
                    <p>Talentos guardados para futuras referencias</p>
                </div>
            </header>

            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Cargando favoritos...</p>
            ) : talents.length === 0 ? (
                <div className="empty-state">
                    <i className="fa-regular fa-bookmark"></i>
                    <p>No tienes favoritos aún</p>
                </div>
            ) : (
                <div className="talent-grid" id="favorites-grid">
                    {talents.map(person => (
                        <TalentCard
                            key={person.id}
                            person={person}
                            onToggleFav={handleFavorite}
                            onChat={onNavigateToChat}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesView;
