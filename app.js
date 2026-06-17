document.addEventListener('DOMContentLoaded', () => {
    const itemSearch = document.getElementById('itemSearch');
    const itemsDropdown = document.getElementById('itemsDropdown');
    const mainQtyDisplay = document.getElementById('mainQty');
    const addBtn = document.getElementById('addBtn');
    const clearBtn = document.getElementById('clearBtn');
    const mainMinus = document.getElementById('mainMinus');
    const mainPlus = document.getElementById('mainPlus');
    const queueList = document.getElementById('queueList');
    const resourceTotals = document.getElementById('resourceTotals');
    const stockTotals = document.getElementById('stockTotals');
    const componentTotals = document.getElementById('componentTotals');
    const stockArea = document.getElementById('stockArea');
    const componentsArea = document.getElementById('componentsArea');
    const resultArea = document.getElementById('resultArea');

    let buildQueue = {}; // Format: { id: quantity }
    let initialStock = {}; // Format: { id: quantity }
    let currentMainQty = 0; // Initialisé à 0 par défaut
    let highlightedIndex = -1;

    // Initialisation de l'input de quantité principal
    mainQtyDisplay.disabled = true;
    mainMinus.disabled = true;
    mainPlus.disabled = true;

    // Gestion des sections pliantes
    document.querySelectorAll('.collapsible').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('collapsed');
        });
    });

    function getMultiplier(e) {
        if (e.ctrlKey || e.metaKey) return 100;
        return 1;
    }

    function updateQueue(id, amount) {
        buildQueue[id] = (buildQueue[id] || 0) + amount;
        if (buildQueue[id] <= 0) delete buildQueue[id];
        render();
    }

    function updateStock(id, amount) {
        initialStock[id] = Math.max(0, (initialStock[id] || 0) + amount);
        if (initialStock[id] === 0) delete initialStock[id];
        render();
    }

    // Récupérer l'ID à partir du nom affiché
    function getSelectedId() {
        const val = itemSearch.value;
        return Object.keys(DICTIONARY).find(id => DICTIONARY[id] === val);
    }

    function updateHighlight() {
        const items = itemsDropdown.querySelectorAll('.dropdown-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === highlightedIndex);
            if (index === highlightedIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // Gérer l'affichage de la liste personnalisée
    function renderDropdown(filter = '') {
        itemsDropdown.innerHTML = '';
        const filterLower = filter.toLowerCase();
        
        highlightedIndex = -1;

        const craftables = Object.values(ITEMS)
            .filter(item => item.recipe)
            .filter(item => (DICTIONARY[item.id] || '').toLowerCase().includes(filterLower))
            .sort((a, b) => (DICTIONARY[a.id] || '').localeCompare(DICTIONARY[b.id] || ''));

        craftables.forEach(item => {
            const name = DICTIONARY[item.id] || item.slug;
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.textContent = name;
            div.addEventListener('click', () => {
                itemSearch.value = name;
                syncSelection();
                itemsDropdown.classList.add('hidden');
                highlightedIndex = -1;
            });
            itemsDropdown.appendChild(div);
        });

        itemsDropdown.classList.toggle('hidden', craftables.length === 0);
    }

    const syncSelection = () => {
        const id = getSelectedId();
        if (!id) {
            mainQtyDisplay.value = 0;
            mainQtyDisplay.disabled = true;
            mainMinus.disabled = true;
            mainPlus.disabled = true;
            addBtn.disabled = true;
            currentMainQty = 0;
            return;
        }
        mainQtyDisplay.disabled = false;
        mainMinus.disabled = false;
        mainPlus.disabled = false;
        addBtn.disabled = false;
        currentMainQty = ITEMS[id]?.stackQty || 1;
        mainQtyDisplay.value = currentMainQty;
    };

    function initSelect() { // Cette fonction est appelée une fois au démarrage
        // Ouvrir au clic
        itemSearch.addEventListener('click', () => {
            renderDropdown(itemSearch.value);
        });

        // Filtrer à la saisie
        itemSearch.addEventListener('input', (e) => {
            renderDropdown(e.target.value);
            syncSelection();
        });

        // Navigation clavier
        itemSearch.addEventListener('keydown', (e) => {
            const items = itemsDropdown.querySelectorAll('.dropdown-item');
            const isHidden = itemsDropdown.classList.contains('hidden');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
                updateHighlight();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                highlightedIndex = Math.max(highlightedIndex - 1, 0);
                updateHighlight();
            } else if (e.key === 'Enter') {
                if (!isHidden && highlightedIndex >= 0) {
                    e.preventDefault();
                    items[highlightedIndex].click();
                } else if (isHidden && itemSearch.value) {
                    addBtn.click();
                }
            } else if (e.key === 'Escape') {
                itemsDropdown.classList.add('hidden');
            }
        });

        // Fermer la liste si on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.recipe-search-box')) {
                itemsDropdown.classList.add('hidden');
            }
        });
    }

    // Calcul récursif pour remonter aux ressources de base
    function calculateTotals() {
        const baseResources = {};
        const remainingIntermediates = {};
        const allIntermediates = new Set();
        const virtualStock = { ...initialStock };

        function resolve(id, multiplier, isRoot = false) {
            const item = ITEMS[id];
            if (!item) return;

            if (item.isResource) {
                baseResources[id] = (baseResources[id] || 0) + multiplier;
                return;
            }

            if (!isRoot) {
                allIntermediates.add(id);
            }

            let needed = multiplier;
            if (!isRoot) {
                const fromStock = Math.min(needed, virtualStock[id] || 0);
                needed -= fromStock;
                virtualStock[id] = (virtualStock[id] || 0) - fromStock;
            }

            if (needed <= 0) return;

            const qtyPerCraft = item.stackQty || 1;
            const craftsNeeded = Math.ceil(needed / qtyPerCraft);
            const producedQty = craftsNeeded * qtyPerCraft;

            if (!isRoot) {
                remainingIntermediates[id] = (remainingIntermediates[id] || 0) + producedQty;
            }

            if (item.recipe) {
                for (const [ingredientId, amount] of Object.entries(item.recipe)) {
                    resolve(ingredientId, amount * craftsNeeded);
                }
            }
        }

        Object.entries(buildQueue).forEach(([id, qty]) => resolve(id, qty, true));
        return { baseResources, remainingIntermediates, allIntermediates: Array.from(allIntermediates) };
    }

    function render() {
        // Vider la liste actuelle
        queueList.innerHTML = '';
        
        const entries = Object.entries(buildQueue);
        clearBtn.classList.toggle('hidden', entries.length === 0);

        entries.forEach(([id, qty]) => {
            const row = document.createElement('div');
            row.className = 'row';
            row.innerHTML = `
                <span>${DICTIONARY[id] || id}</span>
                <div class="item-controls">
                    <button class="qty-btn minus" data-id="${id}">-</button>
                    <input type="number" class="qty-input" data-id="${id}" value="${qty}" min="0">
                    <button class="qty-btn plus" data-id="${id}">+</button>
                    <button class="qty-btn delete-btn" data-id="${id}" title="Supprimer la ligne">×</button>
                </div>
            `;
            queueList.appendChild(row);
        });

        // Calculer et afficher les résultats
        if (entries.length > 0) {
            const { baseResources, remainingIntermediates, allIntermediates } = calculateTotals();
            
            // Affichage Stock de départ
            const hasAllIntermediates = allIntermediates.length > 0;
            stockArea.classList.toggle('hidden', !hasAllIntermediates);
            
            if (hasAllIntermediates) {
                stockTotals.innerHTML = '';
                const sortedForStock = allIntermediates.sort((a, b) => {
                    const aPrim = ITEMS[a]?.isPrimitive ? 1 : 0;
                    const bPrim = ITEMS[b]?.isPrimitive ? 1 : 0;
                    return bPrim - aPrim;
                });

                for (const id of sortedForStock) {
                    const qty = initialStock[id] || 0;
                    stockTotals.innerHTML += `
                        <div class="row">
                            <span>${DICTIONARY[id] || id}</span>
                            <div class="item-controls">
                                <button class="qty-btn minus" data-id="${id}">-</button>
                                <input type="number" class="qty-input" data-id="${id}" value="${qty}" min="0">
                                <button class="qty-btn plus" data-id="${id}">+</button>
                            </div>
                        </div>`;
                }
            }
            
            // Affichage Composants Intermédiaires
            const hasIntermediates = Object.keys(remainingIntermediates).length > 0;
            componentsArea.classList.toggle('hidden', !hasIntermediates);
            
            if (hasIntermediates) {
                componentTotals.innerHTML = '';
                const sortedIntermediates = Object.keys(remainingIntermediates).sort((a, b) => {
                    const aPrim = ITEMS[a]?.isPrimitive ? 1 : 0;
                    const bPrim = ITEMS[b]?.isPrimitive ? 1 : 0;
                    return bPrim - aPrim;
                });

                for (const id of sortedIntermediates) {
                    const item = ITEMS[id];
                    const qty = remainingIntermediates[id];
                    // Arrondir au multiple du lot si l'item est produit en stack
                    const roundedQty = (item?.stackProduced && item?.stackQty > 1)
                        ? Math.ceil(qty / item.stackQty) * item.stackQty
                        : Math.ceil(qty);

                    componentTotals.innerHTML += `
                        <div class="row">
                            <span>${item?.isPrimitive ? '📦 ' : '⚙️ '}${DICTIONARY[id] || id}</span>
                            <span><strong>${roundedQty}</strong></span>
                        </div>`;
                }
            }

            // Affichage Ressources de Base
            resultArea.classList.remove('hidden');
            resourceTotals.innerHTML = '';
            for (const [id, qty] of Object.entries(baseResources)) {
                const item = ITEMS[id];
                // Même logique pour les ressources (ex: lingots d'acier produits par 3)
                const roundedQty = (item?.stackProduced && item?.stackQty > 1)
                    ? Math.ceil(qty / item.stackQty) * item.stackQty
                    : Math.ceil(qty);

                resourceTotals.innerHTML += `
                    <div class="row">
                        <span>${DICTIONARY[id] || id}</span>
                        <span><strong>${roundedQty}</strong></span>
                    </div>`;
            }
        } else {
            resultArea.classList.add('hidden');
            componentsArea.classList.add('hidden');
            stockArea.classList.add('hidden');
        }
    }

    // Événements
    addBtn.addEventListener('click', () => {
        const id = getSelectedId();
        if (id) {
            updateQueue(id, currentMainQty);
            itemSearch.value = ""; // Reset après ajout pour l'UX
            syncSelection(); // Déclenche la réinitialisation visuelle et de valeur
        }
    });

    const updateMainQty = (multiplier) => {
        const id = getSelectedId();
        if (!id) return;
        
        const stackQty = ITEMS[id]?.stackQty || 1;
        let newQty = currentMainQty + (multiplier * stackQty);
        currentMainQty = Math.max(stackQty, newQty); // Ne pas descendre en dessous de la quantité de stack
        mainQtyDisplay.value = currentMainQty;
    };

    // Écouteur pour la saisie manuelle dans l'input de quantité principal
    mainQtyDisplay.addEventListener('change', (e) => {
        const id = getSelectedId();
        if (!id) return;
        let val = parseInt(e.target.value, 10) || ITEMS[id]?.stackQty || 1;
        currentMainQty = Math.max(ITEMS[id]?.stackQty || 1, val);
        mainQtyDisplay.value = currentMainQty;
    });
    mainPlus.addEventListener('click', (e) => updateMainQty(getMultiplier(e)));
    mainMinus.addEventListener('click', (e) => updateMainQty(-1 * getMultiplier(e)));

    mainPlus.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        updateMainQty(10);
    });

    mainMinus.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        updateMainQty(-10);
    });

    clearBtn.addEventListener('click', () => {
        buildQueue = {};
        render();
    });

    queueList.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const id = button.dataset.id;
        
        if (button.classList.contains('delete-btn')) {
            delete buildQueue[id];
            render();
        } else if (button.classList.contains('qty-btn')) {
            const multiplier = getMultiplier(e);
            const stackQty = ITEMS[id]?.stackQty || 1;
            const delta = (button.classList.contains('plus') ? multiplier : -multiplier) * stackQty;
            updateQueue(id, delta);
        }
    });

    queueList.addEventListener('change', (e) => {
        if (e.target.classList.contains('qty-input')) {
            const id = e.target.dataset.id;
            const val = parseInt(e.target.value, 10) || 0;
            if (val <= 0) delete buildQueue[id];
            else buildQueue[id] = val;
            render();
        }
    });

    stockTotals.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const id = button.dataset.id;
        const multiplier = getMultiplier(e);
        const delta = (button.classList.contains('plus') ? multiplier : -multiplier);
        updateStock(id, delta);
    });

    stockTotals.addEventListener('change', (e) => {
        if (e.target.classList.contains('qty-input')) {
            const id = e.target.dataset.id;
            const val = parseInt(e.target.value, 10) || 0;
            if (val <= 0) delete initialStock[id];
            else initialStock[id] = val;
            render();
        }
    });

    // Clic droit pour +/- 10
    queueList.addEventListener('contextmenu', (e) => {
        const btn = e.target.closest('.qty-btn:not(.delete-btn)');
        if (btn) {
            e.preventDefault();
            const id = btn.dataset.id;
            const stackQty = ITEMS[id]?.stackQty || 1;
            updateQueue(id, (btn.classList.contains('plus') ? 10 : -10) * stackQty);
        }
    });

    stockTotals.addEventListener('contextmenu', (e) => {
        const btn = e.target.closest('.qty-btn');
        if (btn) {
            e.preventDefault();
            const id = btn.dataset.id;
            updateStock(id, (btn.classList.contains('plus') ? 10 : -10));
        }
    });

    // Appeler initSelect une fois que tous les écouteurs sont configurés
    initSelect();
});
