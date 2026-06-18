document.addEventListener('DOMContentLoaded', () => {
    const itemSearch = document.getElementById('itemSearch');
    const itemsDropdown = document.getElementById('itemsDropdown');
    const mainQtyDisplay = document.getElementById('mainQty');
    const addBtn = document.getElementById('addBtn');
    const clearBtn = document.getElementById('clearBtn');
    const mainMinus = document.getElementById('mainMinus');
    const mainPlus = document.getElementById('mainPlus');
    const queueList = document.getElementById('queueList');
    const clearStockBtn = document.getElementById('clearStockBtn');
    const resourceTotals = document.getElementById('resourceTotals');
    const stockTotals = document.getElementById('stockTotals');
    const parentCraftTotals = document.getElementById('parentCraftTotals');
    const intermediateCraftTotals = document.getElementById('intermediateCraftTotals');
    const stockArea = document.getElementById('stockArea');
    const parentCraftsArea = document.getElementById('parentCraftsArea');
    const intermediateCraftsArea = document.getElementById('intermediateCraftsArea');
    const resultArea = document.getElementById('resultArea');
    const sideColumn = document.querySelector('.side-column');

    const STORAGE_KEY = 'spacecraft_calculator_state';

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

    function saveData() {
        const data = { buildQueue, initialStock };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                buildQueue = data.buildQueue || {};
                initialStock = data.initialStock || {};
            } catch (e) {
                console.error("Erreur de chargement du stockage local", e);
            }
        }
    }

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
        const remainingIntermediates = {}; // Format: { id: { total: 0, requiredBy: { parentId: qty } } }
        const allIntermediates = new Set();
        const virtualStock = { ...initialStock };

        function resolve(id, multiplier, isRoot = false, parentId = null) {
            const item = ITEMS[id];
            if (!item || multiplier < 0) return;

            // Toujours ajouter aux intermédiaires pour la liste de stock, même si qty=0
            if (!isRoot) allIntermediates.add(id);

            // Déduction du stock (valable pour root et composants)
            const currentStock = virtualStock[id] || 0;
            const fromStock = Math.min(multiplier, currentStock);
            const needed = multiplier - fromStock;
            virtualStock[id] = currentStock - fromStock;

            if (item.isResource) {
                if (needed > 0) baseResources[id] = (baseResources[id] || 0) + needed;
                return;
            }

            const qtyPerCraft = item.stackQty || 1;
            const craftsNeeded = Math.ceil(needed / qtyPerCraft);
            const producedQty = craftsNeeded * qtyPerCraft;

            if (producedQty > 0 && !isRoot) {
                if (!remainingIntermediates[id]) {
                    remainingIntermediates[id] = { total: 0, requiredBy: {} };
                }
                remainingIntermediates[id].total += producedQty;
                
                if (parentId) {
                    remainingIntermediates[id].requiredBy[parentId] = 
                        (remainingIntermediates[id].requiredBy[parentId] || 0) + producedQty;
                }
            }

            if (item.recipe) {
                for (const [ingredientId, amount] of Object.entries(item.recipe)) {
                    // On continue la résolution même si craftsNeeded est 0 pour explorer l'arbre (allIntermediates)
                    resolve(ingredientId, amount * craftsNeeded, false, id);
                }
            }
        }

        Object.entries(buildQueue).forEach(([id, qty]) => resolve(id, qty, true, null));
        return { baseResources, remainingIntermediates, allIntermediates: Array.from(allIntermediates) };
    }

    function render() {
        saveData();

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
            sideColumn.classList.remove('hidden');
            const { baseResources, remainingIntermediates, allIntermediates } = calculateTotals();
            
            // Affichage Stock de départ
            const hasAllIntermediates = allIntermediates.length > 0;
            stockArea.classList.toggle('hidden', !hasAllIntermediates);
            
            // Afficher le bouton reset seulement s'il y a quelque chose en stock
            const hasInitialStock = Object.keys(initialStock).length > 0;
            clearStockBtn.classList.toggle('hidden', !hasInitialStock);
            
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
            
            // Séparation des composants intermédiaires en deux listes
            const buildQueueIds = Object.keys(buildQueue);
            const parentCrafts = [];
            const intermediateCrafts = [];

            for (const id in remainingIntermediates) {
                const data = remainingIntermediates[id];
                let qtyForBuildings = 0;
                let qtyForIntermediates = 0;

                for (const [pId, pQty] of Object.entries(data.requiredBy)) {
                    if (buildQueueIds.includes(pId)) {
                        qtyForBuildings += pQty;
                    } else {
                        qtyForIntermediates += pQty;
                    }
                }

                if (qtyForBuildings > 0) parentCrafts.push({ id, qty: qtyForBuildings });
                if (qtyForIntermediates > 0) intermediateCrafts.push({ id, qty: qtyForIntermediates });
            }

            // Fonction pour rendre une liste de composants
            const renderComponentList = (list, container, showParentTags) => {
                container.innerHTML = '';
                list.sort((aObj, bObj) => {
                    const a = aObj.id, b = bObj.id;
                    const aPrim = ITEMS[a]?.isPrimitive ? 1 : 0;
                    const bPrim = ITEMS[b]?.isPrimitive ? 1 : 0;
                    if (aPrim !== bPrim) return bPrim - aPrim;
                    return (DICTIONARY[a] || '').localeCompare(DICTIONARY[b] || '');
                }).forEach(entry => {
                    const id = entry.id;
                    const item = ITEMS[id];
                    const data = remainingIntermediates[id];
                    const qty = entry.qty;

                    const roundedQty = (item?.stackProduced && item?.stackQty > 1)
                        ? Math.ceil(qty / item.stackQty) * item.stackQty
                        : Math.ceil(qty);

                    let parentTagsHtml = '';
                    if (showParentTags) {
                        const parentTags = Object.entries(data.requiredBy)
                            .filter(([pId]) => !buildQueueIds.includes(pId))
                            .map(([pId, pQty]) => `<span class="parent-tag">${DICTIONARY[pId] || pId}</span>`)
                            .join('');
                        parentTagsHtml = `<div class="parent-info">${parentTags}</div>`;
                    }

                    container.innerHTML += `
                        <div class="row">
                            <div class="item-column">
                                <span class="item-name">${item?.isPrimitive ? '📦 ' : '⚙️ '}${DICTIONARY[id] || id}</span>
                                ${parentTagsHtml}
                            </div>
                            <span><strong>${roundedQty}</strong></span>
                        </div>`;
                });
            };

            // Affichage Composants Parents
            parentCraftsArea.classList.toggle('hidden', parentCrafts.length === 0);
            if (parentCrafts.length > 0) {
                renderComponentList(parentCrafts, parentCraftTotals, false);
            }

            // Affichage Composants Intermédiaires
            intermediateCraftsArea.classList.toggle('hidden', intermediateCrafts.length === 0);
            if (intermediateCrafts.length > 0) {
                renderComponentList(intermediateCrafts, intermediateCraftTotals, true);
            }

            // Affichage Ressources de Base
            resultArea.classList.remove('hidden');
            resourceTotals.innerHTML = '';
            
            const sortedResources = Object.keys(baseResources).sort((a, b) => {
                return (DICTIONARY[a] || '').localeCompare(DICTIONARY[b] || '');
            });

            for (const id of sortedResources) {
                const qty = baseResources[id];
                const item = ITEMS[id];
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
            sideColumn.classList.add('hidden');
            resultArea.classList.add('hidden');
            parentCraftsArea.classList.add('hidden');
            intermediateCraftsArea.classList.add('hidden');
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

    clearStockBtn.addEventListener('click', () => {
        initialStock = {};
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
    loadData();
    render();
});
