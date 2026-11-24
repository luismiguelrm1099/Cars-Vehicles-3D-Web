import { useMemo } from 'react'
import * as THREE from 'three'
import type {
  CaliperOption,
  InteriorOption,
  PaintOption,
  VehicleId,
  WheelOption,
} from '../types/configurator'
import {
  getInteriorMaterialConfig,
  getPaintMaterialConfig,
  getWheelMaterialConfig,
} from './materials'

interface ProceduralVehicleProps {
  vehicleId: VehicleId
  paint: PaintOption
  interior: InteriorOption
  wheel: WheelOption
  caliper: CaliperOption
  accessoryIds: string[]
}

interface WheelAssemblyProps {
  position: [number, number, number]
  radius: number
  width: number
  side: 'left' | 'right'
  wheel: WheelOption
  caliper: CaliperOption
}

function WheelAssembly({
  position,
  radius,
  width,
  side,
  wheel,
  caliper,
}: WheelAssemblyProps) {
  const wheelMat = getWheelMaterialConfig(wheel)
  const spokeCount = wheel.spokeStyle === 'mesh' ? 10 : wheel.spokeStyle === 'steel' ? 6 : 5
  const sign = side === 'right' ? 1 : -1

  const spokeAngles = useMemo(
    () => Array.from({ length: spokeCount }, (_, i) => (i * Math.PI * 2) / spokeCount),
    [spokeCount]
  )

  return (
    <group position={position}>
      {/* Tire sidewall & tread */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 36]} />
        <meshStandardMaterial color="#181a1e" roughness={0.86} metalness={0.05} />
      </mesh>
      {/* Tire shoulder bevel rings */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[sign * (width * 0.44), 0, 0]}>
        <torusGeometry args={[radius * 0.84, radius * 0.14, 12, 32]} />
        <meshStandardMaterial color="#1d2025" roughness={0.82} metalness={0.05} />
      </mesh>
      {/* Outer alloy rim barrel */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.72, radius * 0.72, width * 0.92, 32]} />
        <meshStandardMaterial
          color={wheelMat.color}
          metalness={wheelMat.metalness}
          roughness={wheelMat.roughness}
        />
      </mesh>
      {/* Inner recessed wheel well */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[sign * 0.01, 0, 0]}>
        <cylinderGeometry args={[radius * 0.65, radius * 0.65, width * 0.84, 32]} />
        <meshStandardMaterial color="#101216" roughness={0.65} metalness={0.4} />
      </mesh>
      {/* Brake rotor disc */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[sign * (width * 0.15), 0, 0]}>
        <cylinderGeometry args={[radius * 0.56, radius * 0.56, 0.025, 28]} />
        <meshStandardMaterial color="#8f97a3" metalness={0.88} roughness={0.28} />
      </mesh>
      {/* Painted brake caliper */}
      <mesh position={[sign * (width * 0.22), 0.03, -radius * 0.34]}>
        <boxGeometry args={[0.075, radius * 0.48, radius * 0.24]} />
        <meshStandardMaterial color={caliper.hex} metalness={0.42} roughness={0.28} />
      </mesh>
      {/* Spokes */}
      {spokeAngles.map((angle, idx) => (
        <group key={idx} rotation={[angle, 0, 0]}>
          <mesh position={[sign * (width * 0.42), radius * 0.34, 0]}>
            <boxGeometry
              args={[
                0.028,
                radius * 0.62,
                wheel.spokeStyle === 'steel' ? 0.075 : 0.032,
              ]}
            />
            <meshStandardMaterial
              color={wheelMat.color}
              metalness={wheelMat.metalness}
              roughness={wheelMat.roughness}
            />
          </mesh>
        </group>
      ))}
      {/* Center cap */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[sign * (width * 0.44), 0, 0]}>
        <cylinderGeometry args={[radius * 0.17, radius * 0.17, 0.035, 20]} />
        <meshStandardMaterial color="#181a1f" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  )
}

interface SportsCabinProps {
  interior: InteriorOption
  scale?: number
  yOffset?: number
  zOffset?: number
}

