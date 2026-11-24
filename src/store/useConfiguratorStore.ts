import { create } from 'zustand'
import {
  VEHICLES,
  createDefaultSelection,
  getVehicleById,
} from '../config/vehicles'
import type {
  CameraPresetId,
  ConfigStep,
  InspectedMeshInfo,
  Language,
  ShowroomTheme,
  VehicleId,
  VehicleSelection,
} from '../types/configurator'

export type AppView = 'landing' | 'configurator'
type ModelSourceStatus = 'checking' | 'glb' | 'local-glb' | 'procedural'

interface ConfiguratorState {
  activeView: AppView
  menuOpen: boolean
  language: Language
  activeVehicleId: VehicleId
  activeStep: ConfigStep
  activeCamera: CameraPresetId
  cameraRequestNonce: number
  showroomTheme: ShowroomTheme
  autoRotate: boolean
  inspectorEnabled: boolean
  inspectedMesh: InspectedMeshInfo | null
  selections: Record<VehicleId, VehicleSelection>
  localGlbUrls: Partial<Record<VehicleId, string>>
  modelStatus: Record<VehicleId, ModelSourceStatus>
  summaryOpen: boolean

  setActiveView: (view: AppView) => void
  openConfiguratorForVehicle: (id: VehicleId, theme?: ShowroomTheme) => void
  setMenuOpen: (open: boolean) => void
  setLanguage: (lang: Language) => void
  setActiveVehicle: (id: VehicleId) => void
  setActiveStep: (step: ConfigStep) => void
  setActiveCamera: (preset: CameraPresetId) => void
  toggleInteriorView: () => void
  setShowroomTheme: (theme: ShowroomTheme) => void
  toggleAutoRotate: () => void
  setInspectorEnabled: (enabled: boolean) => void
  setInspectedMesh: (info: InspectedMeshInfo | null) => void
  setPaint: (paintId: string) => void
  setInterior: (interiorId: string) => void
  setWheel: (wheelId: string) => void
  setCaliper: (caliperId: string) => void
  toggleAccessory: (accessoryId: string) => void
  resetActiveVehicle: () => void
  setLocalGlbUrl: (vehicleId: VehicleId, url: string | null) => void
  setModelStatus: (vehicleId: VehicleId, status: ModelSourceStatus) => void
  setSummaryOpen: (open: boolean) => void
  getShareUrl: () => string
}

function buildInitialSelections(): Record<VehicleId, VehicleSelection> {
  const map = {} as Record<VehicleId, VehicleSelection>
  for (const v of VEHICLES) {
    map[v.id] = createDefaultSelection(v)
  }
  return map
}

