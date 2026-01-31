import React from 'react';

/**
 * TalentCard Component
 * 
 * Displays individual talent profile summary.
 * Used in grid layouts (Discovery, Favorites).
 * 
 * @param {Object} props
 * @param {Object} props.person - The talent data object
 * @param {Function} props.onToggleFav - Handler for favorite toggle
 * @param {Function} [props.onChat] - Optional handler for initiating chat
 */
const TalentCard = ({ person, onToggleFav, onChat }) => {
    return (
        <div className="talent-card">
            {/* Card Image & Overlays */}
            <div className="card-image">
                <img src={person.image} alt={person.name} />
                <div className="match-badge">
                    <i className="fa-solid fa-bolt"></i> {person.match}% Match
                </div>
                <div className="island-badge">
                    <i className="fa-solid fa-location-dot"></i> {person.island}
                </div>

                {/* Hover Actions */}
                <div className="card-overlay-actions">
                    <button
                        className={`action-icon-btn ${person.isFavorite ? 'liked' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFav(person.id);
                        }}
                    >
                        <i className={`${person.isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                    </button>
                    <button
                        className="action-icon-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onChat) onChat(person.name);
                        }}
                    >
                        <i className="fa-regular fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            {/* Card Info Content */}
            <div className="card-info">
                <span className="role-tag">{person.role}</span>
                <h3>{person.name}</h3>
                <div className="attributes">
                    {person.attrs.map((attr, index) => (
                        <span key={index} className="attr">{attr}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TalentCard;
