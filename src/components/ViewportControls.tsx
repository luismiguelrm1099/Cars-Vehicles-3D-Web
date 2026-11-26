import { useRef, type ChangeEvent } from 'react'
import {
  Building2,
  Camera,
  Crosshair,
  Moon,
  RotateCw,
  Sun,
  Upload,
  X,
} from 'lucide-react'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import type { CameraPresetId, ShowroomTheme } from '../types/configurator'

const CAMERA_PRESETS: CameraPresetId[] = [
  'hero',
  'front',
  'side',
  'rear',
  'wheels',
  'interior',
]

const SHOWROOM_THEMES: { id: ShowroomTheme; icon: typeof Building2 }[] = [
  { id: 'agency', icon: Building2 },
  { id: 'light', icon: Sun },
  { id: 'dark', icon: Moon },
]

interface ViewportControlsProps {
  onTakeSnapshot: () => void
}

export function ViewportControls({ onTakeSnapshot }: ViewportControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const language = useConfiguratorStore((s) => s.language)
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const activeCamera = useConfiguratorStore((s) => s.activeCamera)
  const setActiveCamera = useConfiguratorStore((s) => s.setActiveCamera)
  const toggleInteriorView = useConfiguratorStore((s) => s.toggleInteriorView)
  const showroomTheme = useConfiguratorStore((s) => s.showroomTheme)
  const setShowroomTheme = useConfiguratorStore((s) => s.setShowroomTheme)
  const autoRotate = useConfiguratorStore((s) => s.autoRotate)
  const toggleAutoRotate = useConfiguratorStore((s) => s.toggleAutoRotate)
  const inspectorEnabled = useConfiguratorStore((s) => s.inspectorEnabled)
  const setInspectorEnabled = useConfiguratorStore((s) => s.setInspectorEnabled)
  const inspectedMesh = useConfiguratorStore((s) => s.inspectedMesh)
  const setInspectedMesh = useConfiguratorStore((s) => s.setInspectedMesh)
  const modelStatus = useConfiguratorStore((s) => s.modelStatus[s.activeVehicleId])
  const localGlbUrl = useConfiguratorStore((s) => s.localGlbUrls[s.activeVehicleId])
  const setLocalGlbUrl = useConfiguratorStore((s) => s.setLocalGlbUrl)

  const t = translations[language]
  const isInterior = activeCamera === 'interior'
  const isLightBg = showroomTheme === 'light'

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const blobUrl = URL.createObjectURL(file)
    setLocalGlbUrl(activeVehicleId, blobUrl)
    e.target.value = ''
  }

  const glassPillClass = isLightBg
    ? 'bg-white/90 text-[#141619] border-[#E6E8EC] shadow-sm backdrop-blur-md'
    : 'bg-[#141619]/78 text-white border-white/12 shadow-lg backdrop-blur-md'

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-2.5 sm:p-4">
      {/* Top Row: Showroom Environment Switcher + Quick Tools */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        {/* Showroom Theme Switcher (Agency / Light Studio / Midnight) */}
        <div
          className={`pointer-events-auto inline-flex items-center gap-0.5 rounded-xl border p-1 sm:gap-1 ${glassPillClass}`}
          role="group"
          aria-label="Showroom environment"
        >
          {SHOWROOM_THEMES.map(({ id, icon: Icon }) => {
            const active = showroomTheme === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setShowroomTheme(id)}
                className={`flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs ${
                  active
                    ? isLightBg
                      ? 'bg-[#141619] text-white'
                      : 'bg-white text-[#141619]'
                    : isLightBg
                      ? 'text-[#5C636E] hover:text-[#141619]'
                      : 'text-white/75 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.themes[id]}</span>
              </button>
            )
          })}
        </div>

        {/* Right Floating Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Local .glb preview uploader (sm+ to keep phone stage uncluttered) */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`hidden cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors sm:flex ${glassPillClass} hover:border-[#18C8F0]`}
            title={t.viewport.loadLocalGlb}
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t.viewport.loadLocalGlb}</span>
          </button>

          {localGlbUrl && (
            <button
              type="button"
              onClick={() => setLocalGlbUrl(activeVehicleId, null)}
              className="btn-tactile flex cursor-pointer items-center gap-1 rounded-xl border border-[#18C8F0]/50 bg-[#18C8F0] px-2.5 py-2 text-xs font-semibold text-[#090B0E] shadow-sm hover:bg-[#3BF4C4]"
              title="Revert to default model"
            >
              <X className="h-3.5 w-3.5" />
              <span>.GLB</span>
            </button>
          )}

          {/* Inspector toggle (sm+) */}
          <button
            type="button"
            onClick={() => setInspectorEnabled(!inspectorEnabled)}
            className={`hidden cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-medium transition-colors sm:flex ${
              inspectorEnabled
                ? 'border-[#18C8F0] bg-[#18C8F0] font-semibold text-[#090B0E]'
                : glassPillClass
            }`}
            title={t.viewport.inspectorMode}
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t.viewport.inspectorMode}</span>
          </button>

          {/* Turntable Auto-Rotate */}
          <button
            type="button"
            onClick={toggleAutoRotate}
            disabled={isInterior}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl border p-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:px-2.5 ${
              autoRotate
                ? 'border-[#F4C430] bg-[#F4C430] font-semibold text-[#090B0E]'
                : glassPillClass
            }`}
            title={t.viewport.autoRotate}
          >
            <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{t.viewport.autoRotate}</span>
          </button>

          {/* Snapshot Download */}
          <button
            type="button"
            onClick={onTakeSnapshot}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl border p-2 text-xs font-medium transition-colors sm:px-2.5 ${glassPillClass}`}
            title={t.viewport.takeSnapshot}
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Material Inspector Readout */}
      {inspectorEnabled && (
        <div className="pointer-events-auto self-end rounded-xl border border-[#F0F3F7]/[0.14] bg-[#0B0D10]/94 p-3 text-xs text-[#F3F5F8] shadow-xl backdrop-blur-md">
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <span className="font-semibold text-[#18C8F0]">3D Mesh & Material Inspector</span>
            <button
              type="button"
              onClick={() => {
                setInspectorEnabled(false)
                setInspectedMesh(null)
              }}
              className="cursor-pointer text-[#99A3B2] hover:text-[#F3F5F8]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {inspectedMesh ? (
            <div className="space-y-1 font-mono text-[11px] text-[#F3F5F8]">
              <div>
                <span className="text-[#758091]">mesh:</span> {inspectedMesh.meshName}
              </div>
              <div>
                <span className="text-[#758091]">material:</span> {inspectedMesh.materialName}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#758091]">color:</span>
                <span>{inspectedMesh.colorHex}</span>
                {inspectedMesh.colorHex.startsWith('#') && (
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-white/40"
                    style={{ backgroundColor: inspectedMesh.colorHex }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#99A3B2]">
              Click any part of the vehicle to inspect its mesh & material name.
            </div>
          )}
        </div>
      )}

      {/* Bottom Row: Exterior/Interior Toggle + Camera Angle Pills */}
      <div className="flex items-end justify-between gap-2">
        {/* Bottom-Left: Exterior <-> Interior Preview Card */}
        <button
          type="button"
          onClick={toggleInteriorView}
          className={`pointer-events-auto group flex shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border text-left transition-transform duration-200 sm:w-36 ${
            isLightBg
              ? 'border-[#D5D9E0] bg-white shadow-md'
              : 'border-[#F0F3F7]/[0.16] bg-[#101318]/92 shadow-xl backdrop-blur-md'
          }`}
        >
          <div
            className={`relative hidden h-16 w-full items-center justify-center overflow-hidden sm:flex ${
              isInterior
                ? 'bg-gradient-to-br from-[#e2e6ec] to-[#f7f8fa]'
                : 'bg-gradient-to-br from-[#101318] to-[#1B2029]'
            }`}
          >
            {isInterior ? (
              <svg
                viewBox="0 0 120 46"
                className="h-9 w-24 text-[#0B0D10]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 31h96M18 31l8-11 22-8h26l19 9 9 10" />
                <circle cx="32" cy="31" r="7" fill="#ffffff" />
                <circle cx="88" cy="31" r="7" fill="#ffffff" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 120 48"
                className="h-10 w-24 text-[#F3F5F8]/90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 38c14-14 32-20 50-20s36 6 50 20" strokeOpacity="0.45" />
                <circle cx="42" cy="30" r="11" />
                <circle cx="42" cy="30" r="3" />
                <path d="M32 30h20M42 33v8" />
                <rect x="68" y="21" width="22" height="14" rx="2" strokeOpacity="0.8" />
              </svg>
            )}
            <span className="absolute top-1.5 right-1.5 rounded-full bg-[#18C8F0] px-1.5 py-0.5 text-[9px] font-bold text-[#090B0E]">
              360°
            </span>
          </div>
          <div
            className={`flex items-center justify-between px-2.5 py-2 text-[11px] font-semibold sm:py-1.5 ${
              isLightBg ? 'text-[#0B0D10]' : 'text-[#F3F5F8]'
            }`}
          >
            <span>
              {isInterior
                ? t.viewToggle.switchToExterior
                : t.viewToggle.switchToInterior}
            </span>
          </div>
        </button>

        {/* Bottom-Center: Camera Angle Pills */}
        <div className="flex min-w-0 flex-col items-end gap-1.5 sm:items-center">
          <div
            className={`pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border p-1 sm:gap-1 ${glassPillClass}`}
            role="group"
            aria-label="Camera angles"
          >
            {CAMERA_PRESETS.map((preset) => {
              const active = activeCamera === preset
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setActiveCamera(preset)}
                  className={`btn-tactile cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${
                    active
                      ? 'bg-[#18C8F0] font-semibold text-[#090B0E]'
                      : isLightBg
                        ? 'text-[#5C636E] hover:bg-[#F5F6F8] hover:text-[#0B0D10]'
                        : 'text-[#99A3B2] hover:bg-[#1B2029] hover:text-[#F3F5F8]'
                  }`}
                >
                  {t.cameras[preset]}
                </button>
              )
            })}
          </div>

          <div
            className={`hidden rounded-full px-2.5 py-0.5 text-[11px] sm:block ${
              isLightBg
                ? 'bg-white/75 text-[#5C636E]'
                : 'bg-[#141619]/65 text-white/85 backdrop-blur-xs'
            }`}
          >
            {t.viewport.dragHint} ·{' '}
            {modelStatus === 'local-glb'
              ? t.viewport.usingLocalGlb
              : modelStatus === 'glb'
                ? t.viewport.usingOptimizedGlb
                : t.viewport.usingProceduralPreview}
          </div>
        </div>

        {/* Spacer for balanced desktop centering */}
        <div className="hidden w-36 sm:block" />
      </div>
    </div>
  )
}
