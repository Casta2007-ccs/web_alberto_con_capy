import React, { useState } from 'react';

/**
 * AdminView Component
 * 
 * Manages user access and permissions.
 * Displays a table of users with their roles and status.
 */
const AdminView = () => {
    // Mock Data State
    const [users, setUsers] = useState([
        { id: 1, name: "Maria Garcia", email: "maria@agency.com", role: "Admin", status: "Active" },
        { id: 2, name: "Juan Perez", email: "juan@casting.com", role: "Recruiter", status: "Active" },
        { id: 3, name: "Luisa Lane", email: "luisa@guest.com", role: "Guest", status: "Inactive" }
    ]);

    /**
     * Handles user deletion.
     * @param {number} id - User ID to delete
     */
    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div id="view-admin" className="view-section active" style={{ display: 'block' }}>
            <header className="top-header">
                <div className="header-titles">
                    <h1>Gestión de Equipo</h1>
                    <p>Administra accesos y permisos de la plataforma</p>
                </div>
                <button className="primary-btn"><i className="fa-solid fa-plus"></i> Añadir Usuario</button>
            </header>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar-small" style={{ background: user.role === 'Admin' ? 'var(--primary)' : 'var(--accent)' }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        {user.name}
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-muted)' }}>{user.email}</td>
                                <td>
                                    <span className="role-badge">{user.role}</span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                        <span className="status-dot"></span>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="action-btn"><i className="fa-regular fa-pen-to-square"></i></button>
                                    <button onClick={() => handleDelete(user.id)} className="action-btn delete"><i className="fa-regular fa-trash-can"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminView;
