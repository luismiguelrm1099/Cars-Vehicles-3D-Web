import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import type { CameraPresetId, ShowroomTheme, VehicleId } from '../types/configurator'
import { getVehicleById } from '../config/vehicles'

interface ShowroomEnvironmentProps {
  theme: ShowroomTheme
  activeCamera: CameraPresetId
  activeVehicleId: VehicleId
  shadowKey: string
  transparentCapture?: boolean
}

function AgencyArchitecture() {
  const radialRibAngles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4),
    []
  )

  const ceilingSlats = useMemo(
    () => Array.from({ length: 18 }, (_, i) => -8.5 + i * 1.0),
    []
  )

  return (
    <group name="AgencyShowroomArchitecture">
      {/* Dark matte slate dealership outer floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]} receiveShadow>
        <planeGeometry args={[46, 46]} />
        <meshStandardMaterial color="#16181c" roughness={0.84} metalness={0.08} />
      </mesh>

      <gridHelper
        args={[36, 24, '#22262e', '#1c1f26']}
        position={[0, -0.042, 0]}
      />

      {/* Honed satin architectural white circular turntable plinth */}
      <mesh position={[0, -0.022, 0]} receiveShadow>
        <cylinderGeometry args={[3.42, 3.48, 0.044, 72]} />
        <meshPhysicalMaterial
          color="#e8eaee"
          roughness={0.44}
          metalness={0.04}
          clearcoat={0.14}
          clearcoatRoughness={0.38}
        />
      </mesh>

      {/* Outer brushed-aluminum turntable trim ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[3.35, 3.43, 72]} />
        <meshStandardMaterial color="#8f96a2" metalness={0.72} roughness={0.38} />
      </mesh>

      {/* Inner concentric turntable seam ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.55, 2.58, 72]} />
        <meshStandardMaterial color="#c6cbd3" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Curved matte architectural plaster cyclorama wall */}
      <mesh position={[0, 2.35, -0.25]}>
        <cylinderGeometry args={[5.55, 5.55, 4.8, 64, 1, true, Math.PI * 0.62, Math.PI * 0.96]} />
        <meshStandardMaterial
          color="#e5e7eb"
          roughness={0.94}
          metalness={0.0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Dark recessed architectural baseboard skirting */}
      <mesh position={[0, 0.06, -0.25]}>
        <cylinderGeometry args={[5.52, 5.52, 0.14, 64, 1, true, Math.PI * 0.62, Math.PI * 0.96]} />
        <meshStandardMaterial
          color="#1a1d23"
          roughness={0.72}
          metalness={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[14, 14, 7.5, 48, 1, true]} />
        <meshStandardMaterial color="#0f1115" roughness={0.95} side={THREE.BackSide} />
      </mesh>

      {/* Dark slatted showroom ceiling */}
      <group position={[0, 4.65, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color="#0e1014" roughness={0.92} />
        </mesh>
        {ceilingSlats.map((zPos, i) => (
          <mesh key={i} position={[0, -0.06, zPos]}>
            <boxGeometry args={[20, 0.08, 0.12]} />
            <meshStandardMaterial color="#191c22" roughness={0.76} metalness={0.12} />
          </mesh>
        ))}
      </group>

      {/* Overhead circular recessed dealership light canopy */}
      <group position={[0, 4.12, 0]}>
        <mesh>
          <cylinderGeometry args={[3.72, 3.72, 0.65, 64, 1, true]} />
          <meshStandardMaterial color="#e2e5ea" roughness={0.75} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
          <ringGeometry args={[2.68, 3.72, 64]} />
          <meshStandardMaterial color="#d7dbe2" roughness={0.72} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.26, 0]}>
          <circleGeometry args={[2.68, 64]} />
          <meshBasicMaterial color="#f1f5f9" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.27, 0]}>
          <ringGeometry args={[2.62, 2.7, 64]} />
          <meshStandardMaterial color="#8f96a2" metalness={0.65} roughness={0.38} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.27, 0]}>
          <ringGeometry args={[0.58, 0.62, 48]} />
          <meshStandardMaterial color="#b4bcc8" metalness={0.4} roughness={0.5} />
        </mesh>
        {radialRibAngles.map((angle, idx) => (
          <mesh key={idx} position={[0, -0.27, 0]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.025, 0.015, 5.28]} />
            <meshStandardMaterial color="#c4cbd6" roughness={0.55} metalness={0.25} />
          </mesh>
        ))}
        {radialRibAngles.map((angle, idx) => (
          <mesh
            key={`spot-${idx}`}
            position={[Math.cos(angle) * 2.86, -0.325, Math.sin(angle) * 2.86]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.055, 16]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        ))}
      </group>

      {/* Architectural glass showroom office partition */}
      <group position={[5.6, 2.1, -1.6]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 2.05, 0]}>
          <boxGeometry args={[4.4, 0.7, 0.25]} />
          <meshStandardMaterial color="#181b20" roughness={0.62} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <planeGeometry args={[4.2, 3.9]} />
          <meshPhysicalMaterial
            color="#8ea6a6"
            transparent
            opacity={0.14}
            roughness={0.12}
            metalness={0.08}
          />
        </mesh>
        {[-2.1, -0.7, 0.7, 2.1].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, -0.2, 0.01]}>
            <boxGeometry args={[0.04, 3.9, 0.05]} />
            <meshStandardMaterial color="#272b33" metalness={0.65} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function LightStudioArchitecture() {
  return (
    <group name="LightStudioArchitecture">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <circleGeometry args={[28, 72]} />
        <meshStandardMaterial color="#eff1f4" roughness={0.9} metalness={0.0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[3.2, 3.22, 72]} />
        <meshBasicMaterial color="#d5dae2" transparent opacity={0.75} />
      </mesh>
    </group>
  )
}

