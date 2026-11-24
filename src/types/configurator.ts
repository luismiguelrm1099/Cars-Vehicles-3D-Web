export type Language = 'en' | 'es'

export type ConfigStep = 'exterior' | 'interior' | 'extras' | 'summary'

export type ShowroomTheme = 'agency' | 'light' | 'dark'

export type PaintFinish = 'solid' | 'metallic' | 'matte'

export type InteriorMaterialType = 'leather' | 'alcantara' | 'carbon'

export type CameraPresetId = 'hero' | 'front' | 'side' | 'rear' | 'wheels' | 'interior'

export type VehicleId = 'mclaren-p1' | 'lotus-exige-240' | 'honda-acty-ha3'

export interface LocalizedText {
  en: string
  es: string
}

export interface PaintOption {
  id: string
  name: LocalizedText
  hex: string
  finish: PaintFinish
  price: number
}

export interface InteriorOption {
  id: string
  name: LocalizedText
  primaryHex: string
  accentHex: string
  dashHex: string
  materialType: InteriorMaterialType
  price: number
}

export interface WheelOption {
  id: string
  name: LocalizedText
  hex: string
  finish: 'gloss' | 'satin' | 'machined'
  spokeStyle: 'split5' | 'mesh' | 'steel'
  price: number
}

export interface CaliperOption {
  id: string
  name: LocalizedText
  hex: string
  price: number
}

export interface AccessoryOption {
  id: string
  name: LocalizedText
  description: LocalizedText
  price: number
  /** Mesh names to toggle on a real .glb model (optional) */
  meshNames?: string[]
  /** Procedural accessory identifier rendered automatically */
  proceduralId: string
  defaultEnabled?: boolean
}

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
  fov?: number
}

export interface MaterialSlotMatchers {
  body: string[]
  interiorPrimary: string[]
  interiorAccent: string[]
  wheels: string[]
  calipers: string[]
}

export interface VehicleDefinition {
  id: VehicleId
  brand: string
  name: string
  year: number
  category: LocalizedText
  tagline: LocalizedText
  basePrice: number
  modelUrl: string
  /** Target normalized length in meters when loading external GLBs */
  targetLength: number
  specs: {
    power: string
    weight: string
    drivetrain: string
    layout: LocalizedText
  }
  attribution: {
    author: string
    modelTitle: string
    sourceUrl: string
  }
  materialSlots: MaterialSlotMatchers
  cameras: Record<CameraPresetId, CameraPreset>
  paints: PaintOption[]
  interiors: InteriorOption[]
  wheels: WheelOption[]
  calipers: CaliperOption[]
  accessories: AccessoryOption[]
}

export interface VehicleSelection {
  paintId: string
  interiorId: string
  wheelId: string
  caliperId: string
  accessoryIds: string[]
}

export interface InspectedMeshInfo {
  meshName: string
  materialName: string
  materialType: string
  colorHex: string
}