function parseInitialStateFromUrl() {
  const defaults = {
    activeView: 'landing' as AppView,
    activeCamera: 'hero' as CameraPresetId,
    language: 'en' as Language,
    activeVehicleId: 'mclaren-p1' as VehicleId,
    showroomTheme: 'agency' as ShowroomTheme,
    inspectorEnabled: false,
    selections: buildInitialSelections(),
  }

  if (typeof window === 'undefined') return defaults

  const params = new URLSearchParams(window.location.search)

  // Deep-linked configurator URLs jump straight into the 3D configurator
  if (
    params.get('view') === 'configurator' ||
    params.has('v') ||
    params.has('paint') ||
    params.has('interior')
  ) {
    defaults.activeView = 'configurator'
  }

  const camParam = params.get('cam') as CameraPresetId | null
  if (
    camParam === 'hero' ||
    camParam === 'front' ||
    camParam === 'side' ||
    camParam === 'rear' ||
    camParam === 'wheels' ||
    camParam === 'interior'
  ) {
    defaults.activeCamera = camParam
  }

  const langParam = params.get('lang')
  if (langParam === 'en' || langParam === 'es') {
    defaults.language = langParam
  }

  const themeParam = params.get('theme')
  if (themeParam === 'agency' || themeParam === 'light' || themeParam === 'dark') {
    defaults.showroomTheme = themeParam
  }

  if (params.get('debug') === '1') {
    defaults.inspectorEnabled = true
  }

  const vParam = params.get('v') as VehicleId | null
  if (vParam && VEHICLES.some((v) => v.id === vParam)) {
    defaults.activeVehicleId = vParam
  }

  const activeVehicle = getVehicleById(defaults.activeVehicleId)
  const sel = { ...defaults.selections[activeVehicle.id] }

  const paint = params.get('paint')
  if (paint && activeVehicle.paints.some((p) => p.id === paint)) sel.paintId = paint

  const interior = params.get('interior')
  if (interior && activeVehicle.interiors.some((i) => i.id === interior)) sel.interiorId = interior

  const wheel = params.get('wheel')
  if (wheel && activeVehicle.wheels.some((w) => w.id === wheel)) sel.wheelId = wheel

  const caliper = params.get('caliper')
  if (caliper && activeVehicle.calipers.some((c) => c.id === caliper)) sel.caliperId = caliper

  const acc = params.get('acc')
  if (acc !== null) {
    const validIds = new Set(activeVehicle.accessories.map((a) => a.id))
    sel.accessoryIds = acc
      .split(',')
      .map((s) => s.trim())
      .filter((id) => validIds.has(id))
  }

  defaults.selections[activeVehicle.id] = sel
  return defaults
}

