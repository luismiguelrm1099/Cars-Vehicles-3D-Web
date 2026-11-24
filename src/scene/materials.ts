import * as THREE from 'three'
import type {
  CaliperOption,
  InteriorOption,
  MaterialSlotMatchers,
  PaintOption,
  WheelOption,
} from '../types/configurator'

export interface PaintMaterialConfig {
  color: string
  metalness: number
  roughness: number
  clearcoat: number
  clearcoatRoughness: number
  envMapIntensity: number
}

/**
 * Calibrated physical automotive paint under AgX tone mapping and high-contrast
 * studio light-banks: deep factory pigment with sharp, restrained clearcoat.
 */
export function getPaintMaterialConfig(paint: PaintOption): PaintMaterialConfig {
  switch (paint.finish) {
    case 'metallic':
      return {
        color: paint.hex,
        metalness: 0.45,
        roughness: 0.3,
        clearcoat: 0.82,
        clearcoatRoughness: 0.1,
        envMapIntensity: 0.78,
      }
    case 'matte':
      return {
        color: paint.hex,
        metalness: 0.14,
        roughness: 0.72,
        clearcoat: 0.04,
        clearcoatRoughness: 0.72,
        envMapIntensity: 0.46,
      }
    case 'solid':
    default:
      return {
        color: paint.hex,
        metalness: 0.04,
        roughness: 0.28,
        clearcoat: 0.78,
        clearcoatRoughness: 0.1,
        envMapIntensity: 0.7,
      }
  }
}

export interface InteriorMaterialConfig {
  primaryColor: string
  accentColor: string
  dashColor: string
  roughness: number
  metalness: number
  sheen: number
  envMapIntensity: number
}

export function getInteriorMaterialConfig(interior: InteriorOption): InteriorMaterialConfig {
  switch (interior.materialType) {
    case 'alcantara':
      return {
        primaryColor: interior.primaryHex,
        accentColor: interior.accentHex,
        dashColor: interior.dashHex,
        roughness: 0.96,
        metalness: 0.0,
        sheen: 0.35,
        envMapIntensity: 0.12,
      }
    case 'carbon':
      return {
        primaryColor: interior.primaryHex,
        accentColor: interior.accentHex,
        dashColor: interior.dashHex,
        roughness: 0.88,
        metalness: 0.02,
        sheen: 0.18,
        envMapIntensity: 0.18,
      }
    case 'leather':
    default:
      return {
        primaryColor: interior.primaryHex,
        accentColor: interior.accentHex,
        dashColor: interior.dashHex,
        roughness: 0.82,
        metalness: 0.0,
        sheen: 0.12,
        envMapIntensity: 0.2,
      }
  }
}

export function getWheelMaterialConfig(wheel: WheelOption) {
  switch (wheel.finish) {
    case 'machined':
      return { color: wheel.hex, metalness: 0.88, roughness: 0.22, envMapIntensity: 0.88 }
    case 'gloss':
      return { color: wheel.hex, metalness: 0.62, roughness: 0.26, envMapIntensity: 0.76 }
    case 'satin':
    default:
      return { color: wheel.hex, metalness: 0.54, roughness: 0.44, envMapIntensity: 0.62 }
  }
}

export function matchesSlot(name: string, matchers: string[]): boolean {
  const lower = name.toLowerCase()
  return matchers.some((token) => {
    if (token.startsWith('=')) {
      return lower === token.slice(1).toLowerCase()
    }
    return lower.includes(token.toLowerCase())
  })
}

/**
 * Photorealistic baseline pass for all non-customized game-converted materials:
 * automotive tinted glass, brushed brake rotors, matte rubber tires, satin carbon,
 * and natural interior fabrics.
 */
function calibrateRealismBaseline(mat: THREE.MeshStandardMaterial): THREE.Material | null {
  const lower = (mat.name || '').toLowerCase()

  // Automotive tinted glass & windshields — crisp reflections while keeping cabin visible
  if (/(windows_alpha|clear_glass|int_glass_side|int_vetro|windscreen\.3)/i.test(lower)) {
    return new THREE.MeshPhysicalMaterial({
      name: mat.name,
      color: new THREE.Color('#0c1218'),
      metalness: 0.05,
      roughness: 0.06,
      transparent: true,
      opacity: 0.36,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.15,
      depthWrite: false,
    })
  }

  // Vulcanized rubber tires — true deep matte rubber
  if (/(tyre|tire|battistrada)/i.test(lower)) {
    const clone = mat.clone()
    clone.roughness = 0.88
    clone.metalness = 0.02
    clone.envMapIntensity = 0.2
    clone.needsUpdate = true
    return clone
  }

  // Brushed metallic brake rotors
  if (/(brake_disk|car_disk)/i.test(lower)) {
    const clone = mat.clone()
    clone.metalness = 0.9
    clone.roughness = 0.28
    clone.envMapIntensity = 0.85
    clone.needsUpdate = true
    return clone
  }

  // Chrome & polished badges
  if (/(chrome|emblem\.3$|mirror)/i.test(lower)) {
    const clone = mat.clone()
    clone.metalness = 0.96
    clone.roughness = 0.14
    clone.envMapIntensity = 1.0
    clone.needsUpdate = true
    return clone
  }

  // Interior carbon fiber, plastics, carpets, velvet, dashboards
  if (
    lower.startsWith('int_') ||
    lower.includes('mainbody_int') ||
    lower.includes('mainbody_dash')
  ) {
    if (/(display|glass|vetro|mirror|chrome)/i.test(lower)) {
      return null
    }
    const clone = mat.clone()
    if (/(carpet|velvet|fabric|cloth|sheet|belt|cinture|cuciture|seams)/i.test(lower)) {
      clone.roughness = Math.max(clone.roughness, 0.92)
      clone.metalness = 0.0
      clone.envMapIntensity = 0.14
    } else if (/carbon/i.test(lower)) {
      clone.roughness = Math.max(clone.roughness, 0.44)
      clone.metalness = Math.min(clone.metalness, 0.14)
      clone.envMapIntensity = 0.36
    } else {
      clone.roughness = Math.max(clone.roughness, 0.68)
      clone.metalness = Math.min(clone.metalness, 0.12)
      clone.envMapIntensity = 0.22
    }
    clone.needsUpdate = true
    return clone
  }

  // Exterior satin plastics, vents, grilles, exterior carbon trim
  if (/(matte_black|black_plastic|plastics|black\.4|guarnizioni|carbon_mult|car_carbon)/i.test(lower)) {
    const clone = mat.clone()
    clone.roughness = Math.max(clone.roughness, 0.54)
    clone.metalness = Math.min(clone.metalness, 0.16)
    clone.envMapIntensity = 0.4
    clone.needsUpdate = true
    return clone
  }

  if (/carpaint_black/i.test(lower)) {
    const clone = mat.clone()
    clone.roughness = 0.24
    clone.metalness = 0.22
    clone.envMapIntensity = 0.62
    clone.needsUpdate = true
    return clone
  }

  return null
}

