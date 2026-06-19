document.addEventListener('DOMContentLoaded', () => {
    const baseListContainer = document.getElementById('baseList');
    const createBaseBtn = document.getElementById('createBaseBtn');
    const noBaseSelected = document.getElementById('noBaseSelected');
    const activeBaseArea = document.getElementById('activeBaseArea');
    const baseNameInput = document.getElementById('baseNameInput');
    const deleteBaseBtn = document.getElementById('deleteBaseBtn');

    const nodeSearch = document.getElementById('nodeSearch');
    const nodesDropdown = document.getElementById('nodesDropdown');
    const addNodeBtn = document.getElementById('addNodeBtn');
    const plannedNodesList = document.getElementById('plannedNodesList');
    let selectedNodeId = null; // ID numérique du nœud sélectionné via la combobox
    let nodeHighlightedIndex = -1;

    const buildingSearch = document.getElementById('buildingSearch');
    const buildingsDropdown = document.getElementById('buildingsDropdown');
    const addBuildingBtn = document.getElementById('addBuildingBtn');
    const plannedBuildingsList = document.getElementById('plannedBuildingsList');
    let selectedBuildingId = null;
    let buildingHighlightedIndex = -1;

    const footprintValue = document.getElementById('footprintValue');
    const footprintProgressBar = document.getElementById('footprintProgressBar');
    const footprintAlert = document.getElementById('footprintAlert');
    const energyBadge = document.getElementById('energyBadge');
    const storageGeneralVal = document.getElementById('storageGeneralVal');
    const storageLiquidVal = document.getElementById('storageLiquidVal');
    const netYieldsList = document.getElementById('netYieldsList');

    const STORAGE_KEY = 'spacecraft_base_planner_state';

    let bases = []; // Structure: { id, name, nodes: [{ id, extractorAssigned }], buildings: [{ id, qty, recipeIndex, recipeItemId, cycleRate }] }
    let activeBaseId = null;

    // --- Gestion du stockage local ---
    function loadBases() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                bases = JSON.parse(saved) || [];
            } catch (e) {
                console.error("Erreur lors du chargement des bases", e);
                bases = [];
            }
        }
    }

    function saveBases() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bases));
    }

    // --- Helpers de traduction et données ---
    function getResourceLabel(idOrString) {
        if (DICTIONARY[idOrString]) {
            return DICTIONARY[idOrString];
        }
        return idOrString; // Pour "Eau" ou "Acide"
    }

    function getResourceIdOrString(resourceName) {
        let name = resourceName;
        if (name === "Carbone-a") name = "Carbon-a";
        const id = Object.keys(DICTIONARY).find(key => DICTIONARY[key] === name);
        return id ? Number(id) : resourceName;
    }

    function getBuildingEnergyContribution(bId, bInfo) {
        const rawEnergy = bInfo.energy || 0;
        const isGenerator = [39, 41, 56, 71].includes(bId);
        if (isGenerator) {
            return Math.abs(rawEnergy);
        } else {
            return -Math.abs(rawEnergy);
        }
    }

    // --- Initialisation des listes déroulantes ---

    // Combobox gisements
    function renderNodesDropdown(filter = '') {
        nodesDropdown.innerHTML = '';
        nodeHighlightedIndex = -1;
        const filterLower = filter.toLowerCase();

        const filtered = Object.keys(NODES)
            .map(id => {
                const node = NODES[id];
                const name = DICTIONARY[id] || node.slug;
                const res = node.performance.resource;
                const rate = node.performance.rate;
                return { id: Number(id), label: `${name} (${res} : ${rate}/h)` };
            })
            .filter(item => item.label.toLowerCase().includes(filterLower))
            .sort((a, b) => a.label.localeCompare(b.label));

        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.textContent = item.label;
            div.addEventListener('click', () => {
                nodeSearch.value = item.label;
                selectedNodeId = item.id;
                nodesDropdown.classList.add('hidden');
                nodeHighlightedIndex = -1;
            });
            nodesDropdown.appendChild(div);
        });

        nodesDropdown.classList.toggle('hidden', filtered.length === 0);
    }

    function updateNodeHighlight() {
        const items = nodesDropdown.querySelectorAll('.dropdown-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === nodeHighlightedIndex);
            if (index === nodeHighlightedIndex) item.scrollIntoView({ block: 'nearest' });
        });
    }

    function initNodeCombobox() {
        nodeSearch.addEventListener('click', () => renderNodesDropdown(nodeSearch.value));

        nodeSearch.addEventListener('input', (e) => {
            selectedNodeId = null; // Réinitialise la sélection si l'utilisateur tape
            renderNodesDropdown(e.target.value);
        });

        nodeSearch.addEventListener('keydown', (e) => {
            const items = nodesDropdown.querySelectorAll('.dropdown-item');
            const isHidden = nodesDropdown.classList.contains('hidden');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                nodeHighlightedIndex = Math.min(nodeHighlightedIndex + 1, items.length - 1);
                updateNodeHighlight();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                nodeHighlightedIndex = Math.max(nodeHighlightedIndex - 1, 0);
                updateNodeHighlight();
            } else if (e.key === 'Enter') {
                if (!isHidden && nodeHighlightedIndex >= 0) {
                    e.preventDefault();
                    items[nodeHighlightedIndex].click();
                } else if (selectedNodeId) {
                    addNodeBtn.click();
                }
            } else if (e.key === 'Escape') {
                nodesDropdown.classList.add('hidden');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#nodeSelectorBox')) {
                nodesDropdown.classList.add('hidden');
            }
        });
    }

    // --- Combobox Bâtiments ---
    function renderBuildingsDropdown(filter = '') {
        buildingsDropdown.innerHTML = '';
        buildingHighlightedIndex = -1;
        const filterLower = filter.toLowerCase();
        const activeBase = bases.find(b => b.id === activeBaseId);

        const filtered = Object.keys(BUILDINGS)
            .map(id => {
                const bId = Number(id);
                if (bId === 40 || bId === 58) return null;
                const bInfo = BUILDINGS[bId];
                if (bInfo.isUnique && activeBase) {
                    if (activeBase.buildings.some(b => b.id === bId)) return null;
                }
                const name = DICTIONARY[bId] || bInfo.slug;
                return { id: bId, label: name };
            })
            .filter(item => item && item.label.toLowerCase().includes(filterLower))
            .sort((a, b) => a.label.localeCompare(b.label));

        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.textContent = item.label;
            div.addEventListener('click', () => {
                buildingSearch.value = item.label;
                selectedBuildingId = item.id;
                buildingsDropdown.classList.add('hidden');
                buildingHighlightedIndex = -1;
            });
            buildingsDropdown.appendChild(div);
        });

        buildingsDropdown.classList.toggle('hidden', filtered.length === 0);
    }

    function updateBuildingHighlight() {
        const items = buildingsDropdown.querySelectorAll('.dropdown-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === buildingHighlightedIndex);
            if (index === buildingHighlightedIndex) item.scrollIntoView({ block: 'nearest' });
        });
    }

    function initBuildingCombobox() {
        buildingSearch.addEventListener('click', () => renderBuildingsDropdown(buildingSearch.value));
        buildingSearch.addEventListener('input', (e) => {
            selectedBuildingId = null;
            renderBuildingsDropdown(e.target.value);
        });
        buildingSearch.addEventListener('keydown', (e) => {
            const items = buildingsDropdown.querySelectorAll('.dropdown-item');
            const isHidden = buildingsDropdown.classList.contains('hidden');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                buildingHighlightedIndex = Math.min(buildingHighlightedIndex + 1, items.length - 1);
                updateBuildingHighlight();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                buildingHighlightedIndex = Math.max(buildingHighlightedIndex - 1, 0);
                updateBuildingHighlight();
            } else if (e.key === 'Enter') {
                if (!isHidden && buildingHighlightedIndex >= 0) {
                    e.preventDefault();
                    items[buildingHighlightedIndex].click();
                } else if (selectedBuildingId) {
                    addBuildingBtn.click();
                }
            } else if (e.key === 'Escape') {
                buildingsDropdown.classList.add('hidden');
            }
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#buildingSelectorBox')) {
                buildingsDropdown.classList.add('hidden');
            }
        });
    }

    // Réinitialise la combobox bâtiment (appelée lors du changement de base)
    function updateBuildingSelector() {
        buildingSearch.value = '';
        selectedBuildingId = null;
        buildingsDropdown.classList.add('hidden');
    }

    function initDropdowns() {
        initNodeCombobox();
        initBuildingCombobox();
        // Fermer les combobox de cartes au clic en dehors
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.card-combobox')) {
                document.querySelectorAll('.card-combobox .dropdown-list').forEach(d => d.classList.add('hidden'));
            }
        });
    }

    // --- Rendu de l'interface ---
    function renderBaseList() {
        baseListContainer.innerHTML = '';
        if (bases.length === 0) {
            baseListContainer.innerHTML = '<p class="section-explanation"><small>Aucune base planifiée.</small></p>';
            return;
        }

        bases.forEach(base => {
            const div = document.createElement('div');
            div.className = `base-item ${base.id === activeBaseId ? 'active' : ''}`;
            div.dataset.id = base.id;
            div.innerHTML = `<span>${base.name}</span>`;
            div.addEventListener('click', () => {
                selectBase(base.id);
            });
            baseListContainer.appendChild(div);
        });
    }

    function selectBase(id) {
        activeBaseId = id;
        renderBaseList();

        const activeBase = bases.find(b => b.id === activeBaseId);
        if (activeBase) {
            noBaseSelected.classList.add('hidden');
            activeBaseArea.classList.remove('hidden');
            baseNameInput.value = activeBase.name;

            updateBuildingSelector();
            renderActiveBaseDetails();
        } else {
            noBaseSelected.classList.remove('hidden');
            activeBaseArea.classList.add('hidden');
        }
    }

    function renderActiveBaseDetails() {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        // Rendu des gisements
        plannedNodesList.innerHTML = '';
        if (activeBase.nodes.length === 0) {
            plannedNodesList.innerHTML = '<p class="section-explanation"><small>Aucun gisement sur cette base.</small></p>';
        } else {
            activeBase.nodes.forEach((nodeInstance, index) => {
                const nInfo = NODES[nodeInstance.id];
                const name = DICTIONARY[nodeInstance.id] || nInfo.slug;
                const isLiquid = (nodeInstance.id === 110 || nodeInstance.id === 111);
                const extName = isLiquid ? "Extracteur de liquide" : "Extracteur";

                const card = document.createElement('div');
                card.className = 'planner-card';
                card.innerHTML = `
                    <div class="card-top-row">
                        <div class="card-title">⛏️ ${name}</div>
                        <button class="qty-btn delete-btn remove-node-btn" data-index="${index}">×</button>
                    </div>
                    <div class="card-details">
                        Rendement brut : <strong>${nInfo.performance.rate}/h</strong> de <strong>${nInfo.performance.resource}</strong>
                    </div>
                    <div class="card-config-area">
                        <label class="checkbox-row">
                            <input type="checkbox" class="node-extractor-checkbox" data-index="${index}" ${nodeInstance.extractorAssigned ? 'checked' : ''}>
                            <span>Exploité par un ${extName}</span>
                        </label>
                    </div>
                `;
                plannedNodesList.appendChild(card);
            });
        }

        // Rendu des bâtiments
        plannedBuildingsList.innerHTML = '';
        if (activeBase.buildings.length === 0) {
            plannedBuildingsList.innerHTML = '<p class="section-explanation"><small>Aucun bâtiment construit.</small></p>';
        } else {
            activeBase.buildings.forEach((bInstance, index) => {
                const bInfo = BUILDINGS[bInstance.id];
                const name = DICTIONARY[bInstance.id] || bInfo.slug;

                // Description d'énergie/encombrement
                let specStr = '';
                if (bInfo.encombrement_bonus) specStr += `Place fournie: +${bInfo.encombrement_bonus} SU | `;
                if (bInfo.encombrement) specStr += `Encombrement: -${bInfo.encombrement} SU | `;

                let activeEnergy = getBuildingEnergyContribution(bInstance.id, bInfo);
                if (bInstance.id === 43 && bInstance.recipeIndex !== undefined) {
                    const r = bInfo.recipes[bInstance.recipeIndex];
                    if (r) {
                        const recipeEnergy = r.hasOwnProperty('energy') ? r.energy : bInfo.energy;
                        activeEnergy = -Math.abs(recipeEnergy);
                    }
                }
                if (bInfo.energy || (bInstance.id === 43 && bInstance.recipeIndex !== undefined)) {
                    specStr += `Énergie: ${activeEnergy > 0 ? '+' : ''}${activeEnergy} MW`;
                }

                const card = document.createElement('div');
                card.className = 'planner-card';

                let configAreaHtml = '';

                // Configuration spécifique si c'est une Fonderie ou un Assembleur
                if (bInstance.id === 43 || bInstance.id === 45) {
                    let selectedRecipeHtml = '';
                    let currentRecipeLabel = '';
                    if (bInstance.recipeIndex !== undefined && bInfo.recipes[bInstance.recipeIndex]) {
                        const r = bInfo.recipes[bInstance.recipeIndex];
                        const outName = Object.keys(r.outputs).map(oId => getResourceLabel(oId)).join(', ');
                        const ingredParts = Object.entries(r.ingredients)
                            .map(([iId, qty]) => `${qty}\u00d7 ${getResourceLabel(Number(iId))}`)
                            .join(', ');
                        currentRecipeLabel = `${outName} (${ingredParts})`;
                        const inputList = Object.entries(r.ingredients).map(([iId, qty]) => `${qty}x ${getResourceLabel(iId)}`).join(', ');
                        const outputList = Object.entries(r.outputs).map(([oId, qty]) => `${qty}x ${getResourceLabel(oId)}`).join(', ');
                        selectedRecipeHtml = `
                            <div class="recipe-io">
                                <div class="recipe-io-item"><span>Entrée :</span> <span>${inputList}</span></div>
                                <div class="recipe-io-item"><span>Sortie :</span> <span>${outputList} (${r.items_per_hour}/h)</span></div>
                            </div>`;
                    }

                    configAreaHtml = `
                        <div class="card-config-area">
                            <label>Recette active :</label>
                            <div class="recipe-search-box card-combobox" id="recipe-combo-${index}">
                                <input type="text" class="search-input recipe-combo-input" data-index="${index}"
                                       value="${currentRecipeLabel}" autocomplete="off" placeholder="-- Sélectionner une recette --">
                                <div class="dropdown-list hidden"></div>
                            </div>
                            ${selectedRecipeHtml}
                        </div>`;
                }
                // Configuration pour les autres usines de craft (Factory 60, Chemical Plant 46, Crystallizer 47)
                else if ([46, 47, 60].includes(bInstance.id)) {
                    let selectedRecipeHtml = '';
                    let currentCraftLabel = '';
                    if (bInstance.recipeItemId && ITEMS[bInstance.recipeItemId]) {
                        const it = ITEMS[bInstance.recipeItemId];
                        const recipeParts = Object.entries(it.recipe)
                            .map(([iId, qty]) => `${qty}\u00d7 ${getResourceLabel(Number(iId))}`)
                            .join(', ');
                        currentCraftLabel = `${getResourceLabel(bInstance.recipeItemId)} (${recipeParts})`;
                        const cycles = bInstance.cycleRate || 60;
                        const inputList = Object.entries(it.recipe).map(([iId, qty]) => `${qty}x ${getResourceLabel(iId)}`).join(', ');
                        const outputsProduced = (it.stackQty || 1);
                        selectedRecipeHtml = `
                            <div class="recipe-io">
                                <div class="recipe-io-item"><span>Ingrédients :</span> <span>${inputList}</span></div>
                                <div class="recipe-io-item"><span>Produit :</span> <span>${outputsProduced}x par cycle</span></div>
                                <div class="recipe-io-item"><span>Rendement estimé :</span> <span>${cycles * outputsProduced}/h</span></div>
                            </div>`;
                    }

                    configAreaHtml = `
                        <div class="card-config-area">
                            <div class="field" style="margin-bottom: 6px;">
                                <label>Recette d'objet :</label>
                                <div class="recipe-search-box card-combobox" id="craft-combo-${index}">
                                    <input type="text" class="search-input craft-combo-input" data-index="${index}"
                                           value="${currentCraftLabel}" autocomplete="off" placeholder="-- Sélectionner l'objet --">
                                    <div class="dropdown-list hidden"></div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Cycles par heure :</label>
                                <input type="number" class="building-cycles-input" data-index="${index}" value="${bInstance.cycleRate || 60}" min="1" step="any">
                            </div>
                            ${selectedRecipeHtml}
                        </div>`;
                }

                card.innerHTML = `
                    <div class="card-top-row">
                        <div class="card-title">🏢 ${name}</div>
                        <div class="item-controls">
                            <button class="qty-btn qty-minus" data-index="${index}">-</button>
                            <input type="number" class="qty-input building-qty-input" data-index="${index}" value="${bInstance.qty}" min="1">
                            <button class="qty-btn qty-plus" data-index="${index}">+</button>
                            <button class="qty-btn delete-btn remove-building-btn" data-index="${index}">×</button>
                        </div>
                    </div>
                    <div class="card-details">${specStr}</div>
                    ${configAreaHtml}
                `;
                plannedBuildingsList.appendChild(card);
            });
        }

        // Initialiser les combobox des cartes (recettes fonderie & craft)
        initCardComboboxes();
        // Relancer les calculs globaux de la base
        calculateAndRenderStats(activeBase);
    }

    // Initialise les combobox dynamiques à l'intérieur des cartes de bâtiments
    function initCardComboboxes() {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        // --- Combobox recette Fonderie ---
        document.querySelectorAll('.recipe-combo-input').forEach(input => {
            const index = Number(input.dataset.index);
            const dropdown = input.nextElementSibling;
            const bInstance = activeBase.buildings[index];
            if (!bInstance) return;
            const bInfo = BUILDINGS[bInstance.id];
            let hi = -1;

            function renderRecipeList(filter = '') {
                dropdown.innerHTML = '';
                hi = -1;
                const fl = filter.toLowerCase();
                const items = bInfo.recipes
                    .map((r, rIdx) => {
                        const outName = Object.keys(r.outputs).map(oId => getResourceLabel(oId)).join(', ');
                        const ingredParts = Object.entries(r.ingredients)
                            .map(([iId, qty]) => `${qty}× ${getResourceLabel(Number(iId))}`)
                            .join(', ');
                        return { idx: rIdx, label: `${outName} (${ingredParts})` };
                    })
                    .filter(r => r.label.toLowerCase().includes(fl));

                items.forEach(r => {
                    const div = document.createElement('div');
                    div.className = 'dropdown-item';
                    div.textContent = r.label;
                    div.addEventListener('click', () => {
                        bInstance.recipeIndex = r.idx;
                        saveBases();
                        renderActiveBaseDetails();
                    });
                    dropdown.appendChild(div);
                });
                dropdown.classList.toggle('hidden', items.length === 0);
            }

            function updateRecipeHi() {
                dropdown.querySelectorAll('.dropdown-item').forEach((d, i) => {
                    d.classList.toggle('active', i === hi);
                    if (i === hi) d.scrollIntoView({ block: 'nearest' });
                });
            }

            input.addEventListener('click', () => renderRecipeList(input.value));
            input.addEventListener('input', e => renderRecipeList(e.target.value));
            input.addEventListener('keydown', e => {
                const its = dropdown.querySelectorAll('.dropdown-item');
                if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hi + 1, its.length - 1); updateRecipeHi(); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); hi = Math.max(hi - 1, 0); updateRecipeHi(); }
                else if (e.key === 'Enter' && !dropdown.classList.contains('hidden') && hi >= 0) { e.preventDefault(); its[hi].click(); }
                else if (e.key === 'Escape') dropdown.classList.add('hidden');
            });
        });

        // --- Combobox recette Craft (assembleur, usine...) ---
        document.querySelectorAll('.craft-combo-input').forEach(input => {
            const index = Number(input.dataset.index);
            const dropdown = input.nextElementSibling;
            const bInstance = activeBase.buildings[index];
            if (!bInstance) return;
            let hi = -1;

            const craftables = Object.values(ITEMS)
                .filter(it => it.recipe)
                .map(it => {
                    const recipeParts = Object.entries(it.recipe)
                        .map(([iId, qty]) => `${qty}× ${getResourceLabel(Number(iId))}`)
                        .join(', ');
                    return { id: it.id, label: `${getResourceLabel(it.id)} (${recipeParts})` };
                })
                .sort((a, b) => a.label.localeCompare(b.label));

            function renderCraftList(filter = '') {
                dropdown.innerHTML = '';
                hi = -1;
                const fl = filter.toLowerCase();
                const items = craftables.filter(c => c.label.toLowerCase().includes(fl));
                items.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'dropdown-item';
                    div.textContent = c.label;
                    div.addEventListener('click', () => {
                        bInstance.recipeItemId = c.id;
                        saveBases();
                        renderActiveBaseDetails();
                    });
                    dropdown.appendChild(div);
                });
                dropdown.classList.toggle('hidden', items.length === 0);
            }

            function updateCraftHi() {
                dropdown.querySelectorAll('.dropdown-item').forEach((d, i) => {
                    d.classList.toggle('active', i === hi);
                    if (i === hi) d.scrollIntoView({ block: 'nearest' });
                });
            }

            input.addEventListener('click', () => renderCraftList(input.value));
            input.addEventListener('input', e => renderCraftList(e.target.value));
            input.addEventListener('keydown', e => {
                const its = dropdown.querySelectorAll('.dropdown-item');
                if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hi + 1, its.length - 1); updateCraftHi(); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); hi = Math.max(hi - 1, 0); updateCraftHi(); }
                else if (e.key === 'Enter' && !dropdown.classList.contains('hidden') && hi >= 0) { e.preventDefault(); its[hi].click(); }
                else if (e.key === 'Escape') dropdown.classList.add('hidden');
            });
        });
    }

    // --- Calculs et tableau de bord de la base active ---
    function calculateAndRenderStats(base) {
        let maxFootprint = 0;
        let usedFootprint = 0;
        let netEnergy = 0;
        let storageGeneral = 0;
        let storageLiquid = 0;

        let hourlyProduction = {}; // ID/String -> Qty per hour
        let hourlyConsumption = {}; // ID/String -> Qty per hour
        const producers = [];

        // 1. Calculer à partir des gisements actifs et enregistrer les producteurs
        base.nodes.forEach(nodeInstance => {
            const nInfo = NODES[nodeInstance.id];
            if (nodeInstance.extractorAssigned) {
                const resKey = getResourceIdOrString(nInfo.performance.resource);

                // Ajouter l'extracteur correspondant
                const isLiquid = (nodeInstance.id === 110 || nodeInstance.id === 111);
                const extId = isLiquid ? 58 : 40;
                const extInfo = BUILDINGS[extId];

                usedFootprint += extInfo.encombrement || 0;
                netEnergy += getBuildingEnergyContribution(extId, extInfo);

                producers.push({
                    type: 'node',
                    id: nodeInstance.id,
                    inputs: {},
                    outputs: { [resKey]: nInfo.performance.rate },
                    qty: 1
                });
            }
        });

        // 2. Calculer à partir des bâtiments construits et enregistrer les producteurs
        base.buildings.forEach(bInstance => {
            const bInfo = BUILDINGS[bInstance.id];
            const qty = bInstance.qty;

            // Encombrement et Energie
            if (bInfo.encombrement_bonus) maxFootprint += bInfo.encombrement_bonus * qty;
            if (bInfo.encombrement) usedFootprint += bInfo.encombrement * qty;

            // Énergie (exclut fonderie/assembleur avec recette car géré dans leur section dédiée)
            if (bInfo.energy) {
                if ((bInstance.id === 43 || bInstance.id === 45) && bInstance.recipeIndex !== undefined) {
                    // Géré ci-dessous dans la section Fonderie/Assembleur
                } else {
                    netEnergy += getBuildingEnergyContribution(bInstance.id, bInfo) * qty;
                }
            }

            // Stockages
            if (bInfo.storage_su) storageGeneral += bInfo.storage_su * qty;
            if (bInfo.storage_liquid) storageLiquid += bInfo.storage_liquid * qty;

            // Fonderie & Assembleur (système recettes intégré)
            if (bInstance.id === 43 || bInstance.id === 45) {
                if (bInstance.recipeIndex !== undefined) {
                    const r = bInfo.recipes[bInstance.recipeIndex];
                    if (r) {
                        const primaryOutKey = Object.keys(r.outputs)[0];
                        const primaryOutQty = r.outputs[primaryOutKey];
                        const cycleRate = r.items_per_hour / primaryOutQty; // Cycles par heure par fonderie

                        const inputs = {};
                        Object.entries(r.ingredients).forEach(([iId, iQty]) => {
                            inputs[Number(iId)] = cycleRate * iQty;
                        });

                        const outputs = {};
                        Object.entries(r.outputs).forEach(([oId, oQty]) => {
                            outputs[Number(oId)] = cycleRate * oQty;
                        });

                        producers.push({
                            type: 'foundry',
                            id: bInstance.id,
                            inputs,
                            outputs,
                            qty
                        });

                        // Consommation d'énergie de la recette
                        const recipeEnergy = r.hasOwnProperty('energy') ? r.energy : (bInfo.energy || 0);
                        netEnergy -= Math.abs(recipeEnergy) * qty;
                    } else {
                        // Fallback : consomme l'énergie de base
                        netEnergy += getBuildingEnergyContribution(bInstance.id, bInfo) * qty;
                    }
                } else {
                    // Fallback : consomme l'énergie de base
                    netEnergy += getBuildingEnergyContribution(bInstance.id, bInfo) * qty;
                }
            }

            // Autres usines
            if ([46, 47, 60].includes(bInstance.id) && bInstance.recipeItemId) {
                const item = ITEMS[bInstance.recipeItemId];
                if (item && item.recipe) {
                    const cycles = bInstance.cycleRate || 60;

                    const inputs = {};
                    Object.entries(item.recipe).forEach(([iId, iQty]) => {
                        inputs[Number(iId)] = cycles * iQty;
                    });

                    const outputs = {
                        [item.id]: cycles * (item.stackQty || 1)
                    };

                    producers.push({
                        type: 'factory',
                        id: bInstance.id,
                        inputs,
                        outputs,
                        qty
                    });
                }
            }
        });

        // 3. Boucle de résolution itérative des taux de fonctionnement
        producers.forEach(p => p.rate = 1.0);

        const numIterations = 30;
        for (let iter = 0; iter < numIterations; iter++) {
            const supply = {};
            const demand = {};

            producers.forEach(p => {
                Object.entries(p.outputs).forEach(([rId, val]) => {
                    const resId = isNaN(rId) ? rId : Number(rId);
                    supply[resId] = (supply[resId] || 0) + val * p.qty * p.rate;
                });
                Object.entries(p.inputs).forEach(([rId, val]) => {
                    const resId = isNaN(rId) ? rId : Number(rId);
                    demand[resId] = (demand[resId] || 0) + val * p.qty * p.rate;
                });
            });

            let changed = false;
            producers.forEach(p => {
                let minRatio = 1.0;
                Object.entries(p.inputs).forEach(([rId, val]) => {
                    const resId = isNaN(rId) ? rId : Number(rId);
                    const rSupply = supply[resId] || 0;
                    const rDemand = demand[resId] || 0;
                    if (rDemand > 1e-5 && rSupply < rDemand - 1e-5) {
                        const ratio = rSupply / rDemand;
                        if (ratio < minRatio) {
                            minRatio = ratio;
                        }
                    }
                });

                if (minRatio < 0.99999) {
                    p.rate = p.rate * minRatio;
                    changed = true;
                }
            });
            if (!changed) break;
        }

        // 4. Calculer les statistiques finales et intrants manquants
        const targetProduction = {};
        const targetConsumption = {};
        const missingInputsForResource = {}; // resourceId -> { ingredientId -> missingQty }

        producers.forEach(p => {
            Object.entries(p.outputs).forEach(([rId, val]) => {
                const resId = isNaN(rId) ? rId : Number(rId);
                hourlyProduction[resId] = (hourlyProduction[resId] || 0) + val * p.qty * p.rate;
                targetProduction[resId] = (targetProduction[resId] || 0) + val * p.qty;
            });

            Object.entries(p.inputs).forEach(([rId, val]) => {
                const resId = isNaN(rId) ? rId : Number(rId);
                hourlyConsumption[resId] = (hourlyConsumption[resId] || 0) + val * p.qty * p.rate;
                targetConsumption[resId] = (targetConsumption[resId] || 0) + val * p.qty;
            });

            if (p.rate < 0.99999) {
                const missingRatio = 1.0 - p.rate;
                Object.entries(p.outputs).forEach(([rId, val]) => {
                    const resId = isNaN(rId) ? rId : Number(rId);
                    if (!missingInputsForResource[resId]) {
                        missingInputsForResource[resId] = {};
                    }
                    Object.entries(p.inputs).forEach(([inId, inVal]) => {
                        const ingId = isNaN(inId) ? inId : Number(inId);
                        const missingQty = missingRatio * inVal * p.qty;
                        if (missingQty > 1e-5) {
                            missingInputsForResource[resId][ingId] = (missingInputsForResource[resId][ingId] || 0) + missingQty;
                        }
                    });
                });
            }
        });

        // --- Mise à jour de l'affichage ---

        // 1. Encombrement
        footprintValue.textContent = `${usedFootprint} / ${maxFootprint} SU`;
        let pct = maxFootprint > 0 ? (usedFootprint / maxFootprint) * 100 : 0;
        footprintProgressBar.style.width = `${Math.min(pct, 100)}%`;

        // Retirer les anciennes classes et adapter selon le pourcentage
        footprintProgressBar.classList.remove('warning', 'danger');
        if (pct > 100) {
            footprintProgressBar.classList.add('danger');
            footprintAlert.classList.remove('hidden');
        } else if (pct >= 85) {
            footprintProgressBar.classList.add('warning');
            footprintAlert.classList.add('hidden');
        } else {
            footprintAlert.classList.add('hidden');
        }

        // 2. Énergie
        energyBadge.textContent = `${netEnergy > 0 ? '+' : ''}${netEnergy} MW`;
        energyBadge.classList.remove('positive', 'negative');
        if (netEnergy >= 0) {
            energyBadge.classList.add('positive');
        } else {
            energyBadge.classList.add('negative');
        }

        // 3. Stockages
        storageGeneralVal.textContent = `${storageGeneral} SU`;
        storageLiquidVal.textContent = `${storageLiquid} L`;

        // 4. Bilan Horaire Net
        netYieldsList.innerHTML = '';

        // Helper : détermine si une clé correspond à un minerai/ressource brute
        function isRawResource(key) {
            const item = ITEMS[key];
            if (item && item.isResource) return true;
            // Ressources liquides stockées comme strings (ex: "Eau", "Acide")
            if (typeof key === 'string' && isNaN(key)) return true;
            return false;
        }

        // Séparer : minerais (toujours affichés) vs items fabriqués (surplus seulement)
        const allProducedKeys = Object.keys(hourlyProduction);
        const resourceKeys = allProducedKeys.filter(k => isRawResource(k));
        const surplusManufacturedKeys = allProducedKeys.filter(k => {
            if (isRawResource(k)) return false;
            const prod = hourlyProduction[k] || 0;
            const cons = hourlyConsumption[k] || 0;
            return (prod - cons) > 1e-5;
        });

        // Tri alphabétique pour chaque groupe
        const sortByName = (a, b) => getResourceLabel(a).toLowerCase().localeCompare(getResourceLabel(b).toLowerCase());
        resourceKeys.sort(sortByName);
        surplusManufacturedKeys.sort(sortByName);

        function renderYieldRow(key, forceShow = false) {
            const prod = hourlyProduction[key] || 0;
            const cons = hourlyConsumption[key] || 0;
            const net = prod - cons;

            // Ne pas afficher si production nulle et non forcé
            if (!forceShow && prod < 1e-5) return;

            const targetProd = targetProduction[key] || 0;
            let pct = 100;
            if (targetProd > 0) pct = (prod / targetProd) * 100;

            let netFormatted = Math.abs(net).toFixed(1);
            if (netFormatted.endsWith('.0')) netFormatted = Math.abs(net).toFixed(0);
            const sign = net >= 0 ? '+' : '-';

            const isConstrained = pct < 99.9;
            let badgeClass, netBadgeClass;
            if (net < -1e-5) {
                badgeClass = 'negative';
                netBadgeClass = 'negative';
            } else if (isConstrained) {
                badgeClass = 'warning';
                netBadgeClass = 'warning';
            } else {
                badgeClass = 'positive';
                netBadgeClass = 'positive';
            }

            let missingStr = '';
            if (isConstrained && missingInputsForResource[key]) {
                const missingParts = Object.entries(missingInputsForResource[key]).map(([mId, mQty]) => {
                    let mQtyFormatted = mQty.toFixed(1);
                    if (mQtyFormatted.endsWith('.0')) mQtyFormatted = mQty.toFixed(0);
                    return `${mQtyFormatted} ${getResourceLabel(mId)}`;
                });
                if (missingParts.length > 0) missingStr = ` - Manquant : ${missingParts.join(', ')}`;
            }

            const pctStr = isConstrained ? `Produit à ${pct.toFixed(0)}%${missingStr}` : '';

            const yieldDiv = document.createElement('div');
            yieldDiv.className = 'yield-item';
            yieldDiv.innerHTML = `
                <div class="item-column">
                    <span class="yield-name">${getResourceLabel(key)}</span>
                    <span class="yield-details">${isConstrained ? `<span class="yield-warning-text">(${pctStr})</span>` : ''}</span>
                </div>
                <div class="yield-meta">
                    <span class="yield-value ${netBadgeClass}">${sign}${netFormatted}/h</span>
                </div>
            `;
            netYieldsList.appendChild(yieldDiv);
        }

        // Afficher d'abord les minerais (toujours), puis les items fabriqués en surplus
        if (resourceKeys.length === 0 && surplusManufacturedKeys.length === 0) {
            netYieldsList.innerHTML = '<p class="section-explanation"><small>Aucun rendement à afficher.</small></p>';
            return;
        }

        if (resourceKeys.length > 0) {
            const header = document.createElement('p');
            header.className = 'section-explanation';
            header.innerHTML = '<small>⛏️ Minerais</small>';
            netYieldsList.appendChild(header);
            resourceKeys.forEach(k => renderYieldRow(k, true));
        }

        if (surplusManufacturedKeys.length > 0) {
            const header = document.createElement('p');
            header.className = 'section-explanation';
            header.innerHTML = '<small>📦 Surplus fabriqués</small>';
            netYieldsList.appendChild(header);
            surplusManufacturedKeys.forEach(k => renderYieldRow(k, false));
        }
    }

    // --- Bouton "Construire la base" ---
    const buildBaseBtn = document.getElementById('buildBaseBtn');
    if (buildBaseBtn) {
        buildBaseBtn.addEventListener('click', () => {
            const activeBase = bases.find(b => b.id === activeBaseId);
            if (!activeBase) return;

            // Construire la file : bâtiments avec une recette craftable dans ITEMS
            const buildQueue = {};

            // 1. Bâtiments planifiés
            activeBase.buildings.forEach(bInstance => {
                if (bInstance.qty <= 0) return;
                const item = ITEMS[bInstance.id];
                if (item && item.recipe) {
                    buildQueue[bInstance.id] = (buildQueue[bInstance.id] || 0) + bInstance.qty;
                }
            });

            // 2. Extracteurs issus des gisements assignés
            activeBase.nodes.forEach(nodeInstance => {
                if (!nodeInstance.extractorAssigned) return;
                const isLiquid = (nodeInstance.id === 110 || nodeInstance.id === 111);
                const extId = isLiquid ? 58 : 40;
                const item = ITEMS[extId];
                if (item && item.recipe) {
                    buildQueue[extId] = (buildQueue[extId] || 0) + 1;
                }
            });

            if (Object.keys(buildQueue).length === 0) {
                alert("Aucun bâtiment constructible trouvé dans cette base.");
                return;
            }

            // Passer la file au calculateur via sessionStorage (persisté dans le même onglet)
            sessionStorage.setItem('spacecraft_import_queue', JSON.stringify(buildQueue));
            window.location.href = 'index.html';
        });
    }

    // --- Gestion des événements de base ---

    // 1. Bouton créer une base
    createBaseBtn.addEventListener('click', () => {
        const name = prompt("Nom de la nouvelle base :", `Base ${bases.length + 1}`);
        if (name && name.trim()) {
            const newBase = {
                id: 'base_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                name: name.trim(),
                nodes: [],
                buildings: []
            };
            bases.push(newBase);
            saveBases();
            renderBaseList();
            selectBase(newBase.id);
        }
    });

    // 2. Bouton supprimer base
    deleteBaseBtn.addEventListener('click', () => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        if (confirm(`Voulez-vous vraiment supprimer la base "${activeBase.name}" ?`)) {
            bases = bases.filter(b => b.id !== activeBaseId);
            saveBases();
            renderBaseList();

            if (bases.length > 0) {
                selectBase(bases[0].id);
            } else {
                activeBaseId = null;
                selectBase(null);
            }
        }
    });

    // 3. Renommer la base
    baseNameInput.addEventListener('change', (e) => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (activeBase && e.target.value.trim()) {
            activeBase.name = e.target.value.trim();
            saveBases();
            renderBaseList();
        }
    });

    // --- Gestion des Gisements ---
    addNodeBtn.addEventListener('click', () => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        if (!selectedNodeId) return;

        activeBase.nodes.push({
            id: selectedNodeId,
            extractorAssigned: true // Actif par défaut
        });

        saveBases();
        renderActiveBaseDetails();
        // Reset combobox
        nodeSearch.value = '';
        selectedNodeId = null;
        nodesDropdown.classList.add('hidden');
    });

    plannedNodesList.addEventListener('click', (e) => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        // Suppression de gisement
        const removeBtn = e.target.closest('.remove-node-btn');
        if (removeBtn) {
            const idx = Number(removeBtn.dataset.index);
            activeBase.nodes.splice(idx, 1);
            saveBases();
            renderActiveBaseDetails();
            return;
        }
    });

    plannedNodesList.addEventListener('change', (e) => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        // Toggle checkbox extracteur
        const chk = e.target.closest('.node-extractor-checkbox');
        if (chk) {
            const idx = Number(chk.dataset.index);
            activeBase.nodes[idx].extractorAssigned = chk.checked;
            saveBases();
            renderActiveBaseDetails();
        }
    });

    // --- Gestion des Bâtiments ---
    addBuildingBtn.addEventListener('click', () => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        if (!selectedBuildingId) return;
        const bId = selectedBuildingId;

        // Si le bâtiment est unique et déjà présent, on bloque
        const bInfo = BUILDINGS[bId];
        if (bInfo.isUnique) {
            const alreadyExists = activeBase.buildings.some(b => b.id === bId);
            if (alreadyExists) {
                alert("Ce bâtiment est unique et ne peut être construit qu'en un seul exemplaire.");
                return;
            }
        }

        activeBase.buildings.push({
            id: bId,
            qty: 1,
            recipeIndex: bId === 43 ? 0 : undefined,
            recipeItemId: [45, 46, 47, 60].includes(bId) ? "" : undefined,
            cycleRate: [45, 46, 47, 60].includes(bId) ? 60 : undefined
        });

        saveBases();
        renderActiveBaseDetails();
        // Reset combobox bâtiment
        buildingSearch.value = '';
        selectedBuildingId = null;
        buildingsDropdown.classList.add('hidden');
    });

    function getMultiplier(e) {
        if (e.ctrlKey || e.metaKey) return 100;
        return 1;
    }

    function updateBuildingQty(bInstance, delta) {
        bInstance.qty = Math.max(1, bInstance.qty + delta);
        saveBases();
        renderActiveBaseDetails();
    }

    plannedBuildingsList.addEventListener('click', (e) => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        const btn = e.target.closest('.qty-btn');
        const removeBtn = e.target.closest('.remove-building-btn');

        if (removeBtn) {
            const idx = Number(removeBtn.dataset.index);
            activeBase.buildings.splice(idx, 1);
            saveBases();
            updateBuildingSelector();
            renderActiveBaseDetails();
            return;
        }

        if (btn) {
            const idx = Number(btn.dataset.index);
            const bInstance = activeBase.buildings[idx];
            if (!bInstance) return;

            const mult = getMultiplier(e);
            const delta = btn.classList.contains('qty-plus') ? mult : -mult;
            updateBuildingQty(bInstance, delta);
        }
    });

    // Click droit pour +/- 10
    plannedBuildingsList.addEventListener('contextmenu', (e) => {
        const btn = e.target.closest('.qty-btn:not(.delete-btn)');
        if (btn) {
            e.preventDefault();
            const activeBase = bases.find(b => b.id === activeBaseId);
            if (!activeBase) return;

            const idx = Number(btn.dataset.index);
            const bInstance = activeBase.buildings[idx];
            if (!bInstance) return;

            const delta = btn.classList.contains('qty-plus') ? 10 : -10;
            updateBuildingQty(bInstance, delta);
        }
    });

    plannedBuildingsList.addEventListener('change', (e) => {
        const activeBase = bases.find(b => b.id === activeBaseId);
        if (!activeBase) return;

        const idx = Number(e.target.dataset.index);
        const bInstance = activeBase.buildings[idx];
        if (!bInstance) return;

        // Input quantité manuel
        if (e.target.classList.contains('building-qty-input')) {
            const val = parseInt(e.target.value, 10) || 1;
            bInstance.qty = Math.max(1, val);
            saveBases();
            renderActiveBaseDetails();
        }

        // Input cycle par heure
        if (e.target.classList.contains('building-cycles-input')) {
            const val = parseFloat(e.target.value) || 1;
            bInstance.cycleRate = Math.max(1, val);
            saveBases();
            renderActiveBaseDetails();
        }
    });

    // --- Lancement initial ---
    loadBases();
    initDropdowns();
    renderBaseList();

    // Sélectionner la première base si elle existe
    if (bases.length > 0) {
        selectBase(bases[0].id);
    }
});
