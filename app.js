document.addEventListener('DOMContentLoaded', () => {
    const itemSelect = document.getElementById('itemSelect');
    const itemQty = document.getElementById('itemQty');
    const addBtn = document.getElementById('addBtn');
    const queueList = document.getElementById('queueList');
    const resourceTotals = document.getElementById('resourceTotals');
    const componentTotals = document.getElementById('componentTotals');
    const componentsArea = document.getElementById('componentsArea');
    const resultArea = document.getElementById('resultArea');

    let buildQueue = [];

    // Remplir le select au démarrage
    function initSelect() {
        Object.keys(RECIPES).forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = DICTIONARY[id] || id;
            itemSelect.appendChild(option);
        });
    }

    // Calcul récursif pour remonter aux ressources de base
    function calculateTotals() {
        const baseResources = {};
        const intermediates = {};

        function resolve(id, multiplier, isRoot = false) {
            const recipe = RECIPES[id];
            
            // Si ce n'est pas l'objet final qu'on a ajouté à la liste
            if (!isRoot) {
                if (recipe) {
                    intermediates[id] = (intermediates[id] || 0) + multiplier;
                } else {
                    baseResources[id] = (baseResources[id] || 0) + multiplier;
                    return;
                }
            }

            if (recipe) {
                for (const [ingredientId, amount] of Object.entries(recipe)) {
                    resolve(ingredientId, amount * multiplier);
                }
            }
        }

        buildQueue.forEach(item => resolve(item.id, item.qty, true));
        return { baseResources, intermediates };
    }

    function render() {
        // Vider la liste actuelle
        queueList.innerHTML = '';
        
        buildQueue.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'row';
            row.innerHTML = `
                <span>${item.qty}x <strong>${DICTIONARY[item.id] || item.id}</strong></span>
                <button class="remove-btn" data-index="${index}">&times;</button>
            `;
            queueList.appendChild(row);
        });

        // Calculer et afficher les résultats
        if (buildQueue.length > 0) {
            const { baseResources, intermediates } = calculateTotals();
            
            // Affichage Composants Intermédiaires
            if (Object.keys(intermediates).length > 0) {
                componentsArea.style.display = 'block';
                componentTotals.innerHTML = '';
                for (const [id, qty] of Object.entries(intermediates)) {
                    componentTotals.innerHTML += `
                        <div class="row">
                            <span>${DICTIONARY[id] || id}</span>
                            <span><strong>${qty}</strong></span>
                        </div>`;
                }
            } else {
                componentsArea.style.display = 'none';
            }

            // Affichage Ressources de Base
            resultArea.style.display = 'block';
            resourceTotals.innerHTML = '';
            for (const [id, qty] of Object.entries(baseResources)) {
                resourceTotals.innerHTML += `
                    <div class="row">
                        <span>${DICTIONARY[id] || id}</span>
                        <span><strong>${qty}</strong></span>
                    </div>`;
            }
        } else {
            resultArea.style.display = 'none';
            componentsArea.style.display = 'none';
        }
    }

    // Événements
    addBtn.addEventListener('click', () => {
        buildQueue.push({
            id: itemSelect.value,
            qty: parseInt(itemQty.value) || 1
        });
        render();
    });

    queueList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const index = e.target.getAttribute('data-index');
            buildQueue.splice(index, 1);
            render();
        }
    });

    initSelect();
});
