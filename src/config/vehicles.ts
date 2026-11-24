import type { VehicleDefinition, VehicleId, VehicleSelection } from '../types/configurator'

export const VEHICLES: VehicleDefinition[] = [
  {
    id: 'mclaren-p1',
    brand: 'McLaren',
    name: 'P1 Hybrid Coupe',
    year: 2026,
    category: { en: 'Hypercar', es: 'Hiperdeportivo' },
    tagline: {
      en: 'Carbon MonoCage chassis with active aerodynamics',
      es: 'Chasis MonoCage de carbono con aerodinámica activa',
    },
    basePrice: 1150000,
    modelUrl: '/models/mclaren-p1.glb',
    targetLength: 4.59,
    specs: {
      power: '903 hp',
      weight: '1,395 kg',
      drivetrain: 'RWD Hybrid',
      layout: { en: 'Mid-engine V8 Twin-Turbo', es: 'V8 Biturbo central' },
    },
    attribution: {
      author: 'Animase',
      modelTitle: 'AC - McLaren P1 [FREE]',
      sourceUrl:
        'https://sketchfab.com/3d-models/ac-mclaren-p1-free-747cedadc302451db61deafc85941395',
    },
    materialSlots: {
      body: ['=Carpaint'],
      interiorPrimary: ['=INT_Skin_A', '=INT_Velvet'],
      interiorAccent: ['=INT_Cuciture', '=IN_Cinture', '=INT_METAL_Aluminium'],
      wheels: ['@rim-node'],
      calipers: ['=Brake_Caliper'],
    },
    cameras: {
      hero: { position: [4.55, 1.48, 4.75], target: [0, 0.56, 0], fov: 35 },
      front: { position: [0.1, 1.08, 5.15], target: [0, 0.54, 0.15], fov: 34 },
      side: { position: [6.9, 1.05, 0.0], target: [0, 0.56, 0], fov: 32 },
      rear: { position: [-3.8, 1.42, -4.45], target: [0, 0.56, -0.15], fov: 35 },
      wheels: { position: [-2.25, 0.56, 1.6], target: [-0.82, 0.34, 1.2], fov: 30 },
      // Positioned cleanly ahead of the seatbelt strap looking directly at steering wheel & center display
      interior: { position: [0.18, 0.85, -0.02], target: [0.12, 0.68, 0.72], fov: 58 },
    },
    paints: [
      {
        id: 'volcano-orange',
        name: { en: 'Volcano Orange', es: 'Naranja Volcán' },
        hex: '#e8530e',
        finish: 'metallic',
        price: 12400,
      },
      {
        id: 'silica-white',
        name: { en: 'Silica White', es: 'Blanco Sílice' },
        hex: '#f2f3f5',
        finish: 'solid',
        price: 0,
      },
      {
        id: 'volcano-yellow',
        name: { en: 'Volcano Yellow', es: 'Amarillo Volcán' },
        hex: '#eab308',
        finish: 'metallic',
        price: 11800,
      },
      {
        id: 'amethyst-black',
        name: { en: 'MSO Amethyst Black', es: 'Negro Amatista MSO' },
        hex: '#1c1824',
        finish: 'metallic',
        price: 14500,
      },
      {
        id: 'cerulean-blue',
        name: { en: 'Cerulean Blue', es: 'Azul Cerúleo' },
        hex: '#1769aa',
        finish: 'metallic',
        price: 9600,
      },
      {
        id: 'stealth-graphite',
        name: { en: 'Satin Stealth Graphite', es: 'Grafito Mate Sigilo' },
        hex: '#363b42',
        finish: 'matte',
        price: 16800,
      },
      {
        id: 'frozen-crimson',
        name: { en: 'Matte Crimson Red', es: 'Rojo Carmesí Mate' },
        hex: '#991b1b',
        finish: 'matte',
        price: 17200,
      },
    ],
    interiors: [
      {
        id: 'carbon-black',
        name: { en: 'Carbon Black Alcantara', es: 'Alcántara Negro Carbono' },
        primaryHex: '#252830',
        accentHex: '#64748b',
        dashHex: '#17191d',
        materialType: 'carbon',
        price: 0,
      },
      {
        id: 'papaya-stitch',
        name: { en: 'Jet Alcantara & Papaya', es: 'Alcántara Negro y Papaya' },
        primaryHex: '#23262c',
        accentHex: '#f97316',
        dashHex: '#181a1e',
        materialType: 'alcantara',
        price: 6800,
      },
      {
        id: 'saddle-tan',
        name: { en: 'Saddle Tan Leather', es: 'Piel Tabaco Artesanal' },
        primaryHex: '#a1683a',
        accentHex: '#e0a96d',
        dashHex: '#271e19',
        materialType: 'leather',
        price: 9400,
      },
      {
        id: 'arctic-stone',
        name: { en: 'Dove Grey & Racing Red', es: 'Gris Perla y Rojo Pista' },
        primaryHex: '#c4c8d0',
        accentHex: '#c8102e',
        dashHex: '#23262c',
        materialType: 'leather',
        price: 8900,
      },
    ],
    wheels: [
      {
        id: 'stealth-forged',
        name: { en: 'Stealth Forged 10-Spoke', es: 'Forjados Sigilo 10 Brazos' },
        hex: '#2b2f36',
        finish: 'satin',
        spokeStyle: 'split5',
        price: 0,
      },
      {
        id: 'silver-machined',
        name: { en: 'Diamond-Cut Alloy', es: 'Aleación Corte Diamante' },
        hex: '#cfd5de',
        finish: 'machined',
        spokeStyle: 'split5',
        price: 4200,
      },
      {
        id: 'bronze-track',
        name: { en: 'Satin Motorsport Bronze', es: 'Bronce Motorsport Satinado' },
        hex: '#9c7e54',
        finish: 'satin',
        spokeStyle: 'mesh',
        price: 5600,
      },
    ],
    calipers: [
      { id: 'cal-orange', name: { en: 'McLaren Orange', es: 'Naranja McLaren' }, hex: '#f97316', price: 0 },
      { id: 'cal-red', name: { en: 'Track Red', es: 'Rojo Pista' }, hex: '#c8102e', price: 1400 },
      { id: 'cal-yellow', name: { en: 'Carbon Ceramic Yellow', es: 'Amarillo Cerámico' }, hex: '#eab308', price: 1400 },
      { id: 'cal-silver', name: { en: 'Polished Silver', es: 'Plata Pulido' }, hex: '#cbd5e1', price: 950 },
    ],
    accessories: [
      {
        id: 'active-wing',
        name: { en: 'Active Rear Wing (Track Mode)', es: 'Alerón Trasero Activo (Modo Pista)' },
        description: {
          en: 'Hydraulically raises the McLaren P1 rear aero wing into Track Mode.',
          es: 'Eleva hidráulicamente el alerón trasero real del P1 a posición de pista.',
        },
        price: 14500,
        proceduralId: 'mclaren-wing-deploy',
        defaultEnabled: true,
      },
    ],
  },
  {
    id: 'lotus-exige-240',
    brand: 'Lotus',
    name: 'Exige S 240',
    year: 2025,
    category: { en: 'Track Coupe', es: 'Coupé de Pista' },
    tagline: {
      en: 'Featherweight bonded-aluminum sports car built for apex precision',
      es: 'Deportivo ultraligero de aluminio diseñado para máxima precisión',
    },
    basePrice: 89500,
    modelUrl: '/models/lotus-exige-240.glb',
    targetLength: 3.8,
    specs: {
      power: '240 hp',
      weight: '935 kg',
      drivetrain: 'RWD 6-MT',
      layout: { en: 'Mid-engine Supercharged I4', es: '4 cil. Supercargado central' },
    },
    attribution: {
      author: 'Animase',
      modelTitle: 'AC - Lotus Exige 240 [FREE]',
      sourceUrl:
        'https://sketchfab.com/3d-models/ac-lotus-exige-240-free-a770a08d0c17446cbec7721f3dd1ede7',
    },
    materialSlots: {
      body: ['=CAR_chassis.5'],
      interiorPrimary: ['=INT_soft_leather_Skinned', '=INT_velvet_black'],
      interiorAccent: ['=INT_seams.1', '=INT_belt', '=INT_white_plastic.2'],
      wheels: ['=CAR_RIM.3'],
      calipers: ['=CAR_mechanics_AT.4'],
    },
    cameras: {
      hero: { position: [3.95, 1.38, 4.2], target: [0, 0.52, 0], fov: 35 },
      front: { position: [0.1, 1.02, 4.55], target: [0, 0.52, 0.15], fov: 34 },
      side: { position: [6.0, 0.98, 0.0], target: [0, 0.52, 0], fov: 32 },
      rear: { position: [-3.4, 1.32, -3.9], target: [0, 0.54, -0.15], fov: 35 },
      wheels: { position: [-1.95, 0.52, 1.4], target: [-0.74, 0.31, 1.12], fov: 30 },
      // Calibrated directly to STEER_HR [0.25, 0.65, 0.25] inside Lotus Exige cockpit
      interior: { position: [0.18, 0.8, -0.18], target: [0.14, 0.64, 0.52], fov: 58 },
    },
    paints: [
      {
        id: 'aspen-white',
        name: { en: 'Aspen White', es: 'Blanco Aspen' },
        hex: '#f4f5f7',
        finish: 'solid',
        price: 0,
      },
      {
        id: 'racing-green',
        name: { en: 'British Racing Green', es: 'Verde Británico de Carreras' },
        hex: '#114232',
        finish: 'metallic',
        price: 2200,
      },
      {
        id: 'solar-yellow',
        name: { en: 'Solar Yellow', es: 'Amarillo Solar' },
        hex: '#facc15',
        finish: 'solid',
        price: 1650,
      },
      {
        id: 'ardent-red',
        name: { en: 'Ardent Red', es: 'Rojo Ardiente' },
        hex: '#b91c1c',
        finish: 'metallic',
        price: 2100,
      },
      {
        id: 'laser-blue',
        name: { en: 'Laser Blue Metallic', es: 'Azul Láser Metálico' },
        hex: '#1d4ed8',
        finish: 'metallic',
        price: 2400,
      },
      {
        id: 'matte-titanium',
        name: { en: 'Satin Titanium Grey', es: 'Gris Titanio Mate' },
        hex: '#4b5563',
        finish: 'matte',
        price: 3400,
      },
    ],
    interiors: [
      {
        id: 'probax-black',
        name: { en: 'Probax Black Alcantara', es: 'Alcántara Probax Negro' },
        primaryHex: '#252830',
        accentHex: '#eab308',
        dashHex: '#181a1f',
        materialType: 'alcantara',
        price: 0,
      },
      {
        id: 'venom-red',
        name: { en: 'Venom Red & Charcoal', es: 'Rojo Veneno y Carbón' },
        primaryHex: '#8c2222',
        accentHex: '#dc2626',
        dashHex: '#1c1e24',
        materialType: 'leather',
        price: 2400,
      },
      {
        id: 'cognac-club',
        name: { en: 'Cognac Club Leather', es: 'Piel Club Coñac' },
        primaryHex: '#9c633b',
        accentHex: '#d4a373',
        dashHex: '#251f1c',
        materialType: 'leather',
        price: 2800,
      },
    ],
    wheels: [
      {
        id: 'track-black',
        name: { en: 'Motorsport Satin Black', es: 'Negro Satinado Motorsport' },
        hex: '#22252b',
        finish: 'satin',
        spokeStyle: 'mesh',
        price: 0,
      },
      {
        id: 'heritage-gold',
        name: { en: 'Heritage Gold Forged', es: 'Dorado Clásico Forjado' },
        hex: '#b59449',
        finish: 'gloss',
        spokeStyle: 'mesh',
        price: 1900,
      },
      {
        id: 'silver-light',
        name: { en: 'Lightweight Alloy Silver', es: 'Plata Aleación Ligera' },
        hex: '#d1d5db',
        finish: 'machined',
        spokeStyle: 'split5',
        price: 1200,
      },
    ],
    calipers: [
      { id: 'lotus-red', name: { en: 'AP Racing Red', es: 'Rojo AP Racing' }, hex: '#c8102e', price: 0 },
      { id: 'lotus-yellow', name: { en: 'Track Yellow', es: 'Amarillo Pista' }, hex: '#eab308', price: 650 },
      { id: 'lotus-silver', name: { en: 'Raw Billet Silver', es: 'Aluminio Billet' }, hex: '#cbd5e1', price: 400 },
    ],
    accessories: [
      {
        id: 'gt-wing',
        name: { en: 'Cup 240 Rear Wing', es: 'Alerón Trasero Cup 240' },
        description: {
          en: 'Toggles the factory Exige 240 high-downforce rear wing.',
          es: 'Activa o retira el alerón trasero deportivo original del Exige 240.',
        },
        price: 2850,
        meshNames: ['WING'],
        proceduralId: 'rear-wing',
        defaultEnabled: true,
      },
    ],
  },
  {
    id: 'honda-acty-ha3',
    brand: 'Honda',
    name: 'Acty HA3 Utility',
    year: 1994,
    category: { en: 'Modular Kei Truck', es: 'Utilitario Modular' },
    tagline: {
      en: 'Compact Japanese flatbed utility platform with modular bed equipment',
      es: 'Camioneta utilitaria japonesa con plataforma trasera modular',
    },
    basePrice: 14800,
    modelUrl: '/models/honda-acty-ha3.glb',
    targetLength: 3.3,
    specs: {
      power: '38 hp',
      weight: '710 kg',
      drivetrain: 'MR / 4WD',
      layout: { en: 'Mid-engine 656cc I3', es: '3 cil. 656cc central' },
    },
    attribution: {
      author: 'Animase',
      modelTitle: 'AC - Honda Acty Ha3 [FREE]',
      sourceUrl:
        'https://sketchfab.com/3d-models/ac-honda-acty-ha3-free-58e7efac08a54a2b9a163bf194cb2a5c',
    },
    materialSlots: {
      body: ['=MAINBODY.4'],
      interiorPrimary: ['=MAINBODY_INT_SHEET02.2', '=MAINBODY_INT2.7_0'],
      interiorAccent: ['=BELT', '=BELT_0', '=MAINBODY_DASH.7'],
      wheels: ['=RIM.1'],
      calipers: ['=BRK.3'],
    },
    cameras: {
      hero: { position: [3.95, 1.65, 4.15], target: [0, 0.78, -0.05], fov: 36 },
      front: { position: [0.15, 1.2, 4.45], target: [0, 0.78, 0.2], fov: 35 },
      side: { position: [5.6, 1.12, 0.0], target: [0, 0.78, 0], fov: 33 },
      rear: { position: [-3.4, 1.72, -3.6], target: [0, 0.82, -0.35], fov: 37 },
      wheels: { position: [-1.85, 0.52, 1.22], target: [-0.64, 0.26, 0.82], fov: 32 },
      // Calibrated directly to RHD STEER_HR [-0.32, 1.05, 1.02] inside Honda Acty cabin
      interior: { position: [-0.28, 1.22, 0.44], target: [-0.24, 1.02, 1.28], fov: 60 },
    },
    paints: [
      {
        id: 'taffeta-white',
        name: { en: 'Taffeta White', es: 'Blanco Tafetán' },
        hex: '#f3f4f6',
        finish: 'solid',
        price: 0,
      },
      {
        id: 'bay-blue',
        name: { en: 'Kei Utility Blue', es: 'Azul Utilitario Kei' },
        hex: '#3b6ea5',
        finish: 'solid',
        price: 650,
      },
      {
        id: 'forest-olive',
        name: { en: 'Overland Olive', es: 'Verde Expedición' },
        hex: '#4a5d43',
        finish: 'matte',
        price: 1150,
      },
      {
        id: 'signal-amber',
        name: { en: 'Worksite Amber', es: 'Ámbar Industrial' },
        hex: '#d97706',
        finish: 'solid',
        price: 850,
      },
      {
        id: 'champagne-silver',
        name: { en: 'Metallic Steel Silver', es: 'Plata Acero Metálico' },
        hex: '#9ca3af',
        finish: 'metallic',
        price: 900,
      },
      {
        id: 'matte-charcoal',
        name: { en: 'Matte Utility Charcoal', es: 'Carbón Mate Utilitario' },
        hex: '#2e3238',
        finish: 'matte',
        price: 1200,
      },
    ],
    interiors: [
      {
        id: 'oem-grey',
        name: { en: 'OEM Charcoal Cloth', es: 'Tela Carbón Original' },
        primaryHex: '#5b626e',
        accentHex: '#6b7280',
        dashHex: '#2f343c',
        materialType: 'alcantara',
        price: 0,
      },
      {
        id: 'saddle-vinyl',
        name: { en: 'Heavy-Duty Tan Vinyl', es: 'Vinil Rudo Arena' },
        primaryHex: '#9a7552',
        accentHex: '#b8946e',
        dashHex: '#352e29',
        materialType: 'leather',
        price: 550,
      },
      {
        id: 'dark-work',
        name: { en: 'Obsidian Work Trim', es: 'Acabado Obsidiana Rudo' },
        primaryHex: '#2a2e36',
        accentHex: '#d97706',
        dashHex: '#181a1e',
        materialType: 'leather',
        price: 720,
      },
    ],
    wheels: [
      {
        id: 'oem-steel',
        name: { en: '12" OEM Silver Steel', es: 'Acero Plata 12" OEM' },
        hex: '#c8cdd5',
        finish: 'gloss',
        spokeStyle: 'steel',
        price: 0,
      },
      {
        id: 'offroad-black',
        name: { en: 'Matte Black Beadlock', es: 'Beadlock Negro Mate' },
        hex: '#262a31',
        finish: 'satin',
        spokeStyle: 'steel',
        price: 680,
      },
      {
        id: 'rally-white',
        name: { en: 'Rally White Alloy', es: 'Aleación Blanco Rally' },
        hex: '#f1f3f6',
        finish: 'gloss',
        spokeStyle: 'split5',
        price: 890,
      },
    ],
    calipers: [
      { id: 'acty-steel', name: { en: 'Raw Cast Steel', es: 'Acero Fundido' }, hex: '#64748b', price: 0 },
      { id: 'acty-red', name: { en: 'Honda Red', es: 'Rojo Honda' }, hex: '#c8102e', price: 320 },
      { id: 'acty-amber', name: { en: 'Safety Amber', es: 'Ámbar Seguridad' }, hex: '#ea580c', price: 320 },
    ],
    accessories: [
      {
        id: 'bed-rack',
        name: { en: 'Tubular Steel Cargo Rack', es: 'Rack Tubular de Carga en Acero' },
        description: {
          en: 'Powder-coated ladder and lumber rack mounted over the flatbed.',
          es: 'Estructura tubular reforzada para escaleras y carga larga.',
        },
        price: 1250,
        proceduralId: 'bed-rack',
        defaultEnabled: false,
      },
      {
        id: 'bed-toolbox',
        name: { en: 'Aluminum Bed Toolbox', es: 'Caja de Herramientas de Aluminio' },
        description: {
          en: 'Lockable weather-sealed diamond-plate cargo toolbox.',
          es: 'Caja hermética con chapa de aluminio antiderrapante.',
        },
        price: 690,
        proceduralId: 'bed-toolbox',
        defaultEnabled: false,
      },
      {
        id: 'bed-tonneau',
        name: { en: 'Soft Roll-Up Tonneau Cover', es: 'Lona Cubre-Caja Enrollable' },
        description: {
          en: 'All-weather matte cargo cover protecting the rear bed.',
          es: 'Cubierta impermeable mate para proteger la caja trasera.',
        },
        price: 480,
        proceduralId: 'bed-tonneau',
      },
      {
        id: 'roof-lightbar',
        name: { en: 'LED Work Lightbar', es: 'Barra LED de Trabajo' },
        description: {
          en: 'High-output cab-mounted LED bar for jobsite & night trails.',
          es: 'Barra LED superior de alta potencia para trabajo nocturno.',
        },
        price: 390,
        proceduralId: 'roof-lightbar',
      },
    ],
  },
]

