import { Component, Suspense, useEffect, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor, useProgress } from '@react-three/drei'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import { translations } from '../i18n/translations'
import { ShowroomEnvironment } from './ShowroomEnvironment'
import { CameraRig } from './CameraRig'
import { VehicleModel } from './VehicleModel'

interface ErrorBoundaryProps {
  resetKey: string
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, message: '' })
    }
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

function SnapshotBridge({
  onRegisterCapture,
}: {
  onRegisterCapture: (fn: () => string | null) => void
}) {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    onRegisterCapture(() => {
      try {
        gl.render(scene, camera)
        return gl.domElement.toDataURL('image/png')
      } catch {
        return null
      }
    })
  }, [gl, scene, camera, onRegisterCapture])

  return null
}

function LoadingIndicator() {
  const { active, progress } = useProgress()
  const language = useConfiguratorStore((s) => s.language)
  const t = translations[language]

  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
      <div className="w-64 rounded-xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#141619]">
          <span>{t.viewport.loadingModel}</span>
          <span className="tabular-nums text-[#5C636E]">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E6E8EC]">
          <div
            className="h-full rounded-full bg-[#D83A16] transition-[width] duration-200"
            style={{ width: `${Math.max(8, progress)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

interface ShowroomCanvasProps {
  onRegisterCapture: (fn: () => string | null) => void
}

export function ShowroomCanvas({ onRegisterCapture }: ShowroomCanvasProps) {
  const [dpr, setDpr] = useState<[number, number] | number>([1, 2])
  const showroomTheme = useConfiguratorStore((s) => s.showroomTheme)
  const activeCamera = useConfiguratorStore((s) => s.activeCamera)
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const localGlbUrl = useConfiguratorStore((s) => s.localGlbUrls[s.activeVehicleId])
  const accessoryIds = useConfiguratorStore(
    (s) => s.selections[s.activeVehicleId].accessoryIds
  )
  const shadowKey = `${activeVehicleId}-${showroomTheme}-${localGlbUrl ?? ''}-${accessoryIds.join(',')}`
  const transparentCapture =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('profile') === '1'

  return (
    <div className="relative h-full w-full select-none">
      <LoadingIndicator />

      <Canvas
        shadows="percentage"
        dpr={dpr}
        camera={{ position: [4.55, 1.48, 4.75], fov: 35, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.AgXToneMapping,
          toneMappingExposure: 0.94,
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr([1, 2])}
          flipflops={3}
          onFallback={() => setDpr(1)}
        />

        <ShowroomEnvironment
          theme={showroomTheme}
          activeCamera={activeCamera}
          activeVehicleId={activeVehicleId}
          shadowKey={shadowKey}
          transparentCapture={transparentCapture}
        />

        <CameraRig />

        <SnapshotBridge onRegisterCapture={onRegisterCapture} />

        <SceneErrorBoundary resetKey={`${activeVehicleId}-${localGlbUrl ?? ''}`}>
          <Suspense fallback={null}>
            <VehicleModel />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>
    </div>
  )
}
