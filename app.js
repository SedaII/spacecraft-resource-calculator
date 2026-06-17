document.addEventListener('DOMContentLoaded', () => {
    const itemSelect = document.getElementById('itemSelect');
    const itemQty = document.getElementById('itemQty');
    const addBtn = document.getElementById('addBtn');
    const clearBtn = document.getElementById('clearBtn');
    const mainMinus = document.getElementById('mainMinus');
    const mainPlus = document.getElementById('mainPlus');
    const queueList = document.getElementById('queueList');
    const resourceTotals = document.getElementById('resourceTotals');
    const componentTotals = document.getElementById('componentTotals');
    const componentsArea = document.getElementById('componentsArea');
    const resultArea = document.getElementById('resultArea');

    let buildQueue = {}; // Format: { id: quantity }

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

    // Remplir le select au démarrage
    function initSelect() {
        const craftables = Object.values(ITEMS)
            .filter(item => item.recipe)
            .sort((a, b) => (DICTIONARY[a.id] || '').localeCompare(DICTIONARY[b.id] || ''));

        craftables.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = DICTIONARY[item.id] || item.slug;
            itemSelect.appendChild(opt);
        });
    }

    // Calcul récursif pour remonter aux ressources de base
    function calculateTotals() {
        const baseResources = {};
        const intermediates = {};

        function resolve(id, multiplier, isRoot = false) {
            const item = ITEMS[id];

            if (item?.isResource) {
                baseResources[id] = (baseResources[id] || 0) + multiplier;
                return;
            }

            if (!isRoot) {
                intermediates[id] = (intermediates[id] || 0) + multiplier;
            }

            const recipe = item?.recipe;
            if (recipe) {
                for (const [ingredientId, amount] of Object.entries(recipe)) {
                    resolve(ingredientId, amount * multiplier);
                }
            }
        }

        Object.entries(buildQueue).forEach(([id, qty]) => resolve(id, qty, true));
        return { baseResources, intermediates };
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
                    <span class="qty-value"><strong>${qty}</strong></span>
                    <button class="qty-btn plus" data-id="${id}">+</button>
                    <button class="qty-btn delete-btn" data-id="${id}" title="Supprimer la ligne">×</button>
                </div>
            `;
            queueList.appendChild(row);
        });

        // Calculer et afficher les résultats
        if (entries.length > 0) {
            const { baseResources, intermediates } = calculateTotals();
            
            // Affichage Composants Intermédiaires
            const hasIntermediates = Object.keys(intermediates).length > 0;
            componentsArea.classList.toggle('hidden', !hasIntermediates);
            
            if (hasIntermediates) {
                componentTotals.innerHTML = '';
                
                // Tri : composants primitifs en premier
                const sortedIntermediates = Object.keys(intermediates).sort((a, b) => {
                    const aPrim = ITEMS[a]?.isPrimitive ? 1 : 0;
                    const bPrim = ITEMS[b]?.isPrimitive ? 1 : 0;
                    return bPrim - aPrim;
                });

                for (const id of sortedIntermediates) {
                    const qty = intermediates[id];
                    componentTotals.innerHTML += `
                        <div class="row">
                            <span>${ITEMS[id]?.isPrimitive ? '📦 ' : '⚙️ '}${DICTIONARY[id] || id}</span>
                            <span><strong>${qty}</strong></span>
                        </div>`;
                }
            }

            // Affichage Ressources de Base
            resultArea.classList.remove('hidden');
            resourceTotals.innerHTML = '';
            for (const [id, qty] of Object.entries(baseResources)) {
                resourceTotals.innerHTML += `
                    <div class="row">
                        <span>${DICTIONARY[id] || id}</span>
                        <span><strong>${Math.ceil(qty)}</strong></span>
                    </div>`;
            }
        } else {
            resultArea.classList.add('hidden');
            componentsArea.classList.add('hidden');
        }
    }

    // Événements
    addBtn.addEventListener('click', () => {
        updateQueue(itemSelect.value, parseInt(itemQty.value) || 1);
    });

    const updateMainQty = (amount) => {
        let val = parseInt(itemQty.value) || 1;
        val = Math.max(1, val + amount);
        itemQty.value = val;
    };

    mainPlus.addEventListener('click', (e) => updateMainQty(getMultiplier(e)));
    mainMinus.addEventListener('click', (e) => updateMainQty(-getMultiplier(e)));

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
            const amount = getMultiplier(e);
            updateQueue(id, button.classList.contains('plus') ? amount : -amount);
        }
    });

    // Clic droit pour +/- 10
    queueList.addEventListener('contextmenu', (e) => {
        const btn = e.target.closest('.qty-btn:not(.delete-btn)');
        if (btn) {
            e.preventDefault();
            const id = btn.dataset.id;
            updateQueue(id, btn.classList.contains('plus') ? 10 : -10);
        }
    });

    initSelect();
});