export function getVehicleById(id: VehicleId): VehicleDefinition {
  return VEHICLES.find((v) => v.id === id) ?? VEHICLES[0]
}

export function createDefaultSelection(vehicle: VehicleDefinition): VehicleSelection {
  return {
    paintId: vehicle.paints[0].id,
    interiorId: vehicle.interiors[0].id,
    wheelId: vehicle.wheels[0].id,
    caliperId: vehicle.calipers[0].id,
    accessoryIds: vehicle.accessories.filter((a) => a.defaultEnabled).map((a) => a.id),
  }
}

export function calculateTotalPrice(vehicle: VehicleDefinition, selection: VehicleSelection): number {
  const paint = vehicle.paints.find((p) => p.id === selection.paintId)
  const interior = vehicle.interiors.find((i) => i.id === selection.interiorId)
  const wheel = vehicle.wheels.find((w) => w.id === selection.wheelId)
  const caliper = vehicle.calipers.find((c) => c.id === selection.caliperId)
  const accessoriesTotal = vehicle.accessories
    .filter((a) => selection.accessoryIds.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)

  return (
    vehicle.basePrice +
    (paint?.price ?? 0) +
    (interior?.price ?? 0) +
    (wheel?.price ?? 0) +
    (caliper?.price ?? 0) +
    accessoriesTotal
  )
}