function SportsCabin({ interior, scale = 1, yOffset = 0, zOffset = 0 }: SportsCabinProps) {
  const intCfg = getInteriorMaterialConfig(interior)

  return (
    <group position={[0, yOffset, zOffset]} scale={scale}>
      {/* Floor tub & carpet */}
      <mesh position={[0, 0.24, 0.1]}>
        <boxGeometry args={[1.38, 0.08, 1.48]} />
        <meshStandardMaterial color="#14161a" roughness={0.92} />
      </mesh>

      {/* Sculpted center tunnel & floating carbon console */}
      <mesh position={[0, 0.46, 0.18]}>
        <boxGeometry args={[0.24, 0.36, 1.38]} />
        <meshStandardMaterial
          color={intCfg.dashColor}
          roughness={intCfg.roughness}
          metalness={intCfg.metalness}
        />
      </mesh>
      {/* Floating infotainment display bezel */}
      <mesh position={[0, 0.68, 0.68]} rotation={[-0.36, 0, 0]}>
        <boxGeometry args={[0.24, 0.34, 0.04]} />
        <meshStandardMaterial color="#181b20" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Glowing vertical infotainment screen */}
      <mesh position={[0, 0.68, 0.658]} rotation={[-0.36, 0, 0]}>
        <planeGeometry args={[0.17, 0.24]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e293b"
          emissiveIntensity={0.85}
          roughness={0.12}
        />
      </mesh>
      {/* Console contrast trim strips */}
      {[-0.125, 0.125].map((x, idx) => (
        <mesh key={idx} position={[x, 0.56, 0.2]}>
          <boxGeometry args={[0.018, 0.03, 1.25]} />
          <meshStandardMaterial color={intCfg.accentColor} roughness={0.4} metalness={0.25} />
        </mesh>
      ))}

      {/* Main dashboard cowl */}
      <mesh position={[0, 0.72, 0.84]}>
        <boxGeometry args={[1.38, 0.26, 0.42]} />
        <meshStandardMaterial
          color={intCfg.dashColor}
          roughness={intCfg.roughness}
          metalness={intCfg.metalness}
        />
      </mesh>
      {/* Dashboard contrast accent trim bar */}
      <mesh position={[0, 0.72, 0.625]}>
        <boxGeometry args={[1.32, 0.045, 0.025]} />
        <meshStandardMaterial color={intCfg.accentColor} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Digital instrument binnacle behind steering wheel */}
      <mesh position={[-0.36, 0.84, 0.74]}>
        <boxGeometry args={[0.36, 0.14, 0.18]} />
        <meshStandardMaterial color="#14161a" roughness={0.6} />
      </mesh>
      <mesh position={[-0.36, 0.835, 0.648]}>
        <planeGeometry args={[0.29, 0.095]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive="#2563eb"
          emissiveIntensity={0.65}
          roughness={0.15}
        />
      </mesh>

      {/* Driver flat-bottom sport steering wheel */}
      <group position={[-0.36, 0.78, 0.44]} rotation={[0.24, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.165, 0.022, 16, 36]} />
          <meshStandardMaterial
            color={intCfg.primaryColor}
            roughness={intCfg.roughness}
            metalness={0.1}
          />
        </mesh>
        {/* Top 12-o'clock motorsport marker */}
        <mesh position={[0, 0.165, 0]}>
          <boxGeometry args={[0.026, 0.048, 0.048]} />
          <meshStandardMaterial color={intCfg.accentColor} roughness={0.35} />
        </mesh>
        {/* Steering hub & spokes */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.04, 24]} />
          <meshStandardMaterial color="#1e2228" roughness={0.45} metalness={0.4} />
        </mesh>
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[0.29, 0.028, 0.02]} />
          <meshStandardMaterial color="#303642" metalness={0.65} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.085, 0]}>
          <boxGeometry args={[0.032, 0.14, 0.02]} />
          <meshStandardMaterial color="#303642" metalness={0.65} roughness={0.3} />
        </mesh>
        {/* Steering column */}
        <mesh position={[0, -0.02, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.038, 0.24, 16]} />
          <meshStandardMaterial color="#15171c" roughness={0.6} />
        </mesh>
      </group>

      {/* Air vents */}
      {[-0.58, -0.14, 0.14, 0.58].map((x, i) => (
        <mesh key={i} position={[x, 0.77, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.025, 20]} />
          <meshStandardMaterial color="#8f98a6" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}

      {/* Sculpted bucket seats (Driver + Passenger) */}
      {[-0.36, 0.36].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.34, -0.14]}>
          {/* Seat cushion */}
          <mesh position={[0, 0.04, 0.12]}>
            <boxGeometry args={[0.46, 0.1, 0.52]} />
            <meshPhysicalMaterial
              color={intCfg.primaryColor}
              roughness={intCfg.roughness}
              metalness={intCfg.metalness}
              sheen={intCfg.sheen}
            />
          </mesh>
          {/* Side leg bolsters */}
          {[-0.22, 0.22].map((bx, bIdx) => (
            <mesh key={bIdx} position={[bx, 0.1, 0.1]}>
              <boxGeometry args={[0.07, 0.12, 0.48]} />
              <meshStandardMaterial color={intCfg.accentColor} roughness={intCfg.roughness} />
            </mesh>
          ))}
          {/* Recline backrest */}
          <mesh position={[0, 0.44, -0.16]} rotation={[-0.24, 0, 0]}>
            <boxGeometry args={[0.44, 0.72, 0.11]} />
            <meshPhysicalMaterial
              color={intCfg.primaryColor}
              roughness={intCfg.roughness}
              metalness={intCfg.metalness}
              sheen={intCfg.sheen}
            />
          </mesh>
          {/* Contrast shoulder accent inserts */}
          {[-0.18, 0.18].map((bx, bIdx) => (
            <mesh key={bIdx} position={[bx, 0.46, -0.14]} rotation={[-0.24, 0, 0]}>
              <boxGeometry args={[0.08, 0.62, 0.12]} />
              <meshStandardMaterial color={intCfg.accentColor} roughness={intCfg.roughness} />
            </mesh>
          ))}
          {/* Integrated headrest */}
          <mesh position={[0, 0.84, -0.25]} rotation={[-0.18, 0, 0]}>
            <boxGeometry args={[0.24, 0.18, 0.1]} />
            <meshStandardMaterial color={intCfg.primaryColor} roughness={intCfg.roughness} />
          </mesh>
        </group>
      ))}

      {/* Inner door trim cards */}
      {[-0.72, 0.72].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.54, 0.12]}>
          <mesh>
            <boxGeometry args={[0.08, 0.44, 1.32]} />
            <meshStandardMaterial color={intCfg.dashColor} roughness={intCfg.roughness} />
          </mesh>
          <mesh position={[xPos > 0 ? -0.045 : 0.045, 0.04, 0]}>
            <boxGeometry args={[0.015, 0.06, 1.1]} />
            <meshStandardMaterial color={intCfg.accentColor} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function McLarenP1Model({
  paint,
  interior,
  wheel,
  caliper,
  accessoryIds,
}: Omit<ProceduralVehicleProps, 'vehicleId'>) {
  const paintCfg = getPaintMaterialConfig(paint)

  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-2.22, 0.24)
    shape.lineTo(-2.15, 0.62)
    shape.quadraticCurveTo(-1.85, 0.9, -1.05, 0.95)
    shape.lineTo(-0.55, 0.98)
    shape.lineTo(0.82, 0.86)
    shape.quadraticCurveTo(1.62, 0.78, 2.24, 0.44)
    shape.lineTo(2.28, 0.22)
    shape.lineTo(-2.22, 0.22)
    shape.closePath()

    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 1.72,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.14,
    })
    extrude.center()
    // Orient lengthwise along Z axis (front = +Z)
    extrude.rotateY(-Math.PI / 2)
    return extrude
  }, [])

  const hasWing = accessoryIds.includes('active-wing')
  const hasSplitter = accessoryIds.includes('carbon-splitter')
  const hasRoofScoop = accessoryIds.includes('roof-scoop')

  return (
    <group name="McLarenP1Procedural">
      {/* Main sculpted hypercar body */}
      <mesh geometry={bodyGeometry} position={[0, 0.56, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={paintCfg.color}
          metalness={paintCfg.metalness}
          roughness={paintCfg.roughness}
          clearcoat={paintCfg.clearcoat}
          clearcoatRoughness={paintCfg.clearcoatRoughness}
        />
      </mesh>

      {/* Sculpted muscular front & rear fender haunches */}
      {[
        [-0.78, 0.54, 1.32],
        [0.78, 0.54, 1.32],
        [-0.82, 0.62, -1.3],
        [0.82, 0.62, -1.3],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} scale={[0.46, 0.42, 1.15]} castShadow>
          <sphereGeometry args={[0.68, 28, 20]} />
          <meshPhysicalMaterial
            color={paintCfg.color}
            metalness={paintCfg.metalness}
            roughness={paintCfg.roughness}
            clearcoat={paintCfg.clearcoat}
            clearcoatRoughness={paintCfg.clearcoatRoughness}
          />
        </mesh>
      ))}

      {/* Teardrop glass cabin canopy & roof arch */}
      <mesh position={[0, 1.01, -0.02]} scale={[1.38, 0.52, 1.92]} castShadow>
        <sphereGeometry args={[0.56, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial
          color="#10151c"
          transparent
          opacity={0.34}
          roughness={0.05}
          metalness={0.15}
          clearcoat={1}
          depthWrite={false}
        />
      </mesh>
      {/* Carbon roof spine */}
      <mesh position={[0, 1.18, -0.22]} castShadow>
        <boxGeometry args={[0.92, 0.06, 1.05]} />
        <meshPhysicalMaterial
          color="#1b1e24"
          roughness={0.28}
          metalness={0.35}
          clearcoat={0.85}
        />
      </mesh>

      {/* Signature deep side air intakes (carbon) */}
      {[-0.95, 0.95].map((x, idx) => (
        <mesh key={idx} position={[x, 0.54, -0.22]}>
          <boxGeometry args={[0.09, 0.36, 1.18]} />
          <meshStandardMaterial color="#15181d" roughness={0.42} metalness={0.35} />
        </mesh>
      ))}

      {/* Lower carbon chassis sill & rear diffuser */}
      <mesh position={[0, 0.17, 0]} castShadow>
        <boxGeometry args={[1.92, 0.11, 4.46]} />
        <meshStandardMaterial color="#16191e" roughness={0.45} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.27, -2.18]}>
        <boxGeometry args={[1.76, 0.24, 0.18]} />
        <meshStandardMaterial color="#121418" roughness={0.4} metalness={0.45} />
      </mesh>
      {/* Center twin-exit titanium exhaust */}
      <mesh position={[0, 0.44, -2.26]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.12, 0.16, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.22} />
      </mesh>

      {/* Crescent LED headlights */}
      {[-0.64, 0.64].map((x, idx) => (
        <group key={idx} position={[x, 0.58, 2.12]} rotation={[0.18, x > 0 ? 0.26 : -0.26, 0]}>
          <mesh>
            <boxGeometry args={[0.38, 0.055, 0.18]} />
            <meshStandardMaterial color="#111318" roughness={0.2} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.006, 0.085]}>
            <boxGeometry args={[0.32, 0.025, 0.03]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f8fafc"
              emissiveIntensity={2.2}
            />
          </mesh>
        </group>
      ))}

      {/* Signature rear LED ribbon taillight */}
      <mesh position={[0, 0.72, -2.24]}>
        <boxGeometry args={[1.56, 0.038, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={2.6} />
      </mesh>

      {/* Side mirrors */}
      {[-1.04, 1.04].map((x, idx) => (
        <group key={idx} position={[x, 0.88, 0.62]}>
          <mesh position={[x > 0 ? -0.08 : 0.08, -0.05, 0]}>
            <boxGeometry args={[0.14, 0.035, 0.05]} />
            <meshStandardMaterial color="#181b20" roughness={0.35} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.16, 0.08, 0.11]} />
            <meshPhysicalMaterial
              color={paintCfg.color}
              metalness={paintCfg.metalness}
              roughness={paintCfg.roughness}
              clearcoat={paintCfg.clearcoat}
            />
          </mesh>
        </group>
      ))}

      {/* Full interactive interior cabin */}
      <SportsCabin interior={interior} scale={0.98} yOffset={0.02} zOffset={0.06} />

      {/* 4 Wheels */}
      <WheelAssembly position={[-0.93, 0.35, 1.34]} radius={0.35} width={0.28} side="left" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[0.93, 0.35, 1.34]} radius={0.35} width={0.28} side="right" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[-0.96, 0.37, -1.32]} radius={0.37} width={0.33} side="left" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[0.96, 0.37, -1.32]} radius={0.37} width={0.33} side="right" wheel={wheel} caliper={caliper} />

      {/* Modular Accessory: Active Carbon Rear Wing (Deployed) */}
      {hasWing && (
        <group name="ActiveRearWing" position={[0, 1.12, -2.06]}>
          <mesh castShadow rotation={[0.14, 0, 0]}>
            <boxGeometry args={[1.74, 0.045, 0.34]} />
            <meshPhysicalMaterial color="#1b1e24" roughness={0.25} metalness={0.38} clearcoat={0.9} />
          </mesh>
          {/* Endplates */}
          {[-0.87, 0.87].map((x, idx) => (
            <mesh key={idx} position={[x, -0.02, 0]}>
              <boxGeometry args={[0.025, 0.18, 0.38]} />
              <meshStandardMaterial color="#14171c" roughness={0.35} metalness={0.4} />
            </mesh>
          ))}
          {/* Dual hydraulic struts */}
          {[-0.44, 0.44].map((x, idx) => (
            <mesh key={idx} position={[x, -0.18, 0.05]} rotation={[-0.22, 0, 0]}>
              <boxGeometry args={[0.045, 0.36, 0.09]} />
              <meshStandardMaterial color="#272b33" metalness={0.75} roughness={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Modular Accessory: Extended Front Carbon Splitter */}
      {hasSplitter && (
        <group name="FrontCarbonSplitter" position={[0, 0.15, 2.28]}>
          <mesh castShadow>
            <boxGeometry args={[1.98, 0.035, 0.38]} />
            <meshPhysicalMaterial color="#181b21" roughness={0.26} metalness={0.35} clearcoat={0.8} />
          </mesh>
          {[-0.99, 0.99].map((x, idx) => (
            <mesh key={idx} position={[x, 0.08, -0.06]}>
              <boxGeometry args={[0.025, 0.14, 0.24]} />
              <meshStandardMaterial color="#181b21" roughness={0.35} />
            </mesh>
          ))}
        </group>
      )}

      {/* Modular Accessory: Exposed Carbon Roof Scoop */}
      {hasRoofScoop && (
        <group name="CarbonRoofScoop" position={[0, 1.24, -0.45]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.12, 0.68]} />
            <meshPhysicalMaterial color="#1b1e24" roughness={0.25} metalness={0.4} clearcoat={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.345]}>
            <boxGeometry args={[0.31, 0.08, 0.02]} />
            <meshStandardMaterial color="#090a0d" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function LotusExigeModel({
  paint,
  interior,
  wheel,
  caliper,
  accessoryIds,
}: Omit<ProceduralVehicleProps, 'vehicleId'>) {
  const paintCfg = getPaintMaterialConfig(paint)

  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-1.86, 0.22)
    shape.lineTo(-1.82, 0.66)
    shape.quadraticCurveTo(-1.42, 0.88, -0.78, 0.9)
    shape.lineTo(0.68, 0.82)
    shape.quadraticCurveTo(1.38, 0.72, 1.9, 0.42)
    shape.lineTo(1.92, 0.2)
    shape.closePath()

    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 1.5,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.11,
      bevelThickness: 0.12,
    })
    extrude.center()
    extrude.rotateY(-Math.PI / 2)
    return extrude
  }, [])

  const hasWing = accessoryIds.includes('gt-wing')
  const hasSplitter = accessoryIds.includes('front-splitter')
  const hasRoofScoop = accessoryIds.includes('roof-scoop')

  return (
    <group name="LotusExigeProcedural">
      <mesh geometry={bodyGeometry} position={[0, 0.52, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={paintCfg.color}
          metalness={paintCfg.metalness}
          roughness={paintCfg.roughness}
          clearcoat={paintCfg.clearcoat}
          clearcoatRoughness={paintCfg.clearcoatRoughness}
        />
      </mesh>

      {/* Rounded Lotus fenders */}
      {[
        [-0.68, 0.52, 1.14],
        [0.68, 0.52, 1.14],
        [-0.72, 0.56, -1.12],
        [0.72, 0.56, -1.12],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} scale={[0.42, 0.42, 0.98]} castShadow>
          <sphereGeometry args={[0.62, 26, 20]} />
          <meshPhysicalMaterial
            color={paintCfg.color}
            metalness={paintCfg.metalness}
            roughness={paintCfg.roughness}
            clearcoat={paintCfg.clearcoat}
            clearcoatRoughness={paintCfg.clearcoatRoughness}
          />
        </mesh>
      ))}

      {/* Compact greenhouse canopy */}
      <mesh position={[0, 0.95, -0.05]} scale={[1.22, 0.48, 1.56]} castShadow>
        <sphereGeometry args={[0.54, 32, 22, 0, Math.PI * 2, 0, Math.PI * 0.54]} />
        <meshPhysicalMaterial
          color="#11161e"
          transparent
          opacity={0.34}
          roughness={0.06}
          clearcoat={1}
          depthWrite={false}
        />
      </mesh>
      {/* Painted hardtop roof panel */}
      <mesh position={[0, 1.12, -0.18]} castShadow>
        <boxGeometry args={[0.92, 0.06, 0.95]} />
        <meshPhysicalMaterial
          color={paintCfg.color}
          metalness={paintCfg.metalness}
          roughness={paintCfg.roughness}
          clearcoat={paintCfg.clearcoat}
        />
      </mesh>

      {/* Iconic Exige wide front intake grille + twin fog lamps */}
      <mesh position={[0, 0.34, 1.94]}>
        <boxGeometry args={[1.08, 0.22, 0.08]} />
        <meshStandardMaterial color="#14171c" roughness={0.65} metalness={0.35} />
      </mesh>
      {[-0.3, 0.3].map((x, idx) => (
        <mesh key={idx} position={[x, 0.34, 1.985]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.03, 18]} />
          <meshStandardMaterial color="#ffffff" emissive="#fef3c7" emissiveIntensity={1.6} />
        </mesh>
      ))}

      {/* Iconic teardrop Lotus headlights */}
      {[-0.6, 0.6].map((x, idx) => (
        <mesh
          key={idx}
          position={[x, 0.62, 1.58]}
          rotation={[0.42, x > 0 ? 0.22 : -0.22, 0]}
          scale={[0.24, 0.14, 0.46]}
        >
          <sphereGeometry args={[0.55, 20, 16]} />
          <meshStandardMaterial color="#181c22" emissive="#e2e8f0" emissiveIntensity={0.45} roughness={0.12} />
        </mesh>
      ))}

      {/* Dual round Lotus taillights */}
      {[-0.58, -0.4, 0.4, 0.58].map((x, idx) => (
        <mesh key={idx} position={[x, 0.66, -1.93]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.04, 20]} />
          <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={2.4} />
        </mesh>
      ))}

      {/* Lower sill & rear diffuser */}
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[1.66, 0.1, 3.82]} />
        <meshStandardMaterial color="#16181d" roughness={0.5} />
      </mesh>

      {/* Side vents */}
      {[-0.84, 0.84].map((x, idx) => (
        <mesh key={idx} position={[x, 0.5, -0.35]}>
          <boxGeometry args={[0.06, 0.32, 0.52]} />
          <meshStandardMaterial color="#121418" roughness={0.55} />
        </mesh>
      ))}

      {/* Detailed compact cockpit */}
      <SportsCabin interior={interior} scale={0.86} yOffset={0.04} zOffset={0.04} />

      {/* 4 Wheels */}
      <WheelAssembly position={[-0.81, 0.31, 1.12]} radius={0.31} width={0.23} side="left" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[0.81, 0.31, 1.12]} radius={0.31} width={0.23} side="right" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[-0.84, 0.33, -1.12]} radius={0.33} width={0.27} side="left" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[0.84, 0.33, -1.12]} radius={0.33} width={0.27} side="right" wheel={wheel} caliper={caliper} />

      {/* Modular Accessory: Cup 240 Rear Wing */}
      {hasWing && (
        <group name="LotusCupWing" position={[0, 1.02, -1.78]}>
          <mesh castShadow rotation={[0.08, 0, 0]}>
            <boxGeometry args={[1.48, 0.04, 0.28]} />
            <meshPhysicalMaterial
              color={paintCfg.color}
              metalness={paintCfg.metalness}
              roughness={paintCfg.roughness}
              clearcoat={paintCfg.clearcoat}
            />
          </mesh>
          {[-0.74, 0.74].map((x, idx) => (
            <mesh key={idx} position={[x, -0.02, 0]}>
              <boxGeometry args={[0.025, 0.16, 0.32]} />
              <meshStandardMaterial color="#181b20" roughness={0.35} />
            </mesh>
          ))}
          {[-0.46, 0.46].map((x, idx) => (
            <mesh key={idx} position={[x, -0.14, 0.04]}>
              <boxGeometry args={[0.04, 0.28, 0.08]} />
              <meshStandardMaterial color="#272c35" metalness={0.75} roughness={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Modular Accessory: Front Carbon Splitter */}
      {hasSplitter && (
        <mesh position={[0, 0.14, 1.94]} castShadow>
          <boxGeometry args={[1.66, 0.032, 0.34]} />
          <meshStandardMaterial color="#181a1f" roughness={0.32} metalness={0.35} />
        </mesh>
      )}

      {/* Modular Accessory: Intercooler Roof Scoop */}
      {hasRoofScoop && (
        <group position={[0, 1.18, -0.35]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.12, 0.72]} />
            <meshPhysicalMaterial
              color={paintCfg.color}
              metalness={paintCfg.metalness}
              roughness={paintCfg.roughness}
              clearcoat={paintCfg.clearcoat}
            />
          </mesh>
          <mesh position={[0, -0.005, 0.365]}>
            <boxGeometry args={[0.3, 0.075, 0.02]} />
            <meshStandardMaterial color="#111317" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function HondaActyModel({
  paint,
  interior,
  wheel,
  caliper,
  accessoryIds,
}: Omit<ProceduralVehicleProps, 'vehicleId'>) {
  const paintCfg = getPaintMaterialConfig(paint)
  const intCfg = getInteriorMaterialConfig(interior)

  const hasBedRack = accessoryIds.includes('bed-rack')
  const hasToolbox = accessoryIds.includes('bed-toolbox')
  const hasTonneau = accessoryIds.includes('bed-tonneau')
  const hasLightbar = accessoryIds.includes('roof-lightbar')

  return (
    <group name="HondaActyProcedural">
      {/* Steel ladder chassis underbody */}
      <mesh position={[0, 0.38, -0.05]} castShadow>
        <boxGeometry args={[1.18, 0.14, 3.16]} />
        <meshStandardMaterial color="#1e2228" roughness={0.65} metalness={0.35} />
      </mesh>

      {/* Cab-over front lower body */}
      <mesh position={[0, 0.78, 0.94]} castShadow receiveShadow>
        <boxGeometry args={[1.42, 0.74, 1.24]} />
        <meshPhysicalMaterial
          color={paintCfg.color}
          metalness={paintCfg.metalness}
          roughness={paintCfg.roughness}
          clearcoat={paintCfg.clearcoat}
          clearcoatRoughness={paintCfg.clearcoatRoughness}
        />
      </mesh>

      {/* Cab rear wall behind seats */}
      <mesh position={[0, 1.38, 0.36]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.62, 0.1]} />
        <meshPhysicalMaterial
          color={paintCfg.color}
          metalness={paintCfg.metalness}
          roughness={paintCfg.roughness}
          clearcoat={paintCfg.clearcoat}
        />
      </mesh>

      {/* Cab roof panel */}
      <mesh position={[0, 1.7, 0.88]} castShadow receiveShadow>
        <boxGeometry args={[1.38, 0.08, 1.12]} />
        <meshPhysicalMaterial
          color={paintCfg.color}
          metalness={paintCfg.metalness}
          roughness={paintCfg.roughness}
          clearcoat={paintCfg.clearcoat}
        />
      </mesh>

      {/* Cab A-pillars */}
      {[-0.66, 0.66].map((x, idx) => (
        <mesh key={idx} position={[x, 1.4, 1.44]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.075, 0.62, 0.075]} />
          <meshPhysicalMaterial
            color={paintCfg.color}
            metalness={paintCfg.metalness}
            roughness={paintCfg.roughness}
            clearcoat={paintCfg.clearcoat}
          />
        </mesh>
      ))}

      {/* Front windshield glass */}
      <mesh position={[0, 1.4, 1.46]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[1.26, 0.56]} />
        <meshPhysicalMaterial
          color="#1e293b"
          transparent
          opacity={0.26}
          roughness={0.05}
          clearcoat={1}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Windshield wipers */}
      {[-0.24, 0.24].map((x, idx) => (
        <mesh key={idx} position={[x, 1.17, 1.54]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.42, 0.018, 0.018]} />
          <meshStandardMaterial color="#14161a" roughness={0.6} />
        </mesh>
      ))}

      {/* Iconic Kei truck front grille & bumper */}
      <mesh position={[0, 0.66, 1.575]}>
        <boxGeometry args={[0.64, 0.22, 0.04]} />
        <meshStandardMaterial color="#181b20" roughness={0.65} />
      </mesh>
      {/* Front rectangular headlights + amber turn signals */}
      {[-0.5, 0.5].map((x, idx) => (
        <group key={idx} position={[x, 0.82, 1.565]}>
          <mesh>
            <boxGeometry args={[0.3, 0.16, 0.04]} />
            <meshStandardMaterial color="#f8fafc" emissive="#fef9c3" emissiveIntensity={1.4} roughness={0.15} />
          </mesh>
          <mesh position={[x > 0 ? 0.08 : -0.08, -0.095, 0.004]}>
            <boxGeometry args={[0.14, 0.05, 0.035]} />
            <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
      {/* Front ACTY license plate */}
      <mesh position={[-0.34, 0.52, 1.585]}>
        <boxGeometry args={[0.26, 0.13, 0.02]} />
        <meshStandardMaterial color="#232730" roughness={0.4} />
      </mesh>
      {/* Side mirrors */}
      {[-0.82, 0.82].map((x, idx) => (
        <mesh key={idx} position={[x, 1.32, 1.34]} castShadow>
          <boxGeometry args={[0.12, 0.18, 0.06]} />
          <meshPhysicalMaterial
            color={paintCfg.color}
            metalness={paintCfg.metalness}
            roughness={paintCfg.roughness}
          />
        </mesh>
      ))}

      {/* RHD Kei Utility Cabin Interior */}
      <group name="ActyCabinInterior">
        {/* Floor */}
        <mesh position={[0, 0.66, 0.92]}>
          <boxGeometry args={[1.3, 0.06, 1.05]} />
          <meshStandardMaterial color="#1a1d22" roughness={0.9} />
        </mesh>
        {/* Flat utilitarian dashboard */}
        <mesh position={[0, 1.04, 1.35]}>
          <boxGeometry args={[1.3, 0.24, 0.34]} />
          <meshStandardMaterial color={intCfg.dashColor} roughness={intCfg.roughness} />
        </mesh>
        {/* Gauge cluster (RHD on right side) */}
        <mesh position={[0.32, 1.15, 1.28]}>
          <boxGeometry args={[0.32, 0.13, 0.18]} />
          <meshStandardMaterial color="#1a1d24" roughness={0.6} />
        </mesh>
        <mesh position={[0.32, 1.14, 1.188]}>
          <planeGeometry args={[0.26, 0.09]} />
          <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
        {/* Steering wheel (RHD on +X side) */}
        <group position={[0.32, 1.08, 1.06]} rotation={[0.55, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.16, 0.018, 14, 28]} />
            <meshStandardMaterial color="#1f2329" roughness={0.65} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.035, 18]} />
            <meshStandardMaterial color={intCfg.accentColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.28, 0.025, 0.018]} />
            <meshStandardMaterial color="#2a2f38" roughness={0.6} />
          </mesh>
        </group>
        {/* Dual Kei seats */}
        {[-0.33, 0.33].map((x, idx) => (
          <group key={idx} position={[x, 0.74, 0.68]}>
            <mesh position={[0, 0.05, 0.08]}>
              <boxGeometry args={[0.48, 0.1, 0.46]} />
              <meshStandardMaterial color={intCfg.primaryColor} roughness={intCfg.roughness} />
            </mesh>
            <mesh position={[0, 0.38, -0.14]} rotation={[-0.1, 0, 0]}>
              <boxGeometry args={[0.46, 0.56, 0.1]} />
              <meshStandardMaterial color={intCfg.primaryColor} roughness={intCfg.roughness} />
            </mesh>
            <mesh position={[0, 0.72, -0.17]}>
              <boxGeometry args={[0.22, 0.14, 0.09]} />
              <meshStandardMaterial color={intCfg.accentColor} roughness={intCfg.roughness} />
            </mesh>
          </group>
        ))}
        {/* Center gear shift lever */}
        <mesh position={[0, 0.88, 1.02]} rotation={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.36, 12]} />
          <meshStandardMaterial color="#2c313a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.06, 1.06]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color={intCfg.accentColor} roughness={0.35} />
        </mesh>
      </group>

      {/* Rear Utility Flatbed */}
      <group name="RearFlatbed" position={[0, 0.58, -0.72]}>
        {/* Bed deck */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.44, 0.08, 1.96]} />
          <meshPhysicalMaterial
            color={paintCfg.color}
            metalness={paintCfg.metalness}
            roughness={paintCfg.roughness}
            clearcoat={paintCfg.clearcoat}
          />
        </mesh>
        {/* Dark non-slip bed liner floor */}
        <mesh position={[0, 0.045, 0]} receiveShadow>
          <boxGeometry args={[1.34, 0.015, 1.88]} />
          <meshStandardMaterial color="#1f2329" roughness={0.88} />
        </mesh>
        {/* Left & Right drop-side walls */}
        {[-0.7, 0.7].map((x, idx) => (
          <mesh key={idx} position={[x, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.055, 0.34, 1.96]} />
            <meshPhysicalMaterial
              color={paintCfg.color}
              metalness={paintCfg.metalness}
              roughness={paintCfg.roughness}
              clearcoat={paintCfg.clearcoat}
            />
          </mesh>
        ))}
        {/* Rear tailgate */}
        <mesh position={[0, 0.2, -0.96]} castShadow receiveShadow>
          <boxGeometry args={[1.44, 0.34, 0.055]} />
          <meshPhysicalMaterial
            color={paintCfg.color}
            metalness={paintCfg.metalness}
            roughness={paintCfg.roughness}
            clearcoat={paintCfg.clearcoat}
          />
        </mesh>
        {/* Rear bumper + taillights */}
        {[-0.5, 0.5].map((x, idx) => (
          <mesh key={idx} position={[x, -0.06, -0.98]}>
            <boxGeometry args={[0.24, 0.075, 0.04]} />
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={1.6} />
          </mesh>
        ))}
        {/* Headache guard behind cab */}
        <group position={[0, 0.52, 0.94]}>
          {[-0.62, 0.62].map((x, idx) => (
            <mesh key={idx} position={[x, 0, 0]} castShadow>
              <cylinderGeometry args={[0.024, 0.024, 1.0, 12]} />
              <meshStandardMaterial color="#23272f" metalness={0.6} roughness={0.45} />
            </mesh>
          ))}
          <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 1.28, 12]} />
            <meshStandardMaterial color="#23272f" metalness={0.6} roughness={0.45} />
          </mesh>
        </group>

        {/* Modular Accessory 1: Tubular Steel Cargo Rack */}
        {hasBedRack && (
          <group name="ActyBedRack" position={[0, 0.36, 0]}>
            {/* 4 corner uprights */}
            {[
              [-0.66, 0.4, 0.86],
              [0.66, 0.4, 0.86],
              [-0.66, 0.4, -0.88],
              [0.66, 0.4, -0.88],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]} castShadow>
                <cylinderGeometry args={[0.024, 0.024, 0.82, 12]} />
                <meshStandardMaterial color="#1d2026" metalness={0.65} roughness={0.42} />
              </mesh>
            ))}
            {/* Longitudinal side rails */}
            {[-0.66, 0.66].map((x, idx) => (
              <mesh key={idx} position={[x, 0.8, -0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.024, 0.024, 1.82, 12]} />
                <meshStandardMaterial color="#1d2026" metalness={0.65} roughness={0.42} />
              </mesh>
            ))}
            {/* Crossbars */}
            {[-0.86, 0, 0.84].map((z, idx) => (
              <mesh key={idx} position={[0, 0.8, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.024, 0.024, 1.36, 12]} />
                <meshStandardMaterial color="#1d2026" metalness={0.65} roughness={0.42} />
              </mesh>
            ))}
          </group>
        )}

        {/* Modular Accessory 2: Aluminum Diamond-Plate Toolbox */}
        {hasToolbox && (
          <group name="ActyToolbox" position={[0, 0.24, 0.58]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.26, 0.38, 0.52]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.86} roughness={0.28} />
            </mesh>
            {/* Lid overhang */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[1.3, 0.05, 0.56]} />
              <meshStandardMaterial color="#dbe3ed" metalness={0.9} roughness={0.22} />
            </mesh>
            {/* Latch handle */}
            <mesh position={[0, 0.06, -0.265]}>
              <boxGeometry args={[0.14, 0.06, 0.02]} />
              <meshStandardMaterial color="#1f242b" metalness={0.7} roughness={0.35} />
            </mesh>
          </group>
        )}

        {/* Modular Accessory 3: Soft Roll-Up Tonneau Cover */}
        {hasTonneau && (
          <mesh name="ActyTonneauCover" position={[0, 0.37, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.38, 0.035, 1.9]} />
            <meshStandardMaterial color="#1c1f24" roughness={0.85} metalness={0.05} />
          </mesh>
        )}
      </group>

      {/* Modular Accessory 4: Cab Roof LED Work Lightbar */}
      {hasLightbar && (
        <group name="ActyLightbar" position={[0, 1.79, 1.36]}>
          <mesh castShadow>
            <boxGeometry args={[1.06, 0.08, 0.1]} />
            <meshStandardMaterial color="#181b20" metalness={0.65} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.052]}>
            <planeGeometry args={[0.98, 0.048]} />
            <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={3.0} />
          </mesh>
        </group>
      )}

      {/* 4 Compact 12" Utility Wheels */}
      <WheelAssembly position={[-0.68, 0.27, 0.94]} radius={0.27} width={0.18} side="left" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[0.68, 0.27, 0.94]} radius={0.27} width={0.18} side="right" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[-0.68, 0.27, -0.96]} radius={0.27} width={0.18} side="left" wheel={wheel} caliper={caliper} />
      <WheelAssembly position={[0.68, 0.27, -0.96]} radius={0.27} width={0.18} side="right" wheel={wheel} caliper={caliper} />
    </group>
  )
}

export function ProceduralVehicle(props: ProceduralVehicleProps) {
  switch (props.vehicleId) {
    case 'lotus-exige-240':
      return <LotusExigeModel {...props} />
    case 'honda-acty-ha3':
      return <HondaActyModel {...props} />
    case 'mclaren-p1':
    default:
      return <McLarenP1Model {...props} />
  }
}
