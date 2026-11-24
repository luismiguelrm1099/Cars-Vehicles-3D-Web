import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { getVehicleById } from '../config/vehicles'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import type {
  CaliperOption,
  InteriorOption,
  PaintOption,
  VehicleDefinition,
  VehicleId,
  WheelOption,
} from '../types/configurator'
import { applyGlbMaterialOverrides } from './materials'
import { ProceduralVehicle } from './ProceduralVehicles'

/**
 * Modular commercial accessories mounted precisely onto the normalized real .glb vehicles
 * (e.g., Honda Acty flatbed equipment & aerodynamic front splitters).
 */
function GlbModularAccessories({
  vehicleId,
  accessoryIds,
}: {
  vehicleId: VehicleId
  accessoryIds: string[]
}) {
  const enabled = new Set(accessoryIds)

  if (vehicleId === 'honda-acty-ha3') {
    return (
      <group name="ActyGlbModularAccessories">
        {/* Tubular Steel Cargo Rack fitted flush to Acty bed rails and cab roofline */}
        {enabled.has('bed-rack') && (
          <group position={[0, 0.9, -0.76]}>
            {[
              [-0.63, 0.34, 0.82],
              [0.63, 0.34, 0.82],
              [-0.63, 0.34, -0.8],
              [0.63, 0.34, -0.8],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} castShadow>
                <cylinderGeometry args={[0.021, 0.021, 0.68, 12]} />
                <meshStandardMaterial color="#1d2026" metalness={0.65} roughness={0.4} />
              </mesh>
            ))}
            {[-0.63, 0.63].map((x, idx) => (
              <mesh key={idx} position={[x, 0.68, 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.021, 0.021, 1.66, 12]} />
                <meshStandardMaterial color="#1d2026" metalness={0.65} roughness={0.4} />
              </mesh>
            ))}
            {[-0.8, 0.01, 0.82].map((z, idx) => (
              <mesh key={idx} position={[0, 0.68, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.021, 0.021, 1.3, 12]} />
                <meshStandardMaterial color="#1d2026" metalness={0.65} roughness={0.4} />
              </mesh>
            ))}
          </group>
        )}

        {/* Aluminum Diamond-Plate Toolbox fitted behind cab */}
        {enabled.has('bed-toolbox') && (
          <group position={[0, 0.79, -0.18]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.24, 0.34, 0.46]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.86} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <boxGeometry args={[1.28, 0.04, 0.5]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.22} />
            </mesh>
            <mesh position={[0, 0.05, -0.235]}>
              <boxGeometry args={[0.14, 0.055, 0.02]} />
              <meshStandardMaterial color="#1f242b" metalness={0.7} roughness={0.35} />
            </mesh>
          </group>
        )}

        {/* Soft Roll-Up Tonneau Cover */}
        {enabled.has('bed-tonneau') && (
          <mesh position={[0, 0.92, -0.76]} castShadow receiveShadow>
            <boxGeometry args={[1.32, 0.03, 1.72]} />
            <meshStandardMaterial color="#1c1f24" roughness={0.86} metalness={0.05} />
          </mesh>
        )}

        {/* Cab Roof LED Work Lightbar with flush roof mounting brackets */}
        {enabled.has('roof-lightbar') && (
          <group position={[0, 1.65, 1.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.96, 0.068, 0.09]} />
              <meshStandardMaterial color="#181b20" metalness={0.65} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.047]}>
              <planeGeometry args={[0.88, 0.04]} />
              <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={2.8} />
            </mesh>
            {[-0.44, 0.44].map((x, idx) => (
              <mesh key={idx} position={[x, -0.055, 0]}>
                <boxGeometry args={[0.04, 0.075, 0.055]} />
                <meshStandardMaterial color="#14171c" metalness={0.7} roughness={0.4} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    )
  }

  return null
}

interface GlbVehicleRendererProps {
  url: string
  vehicle: VehicleDefinition
  paint: PaintOption
  interior: InteriorOption
  wheel: WheelOption
  caliper: CaliperOption
  accessoryIds: string[]
  inspectorEnabled: boolean
  onInspect: (mesh: THREE.Mesh) => void
}