const initial = parseInitialStateFromUrl()

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  activeView: initial.activeView,
  menuOpen: false,
  language: initial.language,
  activeVehicleId: initial.activeVehicleId,
  activeStep: 'exterior',
  activeCamera: initial.activeCamera,
  cameraRequestNonce: 0,
  showroomTheme: initial.showroomTheme,
  autoRotate: false,
  inspectorEnabled: initial.inspectorEnabled,
  inspectedMesh: null,
  selections: initial.selections,
  localGlbUrls: {},
  modelStatus: {
    'mclaren-p1': 'checking',
    'lotus-exige-240': 'checking',
    'honda-acty-ha3': 'checking',
  },
  summaryOpen: false,

  setActiveView: (activeView) => set({ activeView, menuOpen: false }),

  openConfiguratorForVehicle: (activeVehicleId, theme) =>
    set((state) => ({
      activeView: 'configurator',
      menuOpen: false,
      activeVehicleId,
      activeStep: 'exterior',
      activeCamera: 'hero',
      cameraRequestNonce: state.cameraRequestNonce + 1,
      showroomTheme: theme ?? state.showroomTheme,
      inspectedMesh: null,
    })),

  setMenuOpen: (menuOpen) => set({ menuOpen }),

  setLanguage: (language) => set({ language }),

  setActiveVehicle: (activeVehicleId) =>
    set((state) => ({
      activeVehicleId,
      activeCamera: state.activeCamera === 'interior' ? 'interior' : 'hero',
      cameraRequestNonce: state.cameraRequestNonce + 1,
      inspectedMesh: null,
    })),

  setActiveStep: (activeStep) =>
    set((state) => {
      if (activeStep === 'summary') {
        return { activeStep, summaryOpen: true }
      }
      let nextCamera = state.activeCamera
      if (activeStep === 'interior') {
        nextCamera = 'interior'
      } else if (activeStep === 'exterior' && state.activeCamera === 'interior') {
        nextCamera = 'hero'
      } else if (activeStep === 'extras' && state.activeCamera === 'interior') {
        nextCamera = state.activeVehicleId === 'honda-acty-ha3' ? 'rear' : 'hero'
      }
      return {
        activeStep,
        summaryOpen: false,
        activeCamera: nextCamera,
        cameraRequestNonce:
          nextCamera !== state.activeCamera ? state.cameraRequestNonce + 1 : state.cameraRequestNonce,
        autoRotate: nextCamera === 'interior' ? false : state.autoRotate,
      }
    }),

  setActiveCamera: (activeCamera) =>
    set((state) => ({
      activeCamera,
      cameraRequestNonce: state.cameraRequestNonce + 1,
      autoRotate: activeCamera === 'interior' ? false : state.autoRotate,
    })),

  toggleInteriorView: () =>
    set((state) => {
      const goingInterior = state.activeCamera !== 'interior'
      return {
        activeCamera: goingInterior ? 'interior' : 'hero',
        cameraRequestNonce: state.cameraRequestNonce + 1,
        autoRotate: goingInterior ? false : state.autoRotate,
      }
    }),

  setShowroomTheme: (showroomTheme) => set({ showroomTheme }),

  toggleAutoRotate: () =>
    set((state) => ({
      autoRotate: state.activeCamera === 'interior' ? false : !state.autoRotate,
    })),

  setInspectorEnabled: (inspectorEnabled) =>
    set({ inspectorEnabled, inspectedMesh: null }),

  setInspectedMesh: (inspectedMesh) => set({ inspectedMesh }),

  setPaint: (paintId) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [state.activeVehicleId]: {
          ...state.selections[state.activeVehicleId],
          paintId,
        },
      },
    })),

  setInterior: (interiorId) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [state.activeVehicleId]: {
          ...state.selections[state.activeVehicleId],
          interiorId,
        },
      },
    })),

  setWheel: (wheelId) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [state.activeVehicleId]: {
          ...state.selections[state.activeVehicleId],
          wheelId,
        },
      },
    })),

  setCaliper: (caliperId) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [state.activeVehicleId]: {
          ...state.selections[state.activeVehicleId],
          caliperId,
        },
      },
    })),

  toggleAccessory: (accessoryId) =>
    set((state) => {
      const current = state.selections[state.activeVehicleId]
      const exists = current.accessoryIds.includes(accessoryId)
      const nextIds = exists
        ? current.accessoryIds.filter((id) => id !== accessoryId)
        : [...current.accessoryIds, accessoryId]
      return {
        selections: {
          ...state.selections,
          [state.activeVehicleId]: {
            ...current,
            accessoryIds: nextIds,
          },
        },
      }
    }),

  resetActiveVehicle: () =>
    set((state) => {
      const vehicle = getVehicleById(state.activeVehicleId)
      return {
        selections: {
          ...state.selections,
          [state.activeVehicleId]: createDefaultSelection(vehicle),
        },
      }
    }),

  setLocalGlbUrl: (vehicleId, url) =>
    set((state) => {
      const prev = state.localGlbUrls[vehicleId]
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      const nextUrls = { ...state.localGlbUrls }
      if (url) {
        nextUrls[vehicleId] = url
      } else {
        delete nextUrls[vehicleId]
      }
      return {
        localGlbUrls: nextUrls,
        modelStatus: {
          ...state.modelStatus,
          [vehicleId]: url ? 'local-glb' : 'checking',
        },
      }
    }),

  setModelStatus: (vehicleId, status) =>
    set((state) => ({
      modelStatus: {
        ...state.modelStatus,
        [vehicleId]: status,
      },
    })),

  setSummaryOpen: (summaryOpen) =>
    set((state) => ({
      summaryOpen,
      activeStep: summaryOpen ? 'summary' : state.activeStep === 'summary' ? 'exterior' : state.activeStep,
    })),

  getShareUrl: () => {
    const state = get()
    const sel = state.selections[state.activeVehicleId]
    const url = new URL(window.location.href)
    url.searchParams.set('view', 'configurator')
    url.searchParams.set('v', state.activeVehicleId)
    url.searchParams.set('paint', sel.paintId)
    url.searchParams.set('interior', sel.interiorId)
    url.searchParams.set('wheel', sel.wheelId)
    url.searchParams.set('caliper', sel.caliperId)
    url.searchParams.set('acc', sel.accessoryIds.join(','))
    url.searchParams.set('theme', state.showroomTheme)
    url.searchParams.set('lang', state.language)
    return url.toString()
  },
}))
