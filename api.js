/**
 * Scout & Connect - API Service
 * 
 * This file handles all data interactions.
 * Currently uses mocks/local storage, but is structured to easily switch to a real REST API.
 */

const API_DELAY = 600; // Simulated network delay in ms

const ApiService = {

    /**
     * Authentication Service
     */
    Auth: {
        /**
         * Log in a user
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise<Object>} User object
         */
        login: async (email, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simple Mock Logic
                    if (email && password) {
                        let user = { name: "Usuario", role: "User", email };

                        if (email.includes('ana')) user = { name: "Ana García", role: "Directora de Casting", email, avatar: "https://ui-avatars.com/api/?name=Ana+Garcia&background=0D8ABC&color=fff", hasProfile: true };
                        else if (email.includes('juan')) user = { name: "Juan Pérez", role: "Agente", email, avatar: "https://ui-avatars.com/api/?name=Juan+Perez&background=random", hasProfile: true };

                        // Persist session
                        sessionStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.setItem('currentUser', JSON.stringify(user));

                        resolve(user);
                    } else {
                        reject(new Error("Credenciales inválidas"));
                    }
                }, API_DELAY);
            });
        },

        /**
         * Register a new user
         * @param {Object} data { name, email, password }
         */
        register: async (data) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (data.email && data.password) {
                        const user = {
                            name: data.name,
                            role: "User",
                            email: data.email,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
                            hasProfile: false
                        };

                        sessionStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.setItem('currentUser', JSON.stringify(user));
                        sessionStorage.setItem('isNewUser', 'true');

                        resolve(user);
                    } else {
                        reject(new Error("Datos incompletos"));
                    }
                }, API_DELAY);
            });
        },

        /**
         * Login as Guest
         */
        loginAsGuest: async () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = { name: "Invitado", role: "Guest", email: null, avatar: "https://ui-avatars.com/api/?name=Invitado&background=333&color=fff" };
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    resolve(user);
                }, API_DELAY / 2);
            });
        },

        logout: () => {
            sessionStorage.clear();
            return Promise.resolve();
        },

        getCurrentUser: () => {
            const userStr = sessionStorage.getItem('currentUser');
            return userStr ? JSON.parse(userStr) : null;
        },

        isAuthenticated: () => {
            return !!sessionStorage.getItem('isLoggedIn');
        },

        recoverPassword: async (email) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`Sending recovery email to ${email}`);
                    resolve(true); // Always success for security/mock
                }, API_DELAY);
            });
        }
    },

    /**
     * Talent Data Service
     */
    Talent: {
        // Internal Mock Data
        _data: [
            { id: 1, name: "Elena Rodríguez", role: "Model", island: "Tenerife", match: 98, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600", attrs: ["Ojos Verdes", "Pelo Castaño", "1.75m", "Estilo Nórdico"] },
            { id: 2, name: "Javier Mendoza", role: "Actor", island: "Gran Canaria", match: 95, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600", attrs: ["Barba", "Atlético", "1.82m", "Expresivo"] },
            { id: 3, name: "Sofía López", role: "Extra", island: "Lanzarote", match: 88, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600", attrs: ["Pelo Rizado", "Morena", "1.65m"] },
            { id: 4, name: "Marc Torres", role: "Model", island: "Fuerteventura", match: 92, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600", attrs: ["Pecas", "Alternativo", "1.78m"] },
            { id: 5, name: "Lucía Pérez", role: "Commercial", island: "Tenerife", match: 85, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600", attrs: ["Sonrisa", "Formal", "1.70m"] },
            { id: 6, name: "Pablo Sánchez", role: "Actor", island: "Gran Canaria", match: 94, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600", attrs: ["Formal", "Canas", "1.76m"] },
            { id: 7, name: "Carla Díaz", role: "Model", island: "La Palma", match: 91, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=600", attrs: ["Pelo Corto", "Edgy", "1.72m"] },
            { id: 8, name: "Daniel Fernández", role: "Commercial", island: "Tenerife", match: 89, image: "https://images.unsplash.com/photo-1480429370139-8188810dba07?auto=format&fit=crop&q=80&w=600", attrs: ["Gafas", "Casual", "1.80m"] },
            { id: 9, name: "Marina Vega", role: "Model", island: "Lanzarote", match: 87, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600", attrs: ["Tatuajes", "1.68m", "Fitness"] },
            { id: 10, name: "Jorge Hernández", role: "Extra", island: "Fuerteventura", match: 82, image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80&w=600", attrs: ["Pelo Largo", "Surfero", "1.85m"] },
            { id: 11, name: "Carmen Ruiz", role: "Actor", island: "La Gomera", match: 93, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600", attrs: ["Teatro", "Voz Grave", "1.62m"] },
            { id: 12, name: "Andrés Padrón", role: "Commercial", island: "El Hierro", match: 84, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600", attrs: ["Joven", "Pecas", "1.70m"] },
            { id: 13, name: "Valentina Santoro", role: "Model", island: "Gran Canaria", match: 96, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600", attrs: ["Alta Costura", "1.79m", "Rubia"] },
            { id: 14, name: "Diego Lima", role: "Actor", island: "Tenerife", match: 90, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600", attrs: ["Cine", "Serio", "1.83m"] },
            { id: 15, name: "Isabella Morales", role: "Extra", island: "La Palma", match: 81, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600", attrs: ["Sonrisa", "Natural", "1.65m"] },
            { id: 16, name: "Roberto Klein", role: "Commercial", island: "Lanzarote", match: 86, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600", attrs: ["Maduro", "Elegante", "1.76m"] },
            { id: 17, name: "Aitana García", role: "Model", island: "Tenerife", match: 91, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600", attrs: ["Pelo Liso", "Moda", "1.73m"] },
            { id: 18, name: "Miguel Ángel", role: "Actor", island: "Gran Canaria", match: 88, image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=600", attrs: ["Perfil Intenso", "Cine", "1.80m"] },
            { id: 19, name: "Laura Ramos", role: "Extra", island: "Fuerteventura", match: 83, image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&q=80&w=600", attrs: ["Piel Bronceada", "Deportista", "1.68m"] },
            { id: 20, name: "Kevin Díaz", role: "Model", island: "Tenerife", match: 89, image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=600", attrs: ["Streetwear", "Tatuajes", "1.77m"] },
            { id: 21, name: "Sara Méndez", role: "Commercial", island: "Gran Canaria", match: 86, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600", attrs: ["Amable", "Gafas", "1.64m"] },
            { id: 22, name: "Tomás Cabrera", role: "Actor", island: "Lanzarote", match: 92, image: "https://images.unsplash.com/photo-1501196354995-cbb51c65dPB9?auto=format&fit=crop&q=80&w=600", attrs: ["Barba", "Voz Profunda", "1.84m"] },
            { id: 23, name: "Nerea Gil", role: "Model", island: "La Gomera", match: 87, image: "https://images.unsplash.com/photo-1485290334039-a3c69043e541?auto=format&fit=crop&q=80&w=600", attrs: ["Pelo Rizado", "Natural", "1.71m"] },
            { id: 24, name: "Hugo Martín", role: "Extra", island: "El Hierro", match: 80, image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=600", attrs: ["Joven", "Sonriente", "1.75m"] },
            { id: 25, name: "Alejandro Sosa", role: "Actor", island: "Tenerife", match: 89, image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600", attrs: ["Casting", "Televisión", "1.78m"] },
            { id: 26, name: "Martina Cruz", role: "Model", island: "Gran Canaria", match: 94, image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=600", attrs: ["Pasarela", "1.80m", "Elegante"] },
            { id: 27, name: "Lucas Benítez", role: "Commercial", island: "Lanzarote", match: 85, image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=600", attrs: ["Sonriente", "Juvenil", "1.72m"] },
            { id: 28, name: "Valeria Navarro", role: "Extra", island: "Fuerteventura", match: 82, image: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=600", attrs: ["Natural", "Deportista", "1.65m"] },
            { id: 29, name: "Bruno Castro", role: "Actor", island: "Tenerife", match: 91, image: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=600", attrs: ["Intérprete", "Voz", "1.76m"] },
            { id: 30, name: "Paola Ortiz", role: "Model", island: "Gran Canaria", match: 88, image: "https://images.unsplash.com/photo-1492106087820-71F1a00D2B11?auto=format&fit=crop&q=80&w=600", attrs: ["Fitness", "1.69m", "Dinámica"] },
            { id: 31, name: "Ismael Raya", role: "Commercial", island: "La Palma", match: 86, image: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?auto=format&fit=crop&q=80&w=600", attrs: ["Casual", "Barba", "1.81m"] },
            { id: 32, name: "Claudia Blanco", role: "Extra", island: "Lanzarote", match: 84, image: "https://images.unsplash.com/photo-1529139578598-3840d44d8c6b?auto=format&fit=crop&q=80&w=600", attrs: ["Versátil", "1.62m", "Gesto"] },
            { id: 33, name: "Gonzalo Velasco", role: "Model", island: "Tenerife", match: 90, image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600", attrs: ["Masculino", "1.85m", "Atlético"] },
            { id: 34, name: "Irene Soto", role: "Actor", island: "Gran Canaria", match: 93, image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&q=80&w=600", attrs: ["Drama", "1.67m", "Expresiva"] },
            { id: 35, name: "Felipe Dorta", role: "Commercial", island: "Fuerteventura", match: 87, image: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=600", attrs: ["Simpático", "Gafas", "1.79m"] },
            { id: 36, name: "Natalia Padrón", role: "Extra", island: "Tenerife", match: 81, image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=600", attrs: ["Cotidianidad", "1.70m", "Cercana"] },
            { id: 37, name: "Óscar Fleitas", role: "Actor", island: "Gran Canaria", match: 89, image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&q=80&w=600", attrs: ["Fuerte", "1.83m", "Acción"] },
            { id: 38, name: "Rebeca Vidal", role: "Model", island: "Lanzarote", match: 92, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600", attrs: ["Sofisticada", "1.76m", "Moda"] },
            { id: 39, name: "Samuel Betancor", role: "Extra", island: "El Hierro", match: 79, image: "https://images.unsplash.com/photo-1499996860823-52144cc65f8f?auto=format&fit=crop&q=80&w=600", attrs: ["Pueblo", "Auténtico", "1.72m"] },
            { id: 40, name: "Alba Socas", role: "Commercial", island: "Tenerife", match: 88, image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600", attrs: ["Oficina", "1.66m", "Profesional"] }
        ],

        /**
         * Get all available talent
         */
        getAll: async () => {
            return new Promise(resolve => {
                setTimeout(() => resolve([...ApiService.Talent._data]), 300); // 300ms simulated delay
            });
        },

        /**
         * Search talent by params
         */
        search: async (params = {}) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    let results = [...ApiService.Talent._data];

                    if (params.island && params.island !== 'all') {
                        results = results.filter(t => t.island === params.island);
                    }
                    if (params.category && params.category !== 'all') {
                        results = results.filter(t => t.role === params.category);
                    }
                    if (params.query) {
                        const q = params.query.toLowerCase();
                        results = results.filter(t =>
                            t.name.toLowerCase().includes(q) ||
                            t.attrs.some(a => a.toLowerCase().includes(q))
                        );
                    }

                    resolve(results);
                }, 300);
            });
        },

        getById: async (id) => {
            return new Promise(resolve => {
                const found = ApiService.Talent._data.find(t => t.id === parseInt(id));
                setTimeout(() => resolve(found), 200);
            });
        }
    },

    Profile: {
        /**
         * Create or Update User Profile
         * @param {Object} profileData 
         */
        create: async (profileData) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Update current user in session
                    const userStr = sessionStorage.getItem('currentUser');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        const updatedUser = { ...user, ...profileData, hasProfile: true };
                        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
                        console.log("Profile saved to BDD:", updatedUser); // Mock BDD save
                    }
                    resolve({ success: true });
                }, API_DELAY);
            });
        }
    }
};

// Expose globally
window.ApiService = ApiService;
