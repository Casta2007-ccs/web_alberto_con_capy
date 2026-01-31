import React from 'react';

/**
 * StatisticsView Component
 * 
 * Displays key performance indicators (KPIs) and data visualizations.
 * Uses CSS graphs for lightweight rendering.
 */
const StatisticsView = () => {
    // Mock Data for statistics
    const stats = {
        totalCandidates: 1254,
        activeProjects: 8,
        successRate: 85,
        islands: [
            { name: 'Tenerife', count: 450, color: '#5c62ec' },
            { name: 'Gran Canaria', count: 380, color: '#00d2ff' },
            { name: 'Lanzarote', count: 210, color: '#10b981' },
            { name: 'Fuerteventura', count: 180, color: '#ff9f43' }
        ]
    };

    // Calculate max value for bar chart scaling
    const maxCount = Math.max(...stats.islands.map(i => i.count));

    return (
        <div id="view-stats" className="view-section active" style={{ display: 'block' }}>
            <header className="top-header">
                <div className="header-titles">
                    <h1>Estadísticas</h1>
                    <p>Métricas de rendimiento y distribución de talento</p>
                </div>
            </header>

            {/* KPI Cards Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Candidatos</span>
                    <span className="stat-value">{stats.totalCandidates}</span>
                    <span className="stat-trend positive"><i className="fa-solid fa-arrow-up"></i> +12% este mes</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Proyectos Activos</span>
                    <span className="stat-value">{stats.activeProjects}</span>
                    <span className="stat-trend neutral"><i className="fa-solid fa-minus"></i> En curso</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Tasa de Éxito</span>
                    <span className="stat-value">{stats.successRate}%</span>
                    <span className="stat-trend positive"><i className="fa-solid fa-arrow-up"></i> Alta eficiencia</span>
                </div>
            </div>

            {/* Distribution Chart Section */}
            <div className="chart-section">
                <h3>Distribución por Isla</h3>
                <div className="chart-container">
                    {stats.islands.map(item => (
                        <div key={item.name} className="chart-row">
                            <span className="chart-label">{item.name}</span>
                            <div className="chart-bar-bg">
                                <div
                                    className="chart-bar-fill"
                                    style={{
                                        width: `${(item.count / maxCount) * 100}%`,
                                        background: item.color
                                    }}
                                ></div>
                            </div>
                            <span className="chart-val">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;
