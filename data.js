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
    65: "Silicate",
    66: "Noyau d'elmérium",
    67: "Lingot de titane",
    68: "Huile xénique"
};

// Base de données des objets : Regroupe le type et la recette
const ITEMS = {
    1: {
        "id": 1,
        "slug": "iron_ingot",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    2: {
        "id": 2,
        "slug": "copper_ingot",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    3: {
        "id": 3,
        "slug": "silicon_ingot",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    4: {
        "id": 4,
        "slug": "drone",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            5: 1,
            6: 1,
            8: 1,
            9: 6
        }
    },
    5: {
        "id": 5,
        "slug": "motor",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            7: 5,
            8: 1,
            11: 5
        }
    },
    6: {
        "id": 6,
        "slug": "microchip",
        "stackProduced": true,
        "stackQty": 2,
        "recipe": {
            10: 1
        }
    },
    7: {
        "id": 7,
        "slug": "magnetic_coil",
        "stackProduced": true,
        "stackQty": 2,
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
        "stackProduced": true,
        "stackQty": 2,
        "recipe": {
            1: 1
        }
    },
    9: {
        "id": 9,
        "slug": "nut_and_bolt",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 8,
        "recipe": {
            1: 1
        }
    },
    10: {
        "id": 10,
        "slug": "semiconductor_substrate",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 4,
        "recipe": {
            3: 1
        }
    },
    11: {
        "id": 11,
        "slug": "silicone_gel",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 20,
        "recipe": {
            3: 1
        }
    },
    12: {
        "id": 12,
        "slug": "electric_wire",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 4,
        "recipe": {
            2: 1
        }
    },
    13: {
        "id": 13,
        "slug": "stainless_steel_plate",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 2,
        "recipe": {
            2: 1,
            62: 2
        }
    },
    14: {
        "id": 14,
        "slug": "structural_beam",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            63: 2
        }
    },
    15: {
        "id": 15,
        "slug": "concrete",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 5,
        "recipe": {
            65: 2
        }
    },
    16: {
        "id": 16,
        "slug": "photovoltaic_cell",
        "stackProduced": true,
        "stackQty": 5,
        "recipe": {
            10: 1,
            12: 5,
            13: 1
        }
    },
    17: {
        "id": 17,
        "slug": "calcite",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    18: {
        "id": 18,
        "slug": "pump",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            5: 1,
            19: 2,
            23: 3
        }
    },
    19: {
        "id": 19,
        "slug": "watertight_pipe",
        "stackProduced": true,
        "stackQty": 2,
        "recipe": {
            2: 1
        }
    },
    20: {
        "id": 20,
        "slug": "confinement_chamber",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            7: 4,
            21: 15
        }
    },
    21: {
        "id": 21,
        "slug": "monomagnetic_plate",
        "stackProduced": true,
        "stackQty": 3,
        "recipe": {
            1: 1,
            29: 1,
            66: 1
        }
    },
    22: {
        "id": 22,
        "slug": "chemical_battery",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 1,
            24: 20,
            25: 1,
            26: 1
        }
    },
    23: {
        "id": 23,
        "slug": "heavy_metal_plate",
        "stackProduced": true,
        "stackQty": 2,
        "recipe": {
            1: 1,
            67: 1
        }
    },
    24: {
        "id": 24,
        "slug": "sulfuric_acid",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    25: {
        "id": 25,
        "slug": "graphite_crystal",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    26: {
        "id": 26,
        "slug": "vanadium_ingot",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    27: {
        "id": 27,
        "slug": "hydraulic_actuator",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 3,
            19: 5,
            68: 50
        }
    },
    28: {
        "id": 28,
        "slug": "small_modular_kit",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            9: 20,
            12: 10
        }
    },
    29: {
        "id": 29,
        "slug": "graphene",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 4,
        "recipe": {
            25: 1
        }
    },
    30: {
        "id": 30,
        "slug": "modular_kit",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            23: 20,
            28: 4,
            29: 20
        }
    },
    31: {
        "id": 31,
        "slug": "quartz",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    32: {
        "id": 32,
        "slug": "crystal_focuser",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            12: 5,
            31: 1
        }
    },
    33: {
        "id": 33,
        "slug": "pyrite",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    34: {
        "id": 34,
        "slug": "crystal_matrix_c",
        "isPrimitive": true,
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            33: 1
        }
    },
    35: {
        "id": 35,
        "slug": "azurite_malachite",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    36: {
        "id": 36,
        "slug": "crystal_matrix_m",
        "isPrimitive": true,
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            35: 1
        }
    },
    37: {
        "id": 37,
        "slug": "hematite_quartz_ore",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    38: {
        "id": 38,
        "slug": "crystal_matrix_h",
        "isPrimitive": true,
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            37: 1
        }
    },
    39: {
        "id": 39,
        "slug": "command_tower",
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            5: 1,
            15: 4
        }
    },
    41: {
        "id": 41,
        "slug": "solar_plant",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 9,
            14: 1,
            16: 36
        }
    },
    42: {
        "id": 42,
        "slug": "pylon",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            7: 1
        }
    },
    43: {
        "id": 43,
        "slug": "foundry",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 1,
            15: 10
        }
    },
    44: {
        "id": 44,
        "slug": "micro_furnace",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 2,
            15: 5,
            17: 1
        }
    },
    45: {
        "id": 45,
        "slug": "assembler",
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 10,
            14: 2,
            15: 10,
            19: 10
        }
    },
    48: {
        "id": 48,
        "slug": "warehouse",
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            8: 10
        }
    },
    50: {
        "id": 50,
        "slug": "drone_hub",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            8: 1,
            13: 1
        }
    },
    51: {
        "id": 51,
        "slug": "tank",
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 8,
            15: 40
        }
    },
    54: {
        "id": 54,
        "slug": "space_shipyard",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            13: 30,
            14: 12,
            15: 90
        }
    },
    55: {
        "id": 55,
        "slug": "xenic_farm",
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "stackProduced": false,
        "stackQty": 1,
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
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    63: {
        "id": 63,
        "slug": "steel_ingot",
        "isPrimitive": true,
        "stackProduced": true,
        "stackQty": 3,
        "recipe": {
            1: 4,
            64: 4
        }
    },
    64: {
        "id": 64,
        "slug": "carbon",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    65: {
        "id": 65,
        "slug": "silicate",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    66: {
        "id": 66,
        "slug": "elmerium_core",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    67: {
        "id": 67,
        "slug": "titanium_ingot",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    },
    68: {
        "id": 68,
        "slug": "xenic_oil",
        "isResource": true,
        "stackProduced": false,
        "stackQty": 1
    }
};