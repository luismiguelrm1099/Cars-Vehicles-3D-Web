import { useEffect } from 'react'
import { ChevronRight, Globe, Home, Sliders, X } from 'lucide-react'
import { VEHICLES } from '../config/vehicles'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import type { ShowroomTheme } from '../types/configurator'

const THEMES: ShowroomTheme[] = ['agency', 'light', 'dark']

export function PorscheMenuDrawer() {
  const menuOpen = useConfiguratorStore((s) => s.menuOpen)
  const setMenuOpen = useConfiguratorStore((s) => s.setMenuOpen)
  const language = useConfiguratorStore((s) => s.language)
  const setLanguage = useConfiguratorStore((s) => s.setLanguage)
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const activeView = useConfiguratorStore((s) => s.activeView)
  const setActiveView = useConfiguratorStore((s) => s.setActiveView)
  const showroomTheme = useConfiguratorStore((s) => s.showroomTheme)
  const setShowroomTheme = useConfiguratorStore((s) => s.setShowroomTheme)
  const openConfiguratorForVehicle = useConfiguratorStore(
    (s) => s.openConfiguratorForVehicle
  )

  const t = translations[language]

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, setMenuOpen])

  return (
    <div
      className={`fixed inset-0 z-50 ${
        menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!menuOpen}
    >
      {/* Dimmed backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`drawer-backdrop absolute inset-0 bg-[#0B0D10]/75 backdrop-blur-xs ${
          menuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Two-column slide-over panel in Paleta Progress Digital */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.menuLabel}
        className={`drawer-panel config-scroll relative flex h-full w-full max-w-[780px] flex-col overflow-y-auto border-r border-[#F0F3F7]/[0.09] bg-[#0B0D10] text-[#F3F5F8] shadow-2xl md:flex-row md:overflow-hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Floating circular close button */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label={t.menu.close}
          className={`btn-tactile fixed top-5 right-5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#F0F3F7]/[0.2] bg-[#151920]/90 text-[#F3F5F8] shadow-md hover:border-[#F4C430] hover:bg-[#1B2029] md:absolute md:-right-14 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Navigation Column — Obsidiana Fría #0B0D10 */}
        <div className="flex w-full shrink-0 flex-col justify-between border-b border-[#F0F3F7]/[0.09] bg-[#0B0D10] px-6 py-7 md:w-[290px] md:overflow-y-auto md:border-r md:border-b-0 md:px-8 md:py-10">
          <div>
            <div className="mb-7 flex items-center gap-3 md:mb-9">
              <img
                src="/brand/progress-digital-logo.webp"
                alt="Progress Digital"
                className="h-8 w-8 shrink-0 object-contain"
              />
              <div>
                <div className="font-wordmark text-[11px] leading-tight tracking-[0.24em] text-[#F3F5F8]">
                  PROGRESS DIGITAL
                </div>
                <div className="mt-0.5 text-[10px] tracking-[0.18em] text-[#99A3B2]">
                  {t.brandSubtitle}
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveView('landing')}
                className={`btn-tactile flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] ${
                  activeView === 'landing'
                    ? 'bg-[#18C8F0]/[0.14] font-medium text-[#18C8F0] ring-1 ring-[#18C8F0]/40'
                    : 'font-normal text-[#F3F5F8] hover:bg-[#151920]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Home className="h-4 w-4 opacity-80" />
                  {t.menu.backToHome}
                </span>
                <ChevronRight className="h-4 w-4 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => openConfiguratorForVehicle(activeVehicleId)}
                className={`btn-tactile flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] ${
                  activeView === 'configurator'
                    ? 'bg-[#18C8F0]/[0.14] font-medium text-[#18C8F0] ring-1 ring-[#18C8F0]/40'
                    : 'font-normal text-[#F3F5F8] hover:bg-[#151920]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Sliders className="h-4 w-4 opacity-80" />
                  {t.menu.configurator}
                </span>
                <ChevronRight className="h-4 w-4 opacity-70" />
              </button>
            </nav>

            {/* Showroom Lighting Presets */}
            <div className="mt-7 border-t border-[#F0F3F7]/[0.09] pt-6 md:mt-10 md:pt-7">
              <div className="mb-3 px-4 text-xs font-medium text-[#758091]">
                {t.menu.environments}
              </div>
              <div className="grid grid-cols-3 gap-1 md:block md:space-y-1">
                {THEMES.map((themeId) => {
                  const selected = showroomTheme === themeId
                  return (
                    <button
                      key={themeId}
                      type="button"
                      onClick={() => {
                        setShowroomTheme(themeId)
                        openConfiguratorForVehicle(activeVehicleId, themeId)
                      }}
                      className={`btn-tactile flex w-full cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-center text-[13px] md:justify-between md:px-4 md:py-2.5 md:text-left md:text-[14px] ${
                        selected
                          ? 'bg-[#151920] font-medium text-[#F4C430] ring-1 ring-[#F4C430]/35'
                          : 'font-normal text-[#99A3B2] hover:bg-[#151920] hover:text-[#F3F5F8]'
                      }`}
                    >
                      <span>{t.themes[themeId]}</span>
                      <ChevronRight className="hidden h-4 w-4 opacity-60 md:block" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Language & Agency Footer */}
          <div className="mt-6 space-y-3 border-t border-[#F0F3F7]/[0.09] pt-4 md:mt-8 md:pt-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-medium text-[#99A3B2]">
                <Globe className="h-4 w-4" />
                {t.menu.language}
              </span>
              <div className="flex rounded-full border border-[#F0F3F7]/[0.12] bg-[#151920] p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`btn-tactile cursor-pointer rounded-full px-2.5 py-1 ${
                    language === 'en'
                      ? 'bg-[#F3F5F8] text-[#090B0E]'
                      : 'text-[#99A3B2] hover:text-[#F3F5F8]'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`btn-tactile cursor-pointer rounded-full px-2.5 py-1 ${
                    language === 'es'
                      ? 'bg-[#F3F5F8] text-[#090B0E]'
                      : 'text-[#99A3B2] hover:text-[#F3F5F8]'
                  }`}
                >
                  ES
                </button>
              </div>
            </div>

            <a
              href="https://progressdigital.company"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-full border border-[#F0F3F7]/[0.1] bg-[#151920] px-3.5 py-2 text-[11px] text-[#99A3B2] transition-colors hover:border-[#18C8F0]/50 hover:bg-[#1B2029] hover:text-[#F3F5F8]"
            >
              <span>{t.madeBy}</span>
              <span className="font-semibold text-[#18C8F0]">progressdigital.company</span>
            </a>
          </div>
        </div>

        {/* Right Model Column — Borderless cutout side profiles on --bg-room (#101318) with calm studio key sheen */}
        <div className="config-scroll flex-1 bg-[#101318] px-6 py-8 md:overflow-y-auto md:px-11 md:py-11">
          <div className="space-y-9 md:space-y-10">
            {VEHICLES.map((v) => {
              const isCurrent = v.id === activeVehicleId
              const shortLabel =
                v.id === 'mclaren-p1'
                  ? 'McLaren P1'
                  : v.id === 'lotus-exige-240'
                    ? 'Lotus Exige 240'
                    : 'Honda Acty HA3'

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => openConfiguratorForVehicle(v.id)}
                  className="porsche-card group block w-full cursor-pointer text-left"
                >
                  {/* Clean model heading */}
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-[18px] tracking-[-0.01em] transition-colors sm:text-[19px] ${
                        isCurrent
                          ? 'font-medium text-[#F4C430]'
                          : 'font-normal text-[#F3F5F8] group-hover:text-[#F4C430]'
                      }`}
                    >
                      {shortLabel}
                    </span>
                    <span className="text-xs text-[#18C8F0] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {t.menu.configureNow}
                    </span>
                  </div>

                  {/* Pure transparent cutout side-profile vehicle floating cleanly with soft neutral studio halo for silhouette clarity */}
                  <div
                    className="my-3 flex items-center justify-center rounded-xl px-2 py-2"
                    style={{
                      background:
                        'radial-gradient(ellipse 75% 65% at 50% 58%, rgba(240, 243, 247, 0.11) 0%, rgba(16, 19, 24, 0) 72%)',
                    }}
                  >
                    <img
                      src={`/previews/profile-${v.id}.png`}
                      alt={`${v.brand} ${v.name}`}
                      className="porsche-card-img h-28 w-full max-w-[360px] object-contain sm:h-32"
                    />
                  </div>

                  {/* Restrained pill tag beneath the cutout */}
                  <div className="mt-1">
                    <span className="inline-block rounded-full border border-[#F0F3F7]/[0.1] bg-[#151920] px-3.5 py-1 text-xs font-normal text-[#99A3B2]">
                      {v.category[language]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
