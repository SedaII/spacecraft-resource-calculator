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
    12: "Fil électrique",
    13: "Plaque d'inox",
    14: "Poutrelle structurelle",
    15: "Béton",
    16: "Cellule photovoltaïque",
    17: "Calcite",
    18: "Pompe",
    19: "Tuyau étanche",
    20: "Chambre de confinement",
    21: "Plaque monomagnétique",
    22: "Batterie chimique",
    23: "Plaque de métal robuste",
    24: "Acide sulfurique",
    25: "Cristal de graphite",
    26: "Lingot de vanadium",
    27: "Actionneur hydraulique",
    28: "Petit kit modulaire",
    29: "Graphène",
    30: "Kit modulaire",
    31: "Quartz",
    32: "Focalisateur cristallin",
    33: "Pyrite",
    34: "Matrice de cristal-c",
    35: "Azurite/Malachite",
    36: "Matrice de cristal-m",
    37: "Hématite/Quartz/Cristal de graphite/Aigue-marine",
    38: "Matrice de cristal-h",
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
    60: "Usine",
    61: "Hyperlentille",
    62: "Lingot d'alu",
    63: "Lingot d'acier",
    64: "Carbon-a",
    65: "Silicate"
};

// Base de données des objets : Regroupe le type et la recette
const ITEMS = {
    1: {
        "id": 1,
        "slug": "iron_ingot",
        "isResource": true
    },
    2: {
        "id": 2,
        "slug": "copper_ingot",
        "isResource": true
    },
    3: {
        "id": 3,
        "slug": "silicon_ingot",
        "isResource": true
    },
    4: {
        "id": 4,
        "slug": "drone",
        "recipe": {
            5: 1,
            6: 1,
            8: 1,
            9: 6,
            13: 2
        }
    },
    5: {
        "id": 5,
        "slug": "motor",
        "recipe": {
            7: 5,
            8: 1,
            11: 5
        }
    },
    6: {
        "id": 6,
        "slug": "microchip",
        "recipe": {
            10: 1
        }
    },
    7: {
        "id": 7,
        "slug": "magnetic_coil",
        "recipe": {
            1: 1,
            9: 1,
            12: 5
        }
    },
    8: {
        "id": 8,
        "slug": "metal_plate",
        "isPrimitive": true,
        "recipe": {
            1: 0.5
        }
    },
    9: {
        "id": 9,
        "slug": "nut_and_bolt",
        "isPrimitive": true,
        "recipe": {
            1: 0.125
        }
    },
    10: {
        "id": 10,
        "slug": "semiconductor_substrate",
        "isPrimitive": true,
        "recipe": {
            3: 0.25
        }
    },
    11: {
        "id": 11,
        "slug": "silicone_gel",
        "isPrimitive": true,
        "recipe": {
            3: 1
        }
    },
    12: {
        "id": 12,
        "slug": "electric_wire",
        "isPrimitive": true,
        "recipe": {
            2: 0.25
        }
    },
    13: {
        "id": 13,
        "slug": "stainless_steel_plate",
        "isPrimitive": true,
        "recipe": {
            2: 0.5,
            62: 1
        }
    },
    14: {
        "id": 14,
        "slug": "structural_beam",
        "isPrimitive": true,
        "recipe": {
            63: 2
        }
    },
    15: {
        "id": 15,
        "slug": "concrete",
        "isPrimitive": true
    },
    16: {
        "id": 16,
        "slug": "photovoltaic_cell"
    },
    17: {
        "id": 17,
        "slug": "calcite"
    },
    18: {
        "id": 18,
        "slug": "pump"
    },
    19: {
        "id": 19,
        "slug": "watertight_pipe"
    },
    20: {
        "id": 20,
        "slug": "confinement_chamber"
    },
    21: {
        "id": 21,
        "slug": "monomagnetic_plate"
    },
    22: {
        "id": 22,
        "slug": "chemical_battery",
        "recipe": {
            13: 1,
            24: 20,
            25: 1,
            26: 1
        }
    },
    23: {
        "id": 23,
        "slug": "heavy_metal_plate"
    },
    24: {
        "id": 24,
        "slug": "sulfuric_acid"
    },
    25: {
        "id": 25,
        "slug": "graphite_crystal"
    },
    26: {
        "id": 26,
        "slug": "vanadium_ingot"
    },
    27: {
        "id": 27,
        "slug": "hydraulic_actuator"
    },
    28: {
        "id": 28,
        "slug": "small_modular_kit",
        "recipe": {
            9: 20,
            12: 10
        }
    },
    29: {
        "id": 29,
        "slug": "graphene"
    },
    30: {
        "id": 30,
        "slug": "modular_kit",
        "recipe": {
            23: 20,
            28: 4,
            29: 20
        }
    },
    31: {
        "id": 31,
        "slug": "quartz"
    },
    32: {
        "id": 32,
        "slug": "crystal_focuser",
        "recipe": {
            12: 5,
            31: 1
        }
    },
    33: {
        "id": 33,
        "slug": "pyrite"
    },
    34: {
        "id": 34,
        "slug": "crystal_matrix_c",
        "recipe": {
            33: 1
        }
    },
    35: {
        "id": 35,
        "slug": "azurite_malachite"
    },
    36: {
        "id": 36,
        "slug": "crystal_matrix_m",
        "recipe": {
            35: 1
        }
    },
    37: {
        "id": 37,
        "slug": "hematite_quartz_ore"
    },
    38: {
        "id": 38,
        "slug": "crystal_matrix_h",
        "recipe": {
            37: 1
        }
    },
    39: {
        "id": 39,
        "slug": "command_tower",
        "recipe": {
            7: 80,
            13: 50,
            14: 25,
            15: 250
        }
    },
    40: {
        "id": 40,
        "slug": "extractor",
        "recipe": {
            5: 1,
            15: 4
        }
    },
    41: {
        "id": 41,
        "slug": "solar_plant",
        "recipe": {
            13: 9,
            14: 1,
            16: 36
        }
    },
    42: {
        "id": 42,
        "slug": "pylon",
        "recipe": {
            7: 1
        }
    },
    43: {
        "id": 43,
        "slug": "foundry",
        "recipe": {
            13: 1,
            15: 10
        }
    },
    44: {
        "id": 44,
        "slug": "micro_furnace",
        "recipe": {
            13: 2,
            15: 5,
            17: 1
        }
    },
    45: {
        "id": 45,
        "slug": "assembler",
        "recipe": {
            5: 3,
            13: 8,
            14: 4,
            15: 40
        }
    },
    46: {
        "id": 46,
        "slug": "chemical_plant",
        "recipe": {
            13: 80,
            14: 8,
            15: 40,
            18: 5,
            19: 120
        }
    },
    47: {
        "id": 47,
        "slug": "crystallizer",
        "recipe": {
            13: 10,
            14: 2,
            15: 10,
            19: 1
        }
    },
    48: {
        "id": 48,
        "slug": "warehouse",
        "recipe": {
            8: 50,
            13: 4,
            14: 4,
            15: 20
        }
    },
    49: {
        "id": 49,
        "slug": "exchange_box",
        "recipe": {
            8: 10
        }
    },
    50: {
        "id": 50,
        "slug": "drone_hub",
        "recipe": {
            8: 1,
            13: 1
        }
    },
    51: {
        "id": 51,
        "slug": "tank",
        "recipe": {
            11: 100,
            13: 80,
            15: 20,
            18: 10,
            19: 100
        }
    },
    52: {
        "id": 52,
        "slug": "mag_plasma_tank",
        "recipe": {
            13: 4,
            15: 20,
            20: 10,
            21: 10
        }
    },
    53: {
        "id": 53,
        "slug": "landing_pad",
        "recipe": {
            13: 8,
            15: 40
        }
    },
    54: {
        "id": 54,
        "slug": "space_shipyard",
        "recipe": {
            13: 30,
            14: 12,
            15: 90
        }
    },
    55: {
        "id": 55,
        "slug": "xenic_farm",
        "recipe": {
            13: 10,
            14: 10,
            15: 50,
            18: 4,
            19: 60
        }
    },
    56: {
        "id": 56,
        "slug": "fuel_plant",
        "recipe": {
            5: 10,
            13: 1,
            14: 5,
            15: 5
        }
    },
    57: {
        "id": 57,
        "slug": "battery_cluster",
        "recipe": {
            7: 4,
            13: 4,
            14: 4,
            22: 100
        }
    },
    58: {
        "id": 58,
        "slug": "liquid_extractor",
        "recipe": {
            13: 40,
            14: 4,
            15: 10,
            18: 20,
            19: 80
        }
    },
    59: {
        "id": 59,
        "slug": "packaging_plant",
        "recipe": {
            13: 10,
            15: 5,
            18: 1,
            19: 10,
            23: 5
        }
    },
    60: {
        "id": 60,
        "slug": "factory",
        "recipe": {
            5: 10,
            6: 10,
            13: 40,
            14: 40,
            15: 200,
            27: 4
        }
    },
    61: {
        "id": 61,
        "slug": "hyperlens",
        "recipe": {
            3: 6,
            32: 3,
            34: 3,
            36: 4,
            38: 12
        }
    },
    62: {
        "id": 62,
        "slug": "alu_ingot",
        "isResource": true
    },
    63: {
        "id": 63,
        "slug": "steel_ingot",
        "isPrimitive": true
    },
    64: {
        "id": 64,
        "slug": "carbon",
        "isResource": true
    },
    65: {
        "id": 65,
        "slug": "silicate",
        "isResource": true
    }
};