import React, { useState } from 'react';

/**
 * ProjectsView Component
 * 
 * Manages casting projects (e.g., campaigns, movies).
 * Displays a list of active projects with summary metadata.
 */
const ProjectsView = () => {
    // Initial State: Mock Projects
    const [projects, setProjects] = useState([
        {
            id: 1,
            title: "Campaña Verano 2026",
            client: "Turismo de Canarias",
            candidates: 12,
            updated: "2h",
            icon: "fa-umbrella-beach",
            color: "var(--primary)" // Default theme color
        },
        {
            id: 2,
            title: "Serie \"Volcán\" - Extras",
            client: "Netflix Production",
            candidates: 154,
            updated: "5h",
            icon: "fa-film",
            bgColor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981"
        }
    ]);

    /**
     * Simulator for adding a new project dynamically.
     */
    const handleNewProject = () => {
        const newProject = {
            id: projects.length + 1,
            title: "Nuevo Casting Comercial",
            client: "Agencia Local",
            candidates: 0,
            updated: "Ahora",
            icon: "fa-camera",
            bgColor: "rgba(255, 159, 67, 0.1)",
            color: "#ff9f43"
        };
        setProjects([newProject, ...projects]);
    };

    return (
        <div id="view-projects" className="view-section active" style={{ display: 'block' }}>
            <header className="top-header">
                <div className="header-titles">
                    <h1>Mis Proyectos</h1>
                    <p>Gestiona tus castings activos y selecciones</p>
                </div>
                {/* Primary Action Button */}
                <button className="primary-btn" onClick={handleNewProject}>
                    <i className="fa-solid fa-plus"></i> Nuevo Proyecto
                </button>
            </header>

            {/* Grid of Project Cards */}
            <div className="projects-grid">
                {projects.map(project => (
                    <div className="project-card" key={project.id}>
                        {/* Project Icon/Thumbnail */}
                        <div
                            className="project-icon"
                            style={{
                                background: project.bgColor || 'rgba(92, 98, 236, 0.1)',
                                color: project.color
                            }}
                        >
                            <i className={`fa-solid ${project.icon}`}></i>
                        </div>

                        {/* Project Details */}
                        <div className="project-info">
                            <h3>{project.title}</h3>
                            <p>{project.client}</p>
                            <span className="project-meta">
                                {project.candidates} Candidatos • Actualizado hace {project.updated}
                            </span>
                        </div>

                        {/* Interactive Arrow Indicator */}
                        <i className="fa-solid fa-chevron-right arrow"></i>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsView;
