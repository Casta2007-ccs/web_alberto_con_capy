import React from 'react';

/**
 * SettingsView Component
 * 
 * Allows the user to configure global preferences and account settings.
 * Includes toggles for notifications and display options.
 */
const SettingsView = () => {
    return (
        <div id="view-settings" className="view-section active" style={{ display: 'block' }}>
            <header className="top-header">
                <div className="header-titles">
                    <h1>Configuración</h1>
                    <p>Preferencias generales de la cuenta</p>
                </div>
            </header>

            <div className="settings-grid">
                {/* Email Notifications Setting */}
                <div className="setting-card">
                    <div className="setting-info">
                        <h3>Notificaciones por Email</h3>
                        <p>Recibe alertas sobre nuevos candidatos que coincidan</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                {/* Dark Mode Setting (Locked/Disabled for demo) */}
                <div className="setting-card">
                    <div className="setting-info">
                        <h3>Modo Oscuro</h3>
                        <p>Activar la interfaz oscura (por defecto)</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked disabled />
                        <span className="slider" style={{ cursor: 'not-allowed', opacity: 0.7 }}></span>
                    </label>
                </div>

                {/* Public Profile Visibility */}
                <div className="setting-card">
                    <div className="setting-info">
                        <h3>Perfil Público</h3>
                        <p>Permitir que las agencias encuentren tu perfil</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
