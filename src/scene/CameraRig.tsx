import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { getVehicleById } from '../config/vehicles'
import { useConfiguratorStore } from '../store/useConfiguratorStore'

export function CameraRig() {
  const controlsRef = useRef<CameraControls>(null)
  const isFirstMount = useRef(true)

  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const activeCamera = useConfiguratorStore((s) => s.activeCamera)
  const cameraRequestNonce = useConfiguratorStore((s) => s.cameraRequestNonce)
  const autoRotate = useConfiguratorStore((s) => s.autoRotate)

  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const vehicle = getVehicleById(activeVehicleId)
    const preset = vehicle.cameras[activeCamera] ?? vehicle.cameras.hero
    const isInterior = activeCamera === 'interior'
    const aspect = size.width / Math.max(1, size.height)
    const portraitScale = !isInterior && aspect < 0.9 ? 1.38 : 1.0

    // Adjust camera lens properties for crisp interior viewing vs exterior compression
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = preset.fov ?? (isInterior ? 56 : 36)
      camera.near = isInterior ? 0.04 : 0.1
      camera.updateProjectionMatrix()
    }

    if (isInterior) {
      controls.minDistance = 0.08
      controls.maxDistance = 1.25
      controls.minPolarAngle = 0.45
      controls.maxPolarAngle = Math.PI * 0.68
      controls.dollySpeed = 0.45
      controls.truckSpeed = 0.25
    } else {
      controls.minDistance = 2.0
      controls.maxDistance = 10.5
      controls.minPolarAngle = 0.22
      controls.maxPolarAngle = Math.PI / 2 - 0.03
      controls.dollySpeed = 0.85
      controls.truckSpeed = 0.4
    }

    const animate = !isFirstMount.current
    isFirstMount.current = false

    const dx = (preset.position[0] - preset.target[0]) * portraitScale
    const dy = (preset.position[1] - preset.target[1]) * portraitScale
    const dz = (preset.position[2] - preset.target[2]) * portraitScale

    controls.setLookAt(
      preset.target[0] + dx,
      preset.target[1] + dy,
      preset.target[2] + dz,
      preset.target[0],
      preset.target[1],
      preset.target[2],
      animate
    )
  }, [activeVehicleId, activeCamera, cameraRequestNonce, camera, size.width, size.height])

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return
    if (autoRotate && activeCamera !== 'interior') {
      controls.azimuthAngle += delta * 0.22
    }
  })

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.65}
      draggingSmoothTime={0.18}
    />
  )
}
