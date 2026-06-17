// Dictionnaire : ID Anglais -> Label Français
const DICTIONARY = {
    1: "Lingot de fer",
    2: "Lingot de cuivre",
    3: "Lingot de silicium",
    4: "Drone",
    5: "Moteur",
    6: "Micropuce",
    7: "Bobine magnétique",
    8: "Plaque de métal",
    9: "Écrou et boulon",
    10: "Substrat semi-conducteur",
    11: "Gel silicone",
    12: "Fil électrique"
};

// Base de données des objets : Regroupe le type et la recette
const ITEMS = {
    1: { id: 1, slug: "iron_ingot", isResource: true },
    2: { id: 2, slug: "copper_ingot", isResource: true },
    3: { id: 3, slug: "silicon_ingot", isResource: true },
    4: { id: 4, slug: "drone", recipe: { 5: 1, 6: 1, 8: 1, 9: 6 } },
    5: { id: 5, slug: "motor", recipe: { 8: 1, 7: 5, 11: 5 } },
    6: { id: 6, slug: "microchip", recipe: { 10: 1 } },
    7: { id: 7, slug: "magnetic_coil", recipe: { 1: 1, 9: 1, 12: 5 } },
    // Composants primitifs
    8: { id: 8, slug: "metal_plate", isPrimitive: true, recipe: { 1: 0.5 } },
    9: { id: 9, slug: "nut_and_bolt", isPrimitive: true, recipe: { 1: 0.125 } },
    10: { id: 10, slug: "semiconductor_substrate", isPrimitive: true, recipe: { 3: 0.25 } },
    11: { id: 11, slug: "silicone_gel", isPrimitive: true, recipe: { 3: 1 } },
    12: { id: 12, slug: "electric_wire", isPrimitive: true, recipe: { 2: 0.25 } }
};
