// Dictionnaire : ID Anglais -> Label Français
const DICTIONARY = {
    "extractor": "Extracteur",
    "foundry": "Fonderie",
    "iron_plate": "Plaque de fer",
    "iron_gear": "Engrenage en fer",
    "iron_rod": "Tige de fer",
    "cable": "Câble",
    "copper_wire": "Fil de cuivre",
    "iron_ingot": "Lingot de fer",
    "copper_ingot": "Lingot de cuivre"
};

// Recettes : Uniquement avec les identifiants anglais
const RECIPES = {
    "extractor": { "iron_plate": 10, "iron_gear": 5, "cable": 2 },
    "foundry": { "iron_plate": 5, "iron_rod": 8 },
    "iron_plate": { "iron_ingot": 2 },
    "iron_gear": { "iron_ingot": 3 },
    "iron_rod": { "iron_ingot": 1 },
    "cable": { "copper_wire": 2 },
    "copper_wire": { "copper_ingot": 1 }
};
