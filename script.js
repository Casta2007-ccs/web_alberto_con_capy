/**
 * Scout & Connect - Main Application Script
 * 
 * This script handles:
 * 1. SPA-like Navigation (switching views without reload)
 * 2. Talent Data Management & Rendering
 * 3. Search & Filter Logic
 * 4. Interaction Logic (Favorites, Chat)
 */

// Authentication Check (Simulated)
if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
}

// Update User info if available
const savedUser = sessionStorage.getItem('userName');
if (savedUser) {
    // Wait for DOM
    document.addEventListener('DOMContentLoaded', () => {
        const nameEl = document.querySelector('.user-info h4');
        const roleEl = document.querySelector('.user-info p');
        const imgEl = document.querySelector('.user-profile img');

        if (nameEl) nameEl.textContent = savedUser;

        // Update Avatar
        if (imgEl) {
            imgEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(savedUser)}&background=333&color=fff`;
        }

        // Adjust Role for Guest
        if (savedUser === 'Invitado' && roleEl) {
            roleEl.textContent = 'Visitante';
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements Reference ---
    const talentGrid = document.getElementById('talent-grid');
    const favoritesGrid = document.getElementById('favorites-grid');
    const resultCount = document.getElementById('result-count');
    const semanticInput = document.getElementById('semantic-search');
    const searchBtn = document.querySelector('.search-btn');
    const islandFilter = document.getElementById('island-filter');
    const categoryFilter = document.getElementById('category-filter');
    const aiTagsContainer = document.getElementById('ai-tags');

    // --- Navigation System ---
    const navLinks = document.querySelectorAll('.nav-menu li');
    const sections = document.querySelectorAll('.view-section');

    /**
     * Handles navigation click events.
     * Hides all sections and shows the target one based on 'data-view' attribute.
     */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const viewId = link.getAttribute('data-view');
            if (viewId) {
                e.preventDefault();

                // 1. Update Sidebar Active State
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // 2. Switch View Section
                sections.forEach(section => {
                    section.classList.remove('active');
                    section.style.display = 'none';

                    // Match the section ID (e.g., view-discovery) with the nav data (e.g., discovery)
                    if (section.id === `view-${viewId}`) {
                        section.style.display = 'block';
                        // Tiny timeout to allow display:block to apply before opacity transition
                        setTimeout(() => section.classList.add('active'), 10);
                    }
                });

                // 3. Special View Initialization
                if (viewId === 'favorites') {
                    renderFavorites();
                }
            }
        });
    });

    // --- Mock Data: Talent Pool ---
    // In a real app, this would come from an API endpoint
    // --- Data Management ---
    // Fetch from API Service
    let talentData = [];

    /**
     * Renders skeleton loading cards
     */
    function renderSkeletons(container = talentGrid, count = 8) {
        container.innerHTML = '';
        const skeletonHTML = `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                </div>
            </div>
        `;

        for (let i = 0; i < count; i++) {
            container.innerHTML += skeletonHTML;
        }
    }

    async function initializeData() {
        try {
            // Show loading state
            renderSkeletons();

            // Artificial delay to show off skeletons slightly longer if API is too fast (optional)
            // await new Promise(r => setTimeout(r, 800)); 

            talentData = await ApiService.Talent.getAll();
            renderTalent(talentData);
        } catch (error) {
            console.error("Failed to load talent data", error);
            talentGrid.innerHTML = '<p class="error-msg">Error cargando talentos. Por favor recarga la página.</p>';
        }
    }

    // Initialize
    initializeData();

    // State for favorites (list of IDs)
    let favorites = [];

    /**
     * Generates the HTML for a single talent card.
     * @param {Object} person - The talent data object
     * @returns {string} HTML string for the card
     */
    function cardTemplate(person) {
        const isFav = favorites.includes(person.id);
        const attrsHtml = person.attrs.map(attr => `<span class="attr">${attr}</span>`).join('');

        return `
            <div class="card-image">
                <img src="${person.image}" alt="${person.name}">
                <div class="match-badge">
                    <i class="fa-solid fa-bolt"></i> ${person.match}% Match
                </div>
                <div class="island-badge">
                    <i class="fa-solid fa-location-dot"></i> ${person.island}
                </div>
                <!-- Hover Overlay Actions -->
                <div class="card-overlay-actions">
                    <button class="action-icon-btn ${isFav ? 'liked' : ''}" onclick="toggleFavorite(${person.id}, event)" title="Añadir a favoritos">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <button class="action-icon-btn" onclick="openMessageModal('${person.name}', event)" title="Enviar mensaje">
                        <i class="fa-regular fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <div class="card-info">
                <span class="role-tag">${person.role}</span>
                <h3>${person.name}</h3>
                <div class="attributes">
                    ${attrsHtml}
                </div>
            </div>
        `;
    }

    /**
     * Renders the talent grid.
     * @param {Array} data - Array of talent objects to render
     * @param {HTMLElement} container - DOM element to render into
     */
    function renderTalent(data, container = talentGrid) {
        container.innerHTML = '';

        // Update the result counter only if rendering main grid
        if (container === talentGrid) resultCount.textContent = data.length;

        // Handle empty favorites state
        if (data.length === 0 && container === favoritesGrid) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-bookmark"></i>
                    <p>No tienes favoritos aún</p>
                </div>`;
            return;
        }

        data.forEach(person => {
            const card = document.createElement('div');
            card.className = 'talent-card';
            card.innerHTML = cardTemplate(person);

            // Add Click Event to open details (ignoring if clicked on inner buttons)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    openTalentDetail(person.id);
                }
            });

            container.appendChild(card);
        });

        // Add Load More Button if main grid
        if (container === talentGrid && data.length > 0) {
            const loadMoreContainer = document.createElement('div');
            loadMoreContainer.className = 'load-more-container';
            loadMoreContainer.innerHTML = `
                <button class="load-more-btn">
                    <i class="fa-solid fa-rotate-right"></i> Cargar Más Talentos
                </button>
            `;
            container.appendChild(loadMoreContainer);

            loadMoreContainer.querySelector('button').addEventListener('click', function () {
                this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
                setTimeout(() => {
                    alert('Has llegado al final de la lista de demostración.');
                    this.innerHTML = '<i class="fa-solid fa-check"></i> Todo Cargado';
                    this.style.opacity = '0.5';
                    this.style.cursor = 'default';
                }, 1000);
            });
        }
    }

    // --- Global Actions (attached to window for inline HTML onclick access) ---

    /**
     * Toggles a talent ID in the favorites list.
     * Updates the UI immediately.
     */
    window.toggleFavorite = function (id, e) {
        e.stopPropagation(); // Prevent card click event
        const index = favorites.indexOf(id);
        const btn = e.currentTarget;
        const icon = btn.querySelector('i');

        if (index === -1) {
            // Add to favorites
            favorites.push(id);
            btn.classList.add('liked');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        } else {
            // Remove from favorites
            favorites.splice(index, 1);
            btn.classList.remove('liked');
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');

            // If currently viewing favorites, refresh the list to remove the item instantly
            const activeSection = document.querySelector('.view-section.active');
            if (activeSection && activeSection.id === 'view-favorites') {
                renderFavorites();
            }
        }
    };

    window.openMessageModal = function (name, e) {
        if (e) e.stopPropagation();

        // Switch to Messages View
        const messagesLink = document.querySelector('li[data-view="messages"]');
        if (messagesLink) messagesLink.click();

        // Update Chart Header Name (Simulation)
        setTimeout(() => {
            const chatHeader = document.querySelector('.chat-header-inner h4');
            if (chatHeader) chatHeader.textContent = name;

            // Clear previous messages and add a system "started chat" message
            const chatMessages = document.querySelector('.chat-messages');
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="msg received">
                        <p>Has iniciado una conversación con <strong>${name}</strong>.</p>
                    </div>
                `;
            }
        }, 100);
    };

    /**
     * Filters and renders the favorites grid.
     */
    function renderFavorites() {
        const favData = talentData.filter(t => favorites.includes(t.id));
        renderTalent(favData, favoritesGrid);
    }

    // --- Initialization ---
    renderTalent(talentData);

    // --- Search & Filter Logic ---
    const sortFilter = document.getElementById('sort-filter');
    const resetBtn = document.getElementById('reset-filters-btn');

    async function filterTalent() {
        // Show loading in grid
        renderSkeletons();

        const params = {
            island: islandFilter.value,
            category: categoryFilter.value,
            query: semanticInput.value.toLowerCase()
        };

        const sortValue = sortFilter ? sortFilter.value : 'match';

        try {
            let filtered = await ApiService.Talent.search(params);

            // Apply Sorting (Client side for now, or could be API param)
            filtered.sort((a, b) => {
                if (sortValue === 'match') return b.match - a.match;
                if (sortValue === 'match-asc') return a.match - b.match;
                if (sortValue === 'name') return a.name.localeCompare(b.name);
                return 0;
            });

            renderTalent(filtered);
            userCurrentData = filtered; // Keep track for other usages if needed
        } catch (error) {
            console.error(error);
            talentGrid.innerHTML = '<p class="error-msg">Error al filtrar.</p>';
        }
    }

    // Reset Filters
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            islandFilter.value = 'all';
            categoryFilter.value = 'all';
            semanticInput.value = '';
            if (sortFilter) sortFilter.value = 'match';
            aiTagsContainer.innerHTML = '';
            filterTalent();

            // Animation for feedback
            resetBtn.innerHTML = '<i class="fa-solid fa-check"></i> Limpio';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Limpiar';
            }, 1000);
        });
    }

    // AI Semantic Search Simulation
    searchBtn.addEventListener('click', () => {
        const query = semanticInput.value;
        if (!query) return;

        // Visual loading state
        searchBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

        // Simulate AI delay
        setTimeout(() => {
            searchBtn.textContent = 'Buscar';
            aiTagsContainer.innerHTML = '';

            // Extract some "keywords"
            const keywords = query.split(' ').filter(w => w.length > 3).slice(0, 3);

            // Display "AI Generated" tags
            keywords.forEach(word => {
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${word}`;
                aiTagsContainer.appendChild(tag);
            });

            filterTalent();
        }, 600);
    });

    // Event Listeners for Filters
    islandFilter.addEventListener('change', filterTalent);
    categoryFilter.addEventListener('change', filterTalent);
    if (sortFilter) sortFilter.addEventListener('change', filterTalent);

    // Allow "Enter" key in search box
    semanticInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });

    // --- Dynamic Search Placeholder Animation ---
    const placeholderExamples = [
        "Elena Rodríguez en Tenerife...",
        "Actor con barba en Gran Canaria...",
        "Modelo de alta costura...",
        "Extra para rodaje en Lanzarote...",
        "Chica con pelo rizado...",
        "Marc Torres Fuerteventura..."
    ];

    let placeholderIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typePlaceholder() {
        if (!animationRunning) {
            setTimeout(typePlaceholder, 1000);
            return;
        }

        const currentText = placeholderExamples[placeholderIndex];

        if (isDeleting) {
            semanticInput.setAttribute('placeholder', currentText.substring(0, charIndex - 1));
            charIndex--;
            typeSpeed = 50;
        } else {
            semanticInput.setAttribute('placeholder', currentText.substring(0, charIndex + 1));
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            placeholderIndex = (placeholderIndex + 1) % placeholderExamples.length;
            typeSpeed = 500; // Pause before new typing
        }

        setTimeout(typePlaceholder, typeSpeed);
    }

    // Start animation if field is not focused
    let animationRunning = true;
    typePlaceholder();

    semanticInput.addEventListener('focus', () => {
        animationRunning = false;
        semanticInput.setAttribute('placeholder', 'Escribe tu búsqueda...');
    });

    semanticInput.addEventListener('blur', () => {
        animationRunning = true;
        // Logic handles the restart naturally or we could force reset
    });

    // Quick Filter by clicking roles
    talentGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('role-tag')) {
            e.stopPropagation(); // Don't open modal
            const role = e.target.textContent;

            // Map display role to value if needed, but matched usually
            const options = Array.from(categoryFilter.options).map(o => o.value);
            if (options.includes(role)) {
                categoryFilter.value = role;
                filterTalent();
                // Scroll to top
                document.querySelector('.view-section.active').scrollTop = 0;
            }
        }
    });

    // --- Real-Time Statistics Simulation ---

    // Initial simulated data (Starting high to look realistic)
    let statsData = {
        candidates: 1254,
        projects: 8,
        successRate: 85.0,
        islands: {
            tenerife: 450,
            grancanaria: 380,
            lanzarote: 210,
            fuerteventura: 180
        }
    };

    // DOM Elements for Stats
    const statCandidates = document.getElementById('stat-total-candidates');
    const statProjects = document.getElementById('stat-active-projects');
    const statSuccess = document.getElementById('stat-success-rate');
    const trendCandidates = document.getElementById('trend-candidates');

    const chartBars = {
        tenerife: document.getElementById('bar-tenerife'),
        grancanaria: document.getElementById('bar-grancanaria'),
        lanzarote: document.getElementById('bar-lanzarote'),
        fuerteventura: document.getElementById('bar-fuerteventura')
    };

    // Add Click Listeners to Chart Bars for filtering
    Object.keys(chartBars).forEach(islandKey => {
        const bar = chartBars[islandKey];
        // Allow clicking the bar to filter
        bar.style.cursor = 'pointer';
        bar.parentElement.parentElement.style.cursor = 'pointer'; // Make the whole row clickable? Ideally yes.

        // Find the row wrapper to add click there
        const row = bar.closest('.chart-row');
        if (row) {
            row.style.cursor = 'pointer';
            row.title = `Ver candidatos de ${islandKey}`;
            row.addEventListener('click', () => {
                // Formatting key to match values
                let filterVal = islandKey.charAt(0).toUpperCase() + islandKey.slice(1);
                if (islandKey === 'grancanaria') filterVal = 'Gran Canaria'; // Fix naming mismatch if any

                // Switch to Discovery View
                const discoveryLink = document.querySelector('li[data-view="discovery"]');
                if (discoveryLink) discoveryLink.click();

                // Set Filter
                if (islandFilter) {
                    islandFilter.value = filterVal;
                    // Trigger change event manually
                    const event = new Event('change');
                    islandFilter.dispatchEvent(event);
                }
            });
        }
    });

    const chartVals = {
        tenerife: document.getElementById('val-tenerife'),
        grancanaria: document.getElementById('val-grancanaria'),
        lanzarote: document.getElementById('val-lanzarote'),
        fuerteventura: document.getElementById('val-fuerteventura')
    };

    /**
     * Animate a number change
     */
    function animateValue(obj, start, end, duration, isFloat = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Calculate current value
            const val = progress * (end - start) + start;

            if (isFloat) {
                obj.innerHTML = val.toFixed(1) + '%';
            } else {
                obj.innerHTML = Math.floor(val).toLocaleString();
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure final value is set correctly
                if (isFloat) {
                    obj.innerHTML = end.toFixed(1) + '%';
                } else {
                    obj.innerHTML = Math.floor(end).toLocaleString();
                }
            }
        };
        window.requestAnimationFrame(step);
    }

    /**
     * Updates statistics randomly to simulate real-time activity
     */
    function startRealTimeUpdates() {
        // Randomly update candidates every 3-8 seconds
        setInterval(() => {
            if (Math.random() > 0.3) { // 70% chance to update
                const increment = Math.floor(Math.random() * 3) + 1; // +1 to +3
                const oldVal = statsData.candidates;
                statsData.candidates += increment;

                animateValue(statCandidates, oldVal, statsData.candidates, 1000);

                // Visual flash effect on change
                statCandidates.style.color = '#10b981'; // Green temporarily
                setTimeout(() => statCandidates.style.color = '', 500);
            }
        }, 5000);

        // Randomly fluctuate Success Rate slightly every 10 seconds
        setInterval(() => {
            const change = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2
            const oldVal = statsData.successRate;
            let newVal = oldVal + change;
            // Clamp between 80 and 99
            if (newVal > 99) newVal = 99;
            if (newVal < 80) newVal = 80;

            statsData.successRate = newVal;
            animateValue(statSuccess, oldVal, newVal, 1000, true);
        }, 10000);

        // Randomly update "Projects" rarely
        setInterval(() => {
            if (Math.random() > 0.8) {
                const change = Math.random() > 0.5 ? 1 : -1;
                const oldVal = statsData.projects;
                const newVal = oldVal + change;
                if (newVal > 0) {
                    statsData.projects = newVal;
                    animateValue(statProjects, oldVal, newVal, 500);
                }
            }
        }, 30000); // Every 30s
    }

    /**
     * Animates the chart bars from 0 to full width
     */
    function animateCharts() {
        // Reset widths first
        Object.values(chartBars).forEach(bar => bar.style.width = '0%');

        // Calculate max value for scaling (assuming 1254 total is rough baseline, specific max is ~500 for bars)
        const maxVal = 600;

        setTimeout(() => {
            Object.keys(chartBars).forEach(key => {
                const val = statsData.islands[key];
                const percentage = (val / maxVal) * 100;
                chartBars[key].style.transition = 'width 1.5s ease-out';
                chartBars[key].style.width = `${percentage}%`;

                // Also animate the number text
                animateValue(chartVals[key], 0, val, 1500);
            });
        }, 300);
    }

    // Initialize Real-Time Updates immediately
    startRealTimeUpdates();

    // Hook into existing navigation for Chart Animation
    // We already have logic that calls renderFavorites(). Let's extend it.
    // Finding the original nav click handler implies we should probably restart the loop or 
    // simply add a specific listener if we can, but since we are replacing code, let's just 
    // observe the 'click' on the stats link specifically or use the existing structure if possible.

    // Easier way: Find the stats link and add a specific listener for animation
    const statsLink = document.querySelector('li[data-view="stats"]');
    if (statsLink) {
        statsLink.addEventListener('click', () => {
            animateCharts();
        });
    }


    // --- Modal System ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal');

    function openModal(content) {
        modalBody.innerHTML = content;
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Allow Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });

    /**
     * Renders detailed profile in Modal
     */
    window.openTalentDetail = function (id) {
        const person = talentData.find(p => p.id === id);
        if (!person) return;

        const content = `
            <div class="modal-profile-header">
                <img src="${person.image}" alt="${person.name}">
                <div class="profile-main-info">
                    <h2>${person.name} <span class="role-badge">${person.role}</span></h2>
                    <p><i class="fa-solid fa-location-dot"></i> ${person.island}</p>
                    <div class="match-badge large"><i class="fa-solid fa-bolt"></i> ${person.match}% Match con tu búsqueda</div>
                </div>
            </div>
            <div class="modal-profile-body">
                <div class="profile-section">
                    <h3>Características</h3>
                    <div class="attributes-grid">
                        ${person.attrs.map(a => `<span class="attr-tag">${a}</span>`).join('')}
                    </div>
                </div>
                <div class="profile-section">
                    <h3>Experiencia Reciente</h3>
                    <ul class="experience-list">
                        <li>Campaña Verano 2025 - Gran Canaria</li>
                        <li>Figuración "La Casa de Papel" - Temporada Final</li>
                        <li>Shooting Catálogo Zara - Tenerife</li>
                    </ul>
                </div>
                <div class="profile-actions">
                     <button class="primary-btn" onclick="openMessageModal('${person.name}', event); closeModal()"><i class="fa-regular fa-paper-plane"></i> Contactar</button>
                     <button class="secondary-btn" onclick="toggleFavorite(${person.id}, event); closeModal()"><i class="fa-solid fa-heart"></i> Guardar</button>
                </div>
            </div>
        `;
        openModal(content);
    };

    // Make cards clickable to open detail
    // We delegate this event to the grid container
    talentGrid.addEventListener('click', (e) => {
        // If clicked on action buttons, do nothing (handled by their own onclicks)
        if (e.target.closest('.action-icon-btn')) return;

        const card = e.target.closest('.talent-card');
        if (card) {
            // Find the person ID from the valid data by matching name or index (not ideal but works for this mock)
            // Better: add data-id to card. Let's start relying on data-id.
            // Since we didn't add data-id in template, let's reverse lookup or Update Template.
            // FIX: Let's update cardTemplate to include onclick at card level or data-id.
        }
    });


    // --- Project & Admin Logic Mocks ---

    // New Project Button
    const newProjectBtn = document.querySelector('#view-projects .primary-btn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
            const content = `
                <div class="modal-form">
                    <h2><i class="fa-solid fa-plus"></i> Nuevo Proyecto de Casting</h2>
                    <div class="form-group">
                        <label>Nombre del Proyecto</label>
                        <input type="text" placeholder="Ej: Campaña Publicidad Verano 2026">
                    </div>
                    <div class="form-group">
                        <label>Cliente</label>
                        <input type="text" placeholder="Ej: Turismo de Canarias">
                    </div>
                    <div class="form-group">
                         <label>Tipo</label>
                         <select><option>Publicidad</option><option>Cine/TV</option><option>Moda</option></select>
                    </div>
                    <button class="primary-btn" onclick="alert('Proyecto Creado con Éxito!'); closeModal()">Crear Proyecto</button>
                </div>
             `;
            openModal(content);
        });
    }

    // Admin Add User
    const addUserBtn = document.querySelector('#view-admin .primary-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            const content = `
                <div class="modal-form">
                    <h2><i class="fa-solid fa-user-plus"></i> Añadir Nuevo Usuario</h2>
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" id="new-user-name" placeholder="Ej: Laura M.">
                    </div>
                    <div class="form-group">
                        <label>Email Corporativo</label>
                        <input type="email" id="new-user-email" placeholder="laura@agency.com">
                    </div>
                    <div class="form-group">
                         <label>Rol</label>
                         <select id="new-user-role">
                            <option>Recruiter</option>
                            <option>Guest</option>
                            <option>Admin</option>
                         </select>
                    </div>
                    <button class="primary-btn" id="confirm-add-user">Guardar Usuario</button>
                </div>
             `;
            openModal(content);

            // Handle "Save" within the modal
            document.getElementById('confirm-add-user').addEventListener('click', () => {
                const name = document.getElementById('new-user-name').value;
                const email = document.getElementById('new-user-email').value;
                const role = document.getElementById('new-user-role').value;

                if (!name || !email) return alert('Por favor completa todos los campos');

                const tbody = document.querySelector('.admin-table tbody');
                const newRow = document.createElement('tr');
                newRow.className = 'new-row-highlight';

                // Colors for fake avatars
                const colors = ['#5c62ec', '#00d2ff', '#ff9f43', '#10b981', '#fe2c55'];
                const randColor = colors[Math.floor(Math.random() * colors.length)];

                newRow.innerHTML = `
                    <td>
                        <div class="user-cell">
                            <div class="user-avatar-small" style="background: ${randColor};">${name.charAt(0).toUpperCase()}</div>
                            <span>${name}</span>
                        </div>
                    </td>
                    <td>${email}</td>
                    <td><span class="role-badge" style="${role === 'Guest' ? 'color: #ff9f43; background: rgba(255, 159, 67, 0.1);' : ''}">${role}</span></td>
                    <td>
                        <span class="status-badge status-active">
                            <span class="status-dot"></span> Active
                        </span>
                    </td>
                    <td style="text-align: right;">
                        <button class="action-btn"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="action-btn delete"><i class="fa-regular fa-trash-can"></i></button>
                    </td>
                 `;

                tbody.insertBefore(newRow, tbody.firstChild);
                closeModal();
            });
        });
    }

    // --- Admin Actions (Delete & Edit) ---
    const adminTable = document.querySelector('.admin-table');
    if (adminTable) {
        adminTable.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (e.target.closest('.delete')) {
                if (confirm('¿Estás seguro de eliminar este usuario?')) {
                    row.style.opacity = '0';
                    setTimeout(() => row.remove(), 300);
                }
            } else if (e.target.closest('.action-btn')) {
                // Edit User Modal
                const name = row.querySelector('.user-cell span').textContent;
                const email = row.cells[1].textContent;
                const role = row.querySelector('.role-badge').textContent;

                const content = `
                <div class="modal-form">
                    <h2><i class="fa-regular fa-pen-to-square"></i> Editar Usuario</h2>
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" value="${name}">
                    </div>
                    <div class="form-group">
                        <label>Email Corporativo</label>
                        <input type="email" value="${email}">
                    </div>
                    <div class="form-group">
                         <label>Rol</label>
                         <select id="edit-role">
                            <option ${role === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option ${role === 'Recruiter' ? 'selected' : ''}>Recruiter</option>
                            <option ${role === 'Guest' ? 'selected' : ''}>Guest</option>
                         </select>
                    </div>
                    <button class="primary-btn" onclick="alert('Usuario actualizado correctamente'); closeModal()">Guardar Cambios</button>
                </div>`;
                openModal(content);
            }
        });
    }

    // --- Chat List Switching ---
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update Active State
            chatItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Header Info
            const name = item.querySelector('h5').textContent;
            const img = item.querySelector('img').src;
            const chatHeaderTitle = document.querySelector('.chat-header-inner h4');
            const chatHeaderStatus = document.querySelector('.chat-header-inner span');

            if (chatHeaderTitle) chatHeaderTitle.textContent = name;

            // Randomly set status
            if (chatHeaderStatus) chatHeaderStatus.textContent = Math.random() > 0.5 ? 'En línea' : 'Ausente';

            // Clear and Fake Load Messages
            chatMessages.innerHTML = `
                <div class="msg received" style="opacity: 0.5">
                    <p><em>Cargando historial de conversación con ${name}...</em></p>
                </div>
            `;

            setTimeout(() => {
                chatMessages.innerHTML = `
                    <div class="msg received">
                        <p>Hola! Soy ${name}, ¿en qué puedo ayudarte?</p>
                    </div>
                    <div class="msg sent">
                        <p>Hola ${name}, revisé tu perfil para el casting.</p>
                    </div>
                `;
            }, 600);

            // Switch to mobile view of chat if needed (not implemented here but good practice)
        });
    });

    // --- Project Card Details ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const client = card.querySelector('p').textContent;

            const content = `
            <div class="modal-profile-header" style="border-bottom:0; padding-bottom: 0;">
                <div class="profile-main-info">
                    <h2>${title}</h2>
                    <p>${client}</p>
                </div>
            </div>
            
            <div class="modal-profile-body">
                <h3>Candidatos Pre-seleccionados</h3>
                <div class="talent-grid list-view" style="margin-top: 15px; grid-template-columns: 1fr;">
                     <!-- Mini Mock Cards -->
                     <div class="talent-card" style="height: 80px; display: flex; align-items: center; padding: 10px;">
                        <img src="${talentData[0].image}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 15px;">
                        <div><h4>${talentData[0].name}</h4><span style="font-size: 11px; color: #94a3b8;">${talentData[0].role}</span></div>
                        <div style="margin-left: auto; color: #10b981; font-weight: bold;">98% Match</div>
                     </div>
                     <div class="talent-card" style="height: 80px; display: flex; align-items: center; padding: 10px;">
                        <img src="${talentData[3].image}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 15px;">
                        <div><h4>${talentData[3].name}</h4><span style="font-size: 11px; color: #94a3b8;">${talentData[3].role}</span></div>
                        <div style="margin-left: auto; color: #10b981; font-weight: bold;">92% Match</div>
                     </div>
                </div>
                <div class="profile-actions">
                     <button class="primary-btn" onclick="alert('Casting finalizado y notificaciones enviadas.'); closeModal()">Cerrar Casting</button>
                </div>
            </div>
            `;
            openModal(content);
        });
    });

    // --- User Profile (Logout) ---
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            if (confirm('¿Deseas cerrar sesión de CanaryCast AI?')) {
                document.body.innerHTML = `
                 <div style="height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column; background: #0f111a; color: white;">
                    <i class="fa-solid fa-film fa-spin" style="font-size: 40px; color: #5c62ec; margin-bottom: 20px;"></i>
                    <h2>Cerrando Sesión безпеura...</h2>
                 </div>`;
                setTimeout(() => {
                    location.reload(); // Simple reload to "login"
                }, 1500);
            }
        });
    }

    // --- Settings Feedback ---
    // We already have the listener for 'change', let's enhance it
    // Note: The previous listener handles Dark Mode specifically.
    // We can't easily replace just that part inside the loop without replacing the whole loop.
    // However, since we are appending listener to elements, we run the risk of double listeners if we aren't careful.
    // But previously I replaced the block.
    // Let's assume the previous listener only handled Dark Mode.
    // I will NOT re-add a listener to all inputs. I will trust the previous logic handles Dark Mode.
    // I'll add a specific check for other named settings effectively by targeting them if I can,
    // OR I can rely on the fact that these are just simulated switches.

    // Let's refine the Settings logic by replacing the previous block completely with a more robust one.
    // Searching for the previous "Settings Switches" block to replace it.

    const settingsInputs = document.querySelectorAll('.setting-card input[type="checkbox"]');
    settingsInputs.forEach(input => {
        // Remove old listeners (not possible easily without reference), but we can overwrite via replacement tool if we target right.
        // Actually, let's just leave the previous dark mode logic and add feedback for others.
        input.addEventListener('change', (e) => {
            const settingName = e.target.closest('.setting-card').querySelector('h3').textContent;
            if (!settingName.includes('Modo Oscuro')) {
                // Toast notification simulation
                const status = e.target.checked ? 'Activado' : 'Desactivado';
                alert(`${settingName}: ${status}`);
            }
        });
    });

});

// --- Chat Logic ---
const chatInput = document.querySelector('.chat-input-area input');
const chatSendBtn = document.querySelector('.chat-input-area button');
const chatMessages = document.querySelector('.chat-messages');

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg sent';
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(msgDiv);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate Reply
    setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'msg received';
        replyDiv.innerHTML = `<p>Gracias por tu mensaje. Lo revisaré pronto.</p>`;
        chatMessages.appendChild(replyDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// --- Miscellaneous UI Actions ---

// Notification Bell
const notifBtn = document.querySelector('.notification-area .icon-btn');
const notifDropdown = document.querySelector('.notification-dropdown');

if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('active');

        // Hide badge
        const badge = notifBtn.querySelector('.badge');
        if (badge) badge.style.display = 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
            notifDropdown.classList.remove('active');
        }
    });
}

// View Options (Grid vs List)
const viewOptionsBtns = document.querySelectorAll('.view-options button');
if (viewOptionsBtns.length > 0) {
    viewOptionsBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Update active state
            viewOptionsBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle Grid/List Class
            if (index === 1) { // List view button
                talentGrid.classList.add('list-view');
            } else { // Grid view button
                talentGrid.classList.remove('list-view');
            }
        });
    });
}

// Settings Switches
const settingsSwitches = document.querySelectorAll('.setting-card input[type="checkbox"]');
settingsSwitches.forEach(input => {
    input.addEventListener('change', (e) => {
        const settingName = e.target.closest('.setting-card').querySelector('h3').textContent;
        // Simple Dark Mode Toggle Logic
        if (settingName.includes('Modo Oscuro')) {
            if (!e.target.checked) document.body.classList.add('light-mode');
            else document.body.classList.remove('light-mode');

            // Update chart colors if needed (simplified)
            const rows = document.querySelectorAll('.chart-row .chart-label, .chart-row .chart-val');
            rows.forEach(r => r.style.color = !e.target.checked ? '#333' : '');
        }
    });
});


// --- Robust Logout System ---
// --- Robust Logout System ---
function performLogout() {
    // Immediate Logout (No confirmation)

    // Clear all session data
    sessionStorage.clear();
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userName');

    // Show Loading State
    document.body.style.opacity = '0.5';
    document.body.style.pointerEvents = 'none';

    // Redirect
    window.location.href = 'login.html';
}

// Attach listeners safely when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Link
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            performLogout();
        });
    }

    // 2. User Profile Area (Bottom Sidebar)
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            performLogout();
        });
        userProfile.title = "Cerrar Sesión";
        userProfile.style.cursor = "pointer";
    }
});
