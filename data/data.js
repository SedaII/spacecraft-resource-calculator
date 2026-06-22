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
        "stackQty": 3,
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
        "stackQty": 16,
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
        "stackQty": 7,
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
    },
    69: {
        "id": 69,
        "slug": "basic_central_generator",
        "stackProduced": false,
        "stackQty": 1,
    },
    70: {
        "id": 70,
        "slug": "basic_deployment_kit",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            69: 1,
            13: 4,
            8: 20,
            12: 20,
            15: 20
        }
    },
    71: {
        "id": 71,
        "slug": "simple_command_center",
        "stackProduced": false,
        "stackQty": 1,
        "recipe": {
            70: 1
        }
    },
    150: { "id": 150, "slug": "kaolinite", "isResource": true },
    151: { "id": 151, "slug": "alu_k_ingot", "isResource": true },
    152: { "id": 152, "slug": "aluminum_ore", "isResource": true },
    153: { "id": 153, "slug": "emerald", "isResource": true },
    154: { "id": 154, "slug": "aluminum_nugget", "isResource": true },
    155: { "id": 155, "slug": "titanium_b_ingot", "isResource": true },
    156: { "id": 156, "slug": "quartz_powder", "isResource": true },
    157: { "id": 157, "slug": "copper_ore", "isResource": true },
    158: { "id": 158, "slug": "azurite", "isResource": true },
    159: { "id": 159, "slug": "malachite", "isResource": true },
    160: { "id": 160, "slug": "copper_nugget", "isResource": true },
    161: { "id": 161, "slug": "elmerium_nugget", "isResource": true },
    162: { "id": 162, "slug": "elmerium_dust", "isResource": true },
    163: { "id": 163, "slug": "iron_ore", "isResource": true },
    164: { "id": 164, "slug": "hematite", "isResource": true },
    165: { "id": 165, "slug": "iron_nugget", "isResource": true },
    166: { "id": 166, "slug": "lime", "isResource": true },
    167: { "id": 167, "slug": "platinum_ore", "isResource": true },
    168: { "id": 168, "slug": "platinum_ingot", "isResource": true },
    169: { "id": 169, "slug": "platinum_nugget", "isResource": true },
    170: { "id": 170, "slug": "aquamarine", "isResource": true },
    171: { "id": 171, "slug": "silver_nugget", "isResource": true },
    172: { "id": 172, "slug": "silver_ingot", "isResource": true },
    173: { "id": 173, "slug": "sulfur", "isResource": true },
    174: { "id": 174, "slug": "titanium_ore", "isResource": true },
    175: { "id": 175, "slug": "titanium_nugget", "isResource": true },
    176: { "id": 176, "slug": "tungsten_ore", "isResource": true },
    177: { "id": 177, "slug": "tungsten_ingot", "isResource": true },
    178: { "id": 178, "slug": "tungsten_nugget", "isResource": true },
    179: { "id": 179, "slug": "rigidum_ingot", "isResource": true },
    180: { "id": 180, "slug": "vanadium_ore", "isResource": true },
    181: { "id": 181, "slug": "zirconium_ore", "isResource": true },
    182: { "id": 182, "slug": "zirconium_ingot", "isResource": true },
    183: { "id": 183, "slug": "zirconium_nugget", "isResource": true },
    184: { "id": 184, "slug": "thermal_plate", "isResource": false, "stackProduced": true, "stackQty": 2 },
    185: { "id": 185, "slug": "thermal_wool", "isResource": false, "stackProduced": true, "stackQty": 3 },
    186: { "id": 186, "slug": "wiring_harness", "isResource": false, "stackProduced": false, "stackQty": 1 },
    187: { "id": 187, "slug": "solid_explosive", "isResource": false, "stackProduced": true, "stackQty": 5 },
    188: { "id": 188, "slug": "diffraction_grid", "isResource": false, "stackProduced": true, "stackQty": 5 },
    189: { "id": 189, "slug": "small_steel_casing", "isResource": false, "stackProduced": false, "stackQty": 1 }

};

for (const id in ITEMS) {
    const item = ITEMS[id];
    if (item.isResource && !item.hasOwnProperty('stackProduced')) {
        item.stackProduced = false;
        item.stackQty = 1;
    }
}