export function applyGlbMaterialOverrides(
  root: THREE.Object3D,
  matchers: MaterialSlotMatchers,
  paint: PaintOption,
  interior: InteriorOption,
  wheel: WheelOption,
  caliper: CaliperOption
) {
  const paintCfg = getPaintMaterialConfig(paint)
  const intCfg = getInteriorMaterialConfig(interior)
  const wheelCfg = getWheelMaterialConfig(wheel)

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh) || !obj.material) return

    if (!obj.userData.__origMaterial) {
      obj.userData.__origMaterial = obj.material
    }
    const origMaterial = obj.userData.__origMaterial as THREE.Material | THREE.Material[]
    const origList = Array.isArray(origMaterial) ? origMaterial : [origMaterial]

    if (obj.userData.__clonedMaterials) {
      for (const oldMat of obj.userData.__clonedMaterials as THREE.Material[]) {
        oldMat.dispose()
      }
      obj.userData.__clonedMaterials = []
    }

    const meshName = obj.name || ''
    const newlyCloned: THREE.Material[] = []

    const updated = origList.map((mat) => {
      if (!(mat instanceof THREE.MeshStandardMaterial)) return mat

      const matName = mat.name || ''

      if (matchesSlot(matName, matchers.calipers)) {
        const target = mat.clone()
        target.color.set(caliper.hex)
        target.metalness = 0.3
        target.roughness = 0.4
        target.envMapIntensity = 0.6
        target.needsUpdate = true
        newlyCloned.push(target)
        return target
      }

      const isWheelByMat = matchesSlot(matName, matchers.wheels)
      const isWheelByNode =
        matchers.wheels.includes('@rim-node') && /rim_.*sub0|rim_0$/i.test(meshName)
      if (isWheelByMat || isWheelByNode) {
        const target = mat.clone()
        target.color.set(wheelCfg.color)
        target.metalness = wheelCfg.metalness
        target.roughness = wheelCfg.roughness
        target.envMapIntensity = wheelCfg.envMapIntensity
        target.needsUpdate = true
        newlyCloned.push(target)
        return target
      }

      if (matchesSlot(matName, matchers.body)) {
        const phys = new THREE.MeshPhysicalMaterial({
          name: mat.name,
          color: new THREE.Color(paintCfg.color),
          metalness: paintCfg.metalness,
          roughness: paintCfg.roughness,
          clearcoat: paintCfg.clearcoat,
          clearcoatRoughness: paintCfg.clearcoatRoughness,
          normalMap: mat.normalMap,
          normalScale: mat.normalScale ? mat.normalScale.clone() : new THREE.Vector2(1, 1),
          aoMap: mat.aoMap,
          aoMapIntensity: mat.aoMapIntensity,
          envMapIntensity: paintCfg.envMapIntensity,
        })
        newlyCloned.push(phys)
        return phys
      }

      if (matchesSlot(matName, matchers.interiorAccent)) {
        const target = mat.clone()
        target.color.set(intCfg.accentColor)
        target.roughness = Math.max(intCfg.roughness, 0.72)
        target.metalness = 0.08
        target.envMapIntensity = 0.2
        target.needsUpdate = true
        newlyCloned.push(target)
        return target
      }

      if (matchesSlot(matName, matchers.interiorPrimary)) {
        const target = mat.clone()
        target.color.set(intCfg.primaryColor)
        target.roughness = intCfg.roughness
        target.metalness = intCfg.metalness
        target.envMapIntensity = intCfg.envMapIntensity
        target.needsUpdate = true
        newlyCloned.push(target)
        return target
      }

      const calibrated = calibrateRealismBaseline(mat)
      if (calibrated) {
        newlyCloned.push(calibrated)
        return calibrated
      }

      return mat
    })

    if (newlyCloned.length > 0) {
      obj.userData.__clonedMaterials = newlyCloned
    }
    obj.material = Array.isArray(origMaterial) ? updated : updated[0]
  })
}
