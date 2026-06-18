const BUILDING_DICTIONARY = {
    39: "Tour de commande",
    40: "Extracteur",
    41: "Centrale solaire",
    42: "Pylône",
    43: "Fonderie",
    44: "Micro-fourneau",
    45: "Assembleur",
    46: "Usine chimique",
    47: "Cristallisateur",
    48: "Entrepôt",
    49: "Boîte d’échange",
    50: "Répartiteur de drones",
    51: "Citerne",
    52: "Citerne de mag-plasma",
    53: "Plateforme d’atterrissage",
    54: "Chantier spatial",
    55: "Ferme xénique",
    56: "Centrale à combustible",
    57: "Groupement de batteries",
    58: "Extracteur de liquide",
    59: "Usine de conditionnement",
    60: "Usine"
};

const BUILDINGS = {
    39: { "id": 39, "slug": "command_tower", "recipes": [] },
    40: { "id": 40, "slug": "extractor", "recipes": [] },
    41: { "id": 41, "slug": "solar_plant", "recipes": [] },
    42: { "id": 42, "slug": "pylon", "recipes": [] },
    43: { "id": 43, "slug": "foundry", "recipes": [] },
    44: { "id": 44, "slug": "micro_furnace", "recipes": [] },
    45: { "id": 45, "slug": "assembler", "recipes": [] },
    46: { "id": 46, "slug": "chemical_plant", "recipes": [] },
    47: { "id": 47, "slug": "crystallizer", "recipes": [] },
    48: { "id": 48, "slug": "warehouse", "recipes": [] },
    49: { "id": 49, "slug": "exchange_box", "recipes": [] },
    50: { "id": 50, "slug": "drone_hub", "recipes": [] },
    51: { "id": 51, "slug": "tank", "recipes": [] },
    52: { "id": 52, "slug": "mag_plasma_tank", "recipes": [] },
    53: { "id": 53, "slug": "landing_pad", "recipes": [] },
    54: { "id": 54, "slug": "space_shipyard", "recipes": [] },
    55: { "id": 55, "slug": "xenic_farm", "recipes": [] },
    56: { "id": 56, "slug": "fuel_plant", "recipes": [] },
    57: { "id": 57, "slug": "battery_cluster", "recipes": [] },
    58: { "id": 58, "slug": "liquid_extractor", "recipes": [] },
    59: { "id": 59, "slug": "packaging_plant", "recipes": [] },
    60: { "id": 60, "slug": "factory", "recipes": [] }
};

const NODE_DICTIONARY = {
    101: "Gisement de fer dense",
    102: "Gisement de cuivre dense",
    103: "Gisement de fer",
    104: "Gisement de charbon",
    105: "Gisement de grès",
    106: "Gisement de cuivre",
    107: "Gisement de titane",
    108: "Gisement d'aluminium",
    109: "Gisement de platine",
    110: "Bassin de saumure",
    111: "Bassin de vitriol"
};

const NODES = {
    101: { "id": 101, "slug": "dense_iron_node", "performance": { "resource": "Pépite de fer", "rate": 120 } },
    102: { "id": 102, "slug": "dense_copper_node", "performance": { "resource": "Pépite de cuivre", "rate": 120 } },
    103: { "id": 103, "slug": "iron_node", "performance": { "resource": "Minerai de fer", "rate": 60 } },
    104: { "id": 104, "slug": "coal_node", "performance": { "resource": "Carbone-a", "rate": 40 } },
    105: { "id": 105, "slug": "sandstone_node", "performance": { "resource": "Silicate", "rate": 100 } },
    106: { "id": 106, "slug": "copper_node", "performance": { "resource": "Minerai de cuivre", "rate": 60 } },
    107: { "id": 107, "slug": "titanium_node", "performance": { "resource": "Minerai de titane", "rate": 60 } },
    108: { "id": 108, "slug": "aluminum_node", "performance": { "resource": "Minerai d'aluminium", "rate": 60 } },
    109: { "id": 109, "slug": "platinum_node", "performance": { "resource": "Minerai de platine", "rate": 60 } },
    110: { "id": 110, "slug": "brine_pool", "performance": { "resource": "Eau", "rate": 400 } },
    111: { "id": 111, "slug": "vitriol_pool", "performance": { "resource": "Acide", "rate": 400 } }
};