function DarkShowroomArchitecture() {
  return (
    <group name="DarkShowroomArchitecture">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.032, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0b0d10" roughness={0.82} metalness={0.14} />
      </mesh>
      <mesh position={[0, -0.016, 0]} receiveShadow>
        <cylinderGeometry args={[3.35, 3.45, 0.032, 72]} />
        <meshStandardMaterial color="#14171c" roughness={0.62} metalness={0.18} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[3.32, 3.35, 72]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.32} />
      </mesh>
    </group>
  )
}

export function ShowroomEnvironment({
  theme,
  activeCamera,
  activeVehicleId,
  shadowKey,
  transparentCapture = false,
}: ShowroomEnvironmentProps) {
  const cabinLightRef = useRef<THREE.PointLight>(null)
  const vehicle = getVehicleById(activeVehicleId)
  const interiorPos = vehicle.cameras.interior.position

  const bgColor =
    theme === 'light' ? '#eff1f4' : theme === 'dark' ? '#0b0d10' : '#14171c'

  const envIntensity = theme === 'dark' ? 0.65 : theme === 'light' ? 0.68 : 0.72

  useFrame((_, delta) => {
    if (!cabinLightRef.current) return
    const targetIntensity = activeCamera === 'interior' ? 1.15 : 0.16
    cabinLightRef.current.intensity = THREE.MathUtils.lerp(
      cabinLightRef.current.intensity,
      targetIntensity,
      Math.min(delta * 5, 1)
    )
  })

  return (
    <>
      {!transparentCapture && <color attach="background" args={[bgColor]} />}
      {!transparentCapture && theme === 'light' && <fog attach="fog" args={['#eff1f4', 14, 28]} />}
      {!transparentCapture && theme === 'dark' && <fog attach="fog" args={['#0b0d10', 12, 26]} />}

      {/* High-contrast automotive photography light-bank studio rig (512px IBL) */}
      <Environment resolution={512} environmentIntensity={envIntensity}>
        {/* Long central overhead automotive softbox strip (carves crisp horizon highlight along hood/roof) */}
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ffffff"
          position={[0, 5.8, 0.4]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[2.6, 11.5, 1]}
        />
        {/* Secondary parallel rim softbox bars */}
        <Lightformer
          form="rect"
          intensity={1.55}
          color="#f4f7fb"
          position={[3.8, 4.4, 0]}
          rotation={[Math.PI / 2, 0.45, 0]}
          scale={[1.4, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.35}
          color="#eef3fa"
          position={[-3.8, 4.4, 0]}
          rotation={[Math.PI / 2, -0.45, 0]}
          scale={[1.4, 10, 1]}
        />
        {/* Sculpting flank key strip (reveals door curves and fender muscularity) */}
        <Lightformer
          form="rect"
          intensity={1.7}
          color="#fffdf8"
          position={[7.2, 1.85, 2.2]}
          rotation={[0, -Math.PI / 2.2, 0]}
          scale={[10, 1.35, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#e5edf7"
          position={[-7.2, 1.85, -1.6]}
          rotation={[0, Math.PI / 2.2, 0]}
          scale={[10, 1.35, 1]}
        />
        {/* Front fill softbox so front grille/emblem reads clearly */}
        <Lightformer
          form="rect"
          intensity={1.15}
          color="#ffffff"
          position={[0, 2.4, 7.5]}
          rotation={[0, Math.PI, 0]}
          scale={[8, 2.2, 1]}
        />
        {/* Dark negative-fill ground band for authentic automotive contrast */}
        <Lightformer
          form="rect"
          intensity={0.22}
          color="#1e2430"
          position={[0, -2.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[20, 20, 1]}
        />
      </Environment>

      {/* Physical key + rim directional lights */}
      <hemisphereLight
        args={[
          theme === 'dark' ? '#d4dce8' : '#f8fafc',
          theme === 'light' ? '#cfd4dc' : '#181c22',
          theme === 'dark' ? 0.34 : 0.62,
        ]}
      />

      <directionalLight
        position={[4.8, 7.8, 5.2]}
        intensity={theme === 'dark' ? 1.4 : 1.65}
        color="#fffdf8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0003}
        shadow-normalBias={0.025}
      />

      <directionalLight
        position={[-5.2, 4.4, -4.5]}
        intensity={theme === 'dark' ? 0.72 : 0.6}
        color={theme === 'dark' ? '#d4e2f7' : '#f1f5f9'}
      />

      <pointLight
        ref={cabinLightRef}
        position={[interiorPos[0] * 0.4, interiorPos[1] + 0.22, interiorPos[2] + 0.12]}
        intensity={0.16}
        distance={4.5}
        decay={2}
        color="#fff8ef"
      />

      {/* Dual-layer baked ContactShadows: tight deep tire occlusion + soft ambient studio shadow */}
      <ContactShadows
        key={`${shadowKey}-tight`}
        frames={1}
        position={[0, 0.003, 0]}
        opacity={theme === 'dark' ? 0.92 : 0.78}
        scale={8.2}
        blur={1.15}
        far={1.35}
        resolution={512}
        color="#05070a"
      />
      <ContactShadows
        key={`${shadowKey}-soft`}
        frames={1}
        position={[0, 0.002, 0]}
        opacity={theme === 'dark' ? 0.45 : 0.36}
        scale={10.5}
        blur={2.8}
        far={3.0}
        resolution={256}
        color="#0f141c"
      />

      {!transparentCapture && theme === 'agency' && <AgencyArchitecture />}
      {!transparentCapture && theme === 'light' && <LightStudioArchitecture />}
      {!transparentCapture && theme === 'dark' && <DarkShowroomArchitecture />}
    </>
  )
}
