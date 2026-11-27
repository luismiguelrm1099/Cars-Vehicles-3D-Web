import type { Language } from '../types/configurator'

export interface Translations {
  brandName: string
  brandSubtitle: string
  madeBy: string
  menuLabel: string
  menu: {
    models: string
    configurator: string
    environments: string
    language: string
    close: string
    configureNow: string
    backToHome: string
  }
  landing: {
    heroTitleLine1: string
    heroTitleLine2: string
    heroCta: string
    heroSecondaryCta: string
    pauseMotion: string
    playMotion: string
    cursorHint: string
    showcaseHeading: string
    configureModel: string
    startingFrom: string
    studioHeading: string
    studioBody: string
    studioCta: string
    featureExterior: string
    featureInterior: string
    featureModular: string
    featureRealtime: string
    footerNote: string
  }
  steps: {
    exterior: string
    interior: string
    extras: string
    summary: string
  }
  cameras: {
    hero: string
    front: string
    side: string
    rear: string
    wheels: string
    interior: string
  }
  viewToggle: {
    switchToInterior: string
    switchToExterior: string
    interiorLabel: string
    exteriorLabel: string
  }
  themes: {
    agency: string
    light: string
    dark: string
  }
  finishes: {
    all: string
    solid: string
    metallic: string
    matte: string
  }
  interiorTypes: {
    leather: string
    alcantara: string
    carbon: string
  }
  sidebar: {
    exteriorTitle: string
    exteriorSubtitle: string
    interiorTitle: string
    interiorSubtitle: string
    extrasTitle: string
    extrasSubtitle: string
    wheelsSection: string
    calipersSection: string
    accessoriesSection: string
    included: string
    selected: string
    enterCabinHint: string
    shareBuild: string
    linkCopied: string
    finishBuild: string
    resetVehicle: string
  }
  topbar: {
    totalAsBuilt: string
    baseVehicle: string
    selectedOptions: string
    closeBreakdown: string
    vehicleSpecs: string
  }
  viewport: {
    autoRotate: string
    takeSnapshot: string
    modelTools: string
    resetLocalModel: string
    loadLocalGlb: string
    usingLocalGlb: string
    usingProceduralPreview: string
    usingOptimizedGlb: string
    inspectorMode: string
    dragHint: string
    loadingModel: string
  }
  summary: {
    title: string
    subtitle: string
    downloadImage: string
    copyShareLink: string
    backToEdit: string
    basePrice: string
    exteriorPaint: string
    interiorTrim: string
    wheels: string
    brakeCalipers: string
    accessories: string
    noAccessories: string
    totalEstimated: string
    disclaimer: string
    modelCredit: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'Progress Digital',
    brandSubtitle: 'Cars Showroom',
    madeBy: 'Website crafted by',
    menuLabel: 'Menu',
    menu: {
      models: 'Models',
      configurator: '3D Configurator',
      environments: 'Showroom lighting',
      language: 'Language',
      close: 'Close menu',
      configureNow: 'Configure in 3D',
      backToHome: 'Showroom Home',
    },
    landing: {
      heroTitleLine1: 'Three icons',
      heroTitleLine2: 'Real-time 3D',
      heroCta: 'Enter 3D Showroom',
      heroSecondaryCta: 'Explore models',
      pauseMotion: 'Pause particle motion',
      playMotion: 'Play particle motion',
      cursorHint: 'Move cursor across the silhouette',
      showcaseHeading: 'Select a vehicle to configure',
      configureModel: 'Configure in 3D',
      startingFrom: 'From',
      studioHeading: 'Engineered for commercial realism',
      studioBody:
        'Explore calibrated automotive clearcoat finishes, supple interior materials, 360° cabin views, and modular vehicle equipment directly in the browser.',
      studioCta: 'Launch Configurator',
      featureExterior: 'Calibrated PBR Paint',
      featureInterior: '360° Cabin Inspection',
      featureModular: 'Modular Equipment',
      featureRealtime: 'Real-time WebGL',
      footerNote:
        'Interactive 3D portfolio showcase built with Three.js & React Three Fiber.',
    },
    steps: {
      exterior: 'Exterior',
      interior: 'Interior',
      extras: 'Wheels & Extras',
      summary: 'Summary',
    },
    cameras: {
      hero: '3/4 View',
      front: 'Front',
      side: 'Profile',
      rear: 'Rear',
      wheels: 'Wheels',
      interior: 'Cabin',
    },
    viewToggle: {
      switchToInterior: 'Interior view',
      switchToExterior: 'Exterior view',
      interiorLabel: 'Cabin',
      exteriorLabel: 'Exterior',
    },
    themes: {
      agency: 'Agency',
      light: 'Light Studio',
      dark: 'Midnight',
    },
    finishes: {
      all: 'All',
      solid: 'Solid',
      metallic: 'Metallic',
      matte: 'Matte',
    },
    interiorTypes: {
      leather: 'Full Leather',
      alcantara: 'Alcantara',
      carbon: 'Carbon & Alcantara',
    },
    sidebar: {
      exteriorTitle: 'Exterior paint',
      exteriorSubtitle: 'Select factory body color and clearcoat finish.',
      interiorTitle: 'Cabin trim',
      interiorSubtitle: 'Customize seats, upholstery, and console accents.',
      extrasTitle: 'Wheels & accessories',
      extrasSubtitle: 'Choose alloy finish, calipers, and modular equipment.',
      wheelsSection: 'Wheel finish',
      calipersSection: 'Brake calipers',
      accessoriesSection: 'Modular accessories',
      included: 'Included',
      selected: 'Selected',
      enterCabinHint: 'View inside cabin',
      shareBuild: 'Share build',
      linkCopied: 'Link copied',
      finishBuild: 'Finish build',
      resetVehicle: 'Reset options',
    },
    topbar: {
      totalAsBuilt: 'Total as built',
      baseVehicle: 'Base vehicle',
      selectedOptions: 'Selected options',
      closeBreakdown: 'Close',
      vehicleSpecs: 'Specifications',
    },
    viewport: {
      autoRotate: 'Turntable',
      takeSnapshot: 'Snapshot',
      modelTools: 'Model tools',
      resetLocalModel: 'Restore default model',
      loadLocalGlb: 'Test local .glb',
      usingLocalGlb: 'Custom .glb active',
      usingProceduralPreview: 'Interactive studio model',
      usingOptimizedGlb: 'Optimized .glb active',
      inspectorMode: 'Inspect parts',
      dragHint: 'Drag to orbit · Scroll to zoom',
      loadingModel: 'Loading 3D vehicle...',
    },
    summary: {
      title: 'Build summary',
      subtitle: 'Review your configured vehicle and export your specification.',
      downloadImage: 'Download PNG',
      copyShareLink: 'Copy share link',
      backToEdit: 'Back to configurator',
      basePrice: 'Base MSRP',
      exteriorPaint: 'Exterior paint',
      interiorTrim: 'Interior trim',
      wheels: 'Wheel finish',
      brakeCalipers: 'Brake calipers',
      accessories: 'Accessories',
      noAccessories: 'None selected',
      totalEstimated: 'Total as configured',
      disclaimer:
        'Non-commercial portfolio demonstration by Progress Digital built with real-time WebGL (Three.js & React Three Fiber).',
      modelCredit: '3D reference attribution',
    },
  },
  es: {
    brandName: 'Progress Digital',
    brandSubtitle: 'Cars Showroom',
    madeBy: 'Web desarrollada por',
    menuLabel: 'Menú',
    menu: {
      models: 'Modelos',
      configurator: 'Configurador 3D',
      environments: 'Iluminación de agencia',
      language: 'Idioma',
      close: 'Cerrar menú',
      configureNow: 'Configurar en 3D',
      backToHome: 'Inicio Showroom',
    },
    landing: {
      heroTitleLine1: 'Tres íconos',
      heroTitleLine2: '3D en tiempo real',
      heroCta: 'Entrar al Showroom 3D',
      heroSecondaryCta: 'Explorar modelos',
      pauseMotion: 'Pausar partículas',
      playMotion: 'Reanudar partículas',
      cursorHint: 'Desliza el cursor sobre la silueta',
      showcaseHeading: 'Elige un vehículo para configurar',
      configureModel: 'Configurar en 3D',
      startingFrom: 'Desde',
      studioHeading: 'Diseñado con realismo comercial',
      studioBody:
        'Explora acabados de pintura automotriz calibrados, tapicerías naturales, vista interior 360° y equipamiento modular en tiempo real desde el navegador.',
      studioCta: 'Abrir Configurador',
      featureExterior: 'Pintura PBR Calibrada',
      featureInterior: 'Cabina 360° Real',
      featureModular: 'Accesorios Modulares',
      featureRealtime: 'WebGL en Tiempo Real',
      footerNote:
        'Demostración interactiva de portafolio desarrollada en Three.js y React Three Fiber.',
    },
    steps: {
      exterior: 'Exterior',
      interior: 'Interior',
      extras: 'Rines y Extras',
      summary: 'Resumen',
    },
    cameras: {
      hero: 'Vista 3/4',
      front: 'Frente',
      side: 'Perfil',
      rear: 'Trasera',
      wheels: 'Rines',
      interior: 'Cabina',
    },
    viewToggle: {
      switchToInterior: 'Vista interior',
      switchToExterior: 'Vista exterior',
      interiorLabel: 'Cabina',
      exteriorLabel: 'Exterior',
    },
    themes: {
      agency: 'Agencia',
      light: 'Estudio Claro',
      dark: 'Nocturno',
    },
    finishes: {
      all: 'Todos',
      solid: 'Sólido',
      metallic: 'Metálico',
      matte: 'Mate',
    },
    interiorTypes: {
      leather: 'Piel Completa',
      alcantara: 'Alcántara',
      carbon: 'Carbono y Alcántara',
    },
    sidebar: {
      exteriorTitle: 'Pintura exterior',
      exteriorSubtitle: 'Elige el color de carrocería y acabado de barniz.',
      interiorTitle: 'Acabados interiores',
      interiorSubtitle: 'Personaliza asientos, tapicería y detalles del tablero.',
      extrasTitle: 'Rines y accesorios',
      extrasSubtitle: 'Selecciona acabado de rines, calipers y equipo modular.',
      wheelsSection: 'Acabado de rines',
      calipersSection: 'Calipers de freno',
      accessoriesSection: 'Accesorios modulares',
      included: 'Incluido',
      selected: 'Seleccionado',
      enterCabinHint: 'Ver dentro de cabina',
      shareBuild: 'Compartir',
      linkCopied: 'Enlace copiado',
      finishBuild: 'Finalizar',
      resetVehicle: 'Restablecer',
    },
    topbar: {
      totalAsBuilt: 'Total configurado',
      baseVehicle: 'Vehículo base',
      selectedOptions: 'Opciones elegidas',
      closeBreakdown: 'Cerrar',
      vehicleSpecs: 'Especificaciones',
    },
    viewport: {
      autoRotate: 'Girar',
      takeSnapshot: 'Captura',
      modelTools: 'Herramientas 3D',
      resetLocalModel: 'Restaurar modelo original',
      loadLocalGlb: 'Probar .glb local',
      usingLocalGlb: '.glb local activo',
      usingProceduralPreview: 'Modelo 3D interactivo',
      usingOptimizedGlb: '.glb optimizado activo',
      inspectorMode: 'Inspeccionar piezas',
      dragHint: 'Arrastra para rotar · Rueda para zoom',
      loadingModel: 'Cargando vehículo 3D...',
    },
    summary: {
      title: 'Resumen de configuración',
      subtitle: 'Revisa tu vehículo personalizado y descarga tu ficha visual.',
      downloadImage: 'Descargar PNG',
      copyShareLink: 'Copiar enlace',
      backToEdit: 'Volver al configurador',
      basePrice: 'Precio base',
      exteriorPaint: 'Pintura exterior',
      interiorTrim: 'Tapicería interior',
      wheels: 'Acabado de rines',
      brakeCalipers: 'Calipers de freno',
      accessories: 'Accesorios',
      noAccessories: 'Ninguno seleccionado',
      totalEstimated: 'Total configurado',
      disclaimer:
        'Demostración técnica de portafolio no comercial de Progress Digital desarrollada en WebGL en tiempo real (Three.js y React Three Fiber).',
      modelCredit: 'Créditos del modelo 3D',
    },
  },
}