function GlbVehicleRenderer({
  url,
  vehicle,
  paint,
  interior,
  wheel,
  caliper,
  accessoryIds,
  inspectorEnabled,
  onInspect,
}: GlbVehicleRendererProps) {
  const gltf = useGLTF(url, false, false, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder)
  })

  // Clone scene so material edits stay isolated per instance and normalize scale/grounding
  const normalizedScene = useMemo(() => {
    const clone = gltf.scene.clone(true)

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const maxHorizontal = Math.max(size.x, size.z)

    if (maxHorizontal > 0.001) {
      const scale = vehicle.targetLength / maxHorizontal
      clone.scale.setScalar(scale)

      if (size.x > size.z * 1.15) {
        clone.rotation.y = Math.PI / 2
      }
    }

    clone.updateMatrixWorld(true)
    const scaledBox = new THREE.Box3().setFromObject(clone)
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3())
    clone.position.set(-scaledCenter.x, -scaledBox.min.y, -scaledCenter.z)

    // Store initial Y positions for animated aero nodes (like McLaren P1 WING_0)
    const wingNode = clone.getObjectByName('WING_0')
    if (wingNode) {
      wingNode.userData.__baseY = wingNode.position.y
      wingNode.userData.__baseRotX = wingNode.rotation.x
    }

    return clone
  }, [gltf.scene, vehicle.targetLength])

  // Apply real-time PBR material overrides and native node toggles/deployments
  useEffect(() => {
    applyGlbMaterialOverrides(
      normalizedScene,
      vehicle.materialSlots,
      paint,
      interior,
      wheel,
      caliper
    )

    const enabledSet = new Set(accessoryIds)

    // Toggle native named meshes (e.g., Lotus Exige 'WING')
    for (const acc of vehicle.accessories) {
      if (!acc.meshNames || acc.meshNames.length === 0) continue
      const visible = enabledSet.has(acc.id)
      for (const targetName of acc.meshNames) {
        const node = normalizedScene.getObjectByName(targetName)
        if (node) node.visible = visible
      }
    }

    // Real McLaren P1 Active Rear Wing deployment (anchored hydraulic lift)
    if (vehicle.id === 'mclaren-p1') {
      const wingNode = normalizedScene.getObjectByName('WING_0')
      if (wingNode && typeof wingNode.userData.__baseY === 'number') {
        const deployed = enabledSet.has('active-wing')
        wingNode.position.y = wingNode.userData.__baseY + (deployed ? 11 : 0)
        wingNode.rotation.x = wingNode.userData.__baseRotX + (deployed ? -0.1 : 0)
      }
    }
  }, [normalizedScene, vehicle, paint, interior, wheel, caliper, accessoryIds])

  const handlePointerClick = (event: ThreeEvent<MouseEvent>) => {
    if (!inspectorEnabled) return
    event.stopPropagation()
    if (event.object instanceof THREE.Mesh) {
      onInspect(event.object)
    }
  }

  return (
    <group>
      <primitive object={normalizedScene} onClick={handlePointerClick} />
      <GlbModularAccessories vehicleId={vehicle.id} accessoryIds={accessoryIds} />
    </group>
  )
}

export function VehicleModel() {
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const selection = useConfiguratorStore((s) => s.selections[s.activeVehicleId])
  const localGlbUrl = useConfiguratorStore((s) => s.localGlbUrls[s.activeVehicleId])
  const modelStatus = useConfiguratorStore((s) => s.modelStatus[s.activeVehicleId])
  const setModelStatus = useConfiguratorStore((s) => s.setModelStatus)
  const inspectorEnabled = useConfiguratorStore((s) => s.inspectorEnabled)
  const setInspectedMesh = useConfiguratorStore((s) => s.setInspectedMesh)

  const vehicle = getVehicleById(activeVehicleId)

  const paint =
    vehicle.paints.find((p) => p.id === selection.paintId) ?? vehicle.paints[0]
  const interior =
    vehicle.interiors.find((i) => i.id === selection.interiorId) ?? vehicle.interiors[0]
  const wheel =
    vehicle.wheels.find((w) => w.id === selection.wheelId) ?? vehicle.wheels[0]
  const caliper =
    vehicle.calipers.find((c) => c.id === selection.caliperId) ?? vehicle.calipers[0]

  useEffect(() => {
    if (localGlbUrl) {
      setModelStatus(activeVehicleId, 'local-glb')
      return
    }
    if (modelStatus === 'glb' || modelStatus === 'procedural') return

    let cancelled = false
    fetch(vehicle.modelUrl, { method: 'HEAD' })
      .then((res) => {
        if (cancelled) return
        const contentType = res.headers.get('content-type') || ''
        const isValidBinary = res.ok && !contentType.includes('text/html')
        setModelStatus(activeVehicleId, isValidBinary ? 'glb' : 'procedural')
      })
      .catch(() => {
        if (!cancelled) setModelStatus(activeVehicleId, 'procedural')
      })

    return () => {
      cancelled = true
    }
  }, [activeVehicleId, localGlbUrl, modelStatus, setModelStatus, vehicle.modelUrl])

  const handleInspect = (mesh: THREE.Mesh) => {
    const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    const colorHex =
      mat && 'color' in mat && mat.color instanceof THREE.Color
        ? `#${mat.color.getHexString()}`
        : 'n/a'
    setInspectedMesh({
      meshName: mesh.name || '(unnamed mesh)',
      materialName: mat?.name || '(unnamed material)',
      materialType: mat?.type || 'Unknown',
      colorHex,
    })
  }

  const resolvedGlbUrl =
    localGlbUrl ?? (modelStatus === 'glb' ? vehicle.modelUrl : null)

  if (resolvedGlbUrl) {
    return (
      <GlbVehicleRenderer
        key={`${activeVehicleId}-${resolvedGlbUrl}`}
        url={resolvedGlbUrl}
        vehicle={vehicle}
        paint={paint}
        interior={interior}
        wheel={wheel}
        caliper={caliper}
        accessoryIds={selection.accessoryIds}
        inspectorEnabled={inspectorEnabled}
        onInspect={handleInspect}
      />
    )
  }

  return (
    <group
      onClick={(e) => {
        if (!inspectorEnabled) return
        e.stopPropagation()
        if (e.object instanceof THREE.Mesh) handleInspect(e.object)
      }}
    >
      <ProceduralVehicle
        vehicleId={activeVehicleId}
        paint={paint}
        interior={interior}
        wheel={wheel}
        caliper={caliper}
        accessoryIds={selection.accessoryIds}
      />
    </group>
  )
}
