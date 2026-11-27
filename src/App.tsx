import { useCallback, useRef } from 'react'
import { TopBar } from './components/TopBar'
import { ViewportControls } from './components/ViewportControls'
import { ConfigSidebar } from './components/ConfigSidebar'
import { SummaryModal } from './components/SummaryModal'
import { ShowroomLanding } from './components/ShowroomLanding'
import { PorscheMenuDrawer } from './components/PorscheMenuDrawer'
import { ShowroomCanvas } from './scene/ShowroomCanvas'
import { useConfiguratorStore } from './store/useConfiguratorStore'

export default function App() {
  const captureFnRef = useRef<() => string | null>(() => null)
  const activeView = useConfiguratorStore((s) => s.activeView)
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)

  const handleRegisterCapture = useCallback((fn: () => string | null) => {
    captureFnRef.current = fn
  }, [])

  const captureSnapshot = useCallback(() => {
    return captureFnRef.current()
  }, [])

  const handleQuickSnapshot = useCallback(() => {
    const dataUrl = captureFnRef.current()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.download = `progress-digital-${activeVehicleId}.png`
    link.href = dataUrl
    link.click()
  }, [activeVehicleId])

  return (
    <>
      <PorscheMenuDrawer />

      {activeView === 'landing' ? (
        <ShowroomLanding />
      ) : (
        <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0B0D10]">
          <TopBar />

          <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
            {/* 3D Interactive Showroom Viewport */}
            <section
              aria-label="3D Vehicle Showroom"
              className="relative min-h-0 flex-1"
            >
              <ShowroomCanvas onRegisterCapture={handleRegisterCapture} />
              <ViewportControls onTakeSnapshot={handleQuickSnapshot} />
            </section>

            {/* Right Commercial Specification Panel */}
            <ConfigSidebar />
          </main>

          <SummaryModal captureSnapshot={captureSnapshot} />
        </div>
      )}
    </>
  )
}
