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
        className={`drawer-backdrop absolute inset-0 bg-black/62 backdrop-blur-xs ${
          menuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Authentic Porsche two-column slide-over panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.menuLabel}
        className={`drawer-panel config-scroll relative flex h-full w-full max-w-[780px] flex-col overflow-y-auto bg-white shadow-2xl md:flex-row md:overflow-hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Floating circular close button on right dark backdrop (Porsche signature detail) */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label={t.menu.close}
          className={`fixed top-5 right-5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111316] shadow-md transition-[opacity,background-color] duration-200 hover:bg-[#F4F5F7] md:absolute md:-right-14 md:border-white/25 md:bg-[#141619]/80 md:text-white md:hover:bg-[#141619] ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Navigation Column — pure white, understated Porsche typography */}
        <div className="flex w-full shrink-0 flex-col justify-between bg-white px-6 py-7 md:w-[290px] md:overflow-y-auto md:px-8 md:py-10">
          <div>
            <div className="mb-7 flex items-center gap-3 md:mb-9">
              <img
                src="/brand/progress-digital-logo.webp"
                alt="Progress Digital"
                className="h-8 w-8 shrink-0 object-contain"
              />
              <div>
                <div className="font-wordmark text-[11px] leading-tight tracking-[0.24em] text-[#111316]">
                  PROGRESS DIGITAL
                </div>
                <div className="mt-0.5 text-[10px] tracking-[0.18em] text-[#6B7280] uppercase">
                  {t.brandSubtitle}
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveView('landing')}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-[15px] transition-colors ${
                  activeView === 'landing'
                    ? 'bg-[#F2F3F5] font-medium text-[#111316]'
                    : 'font-normal text-[#111316] hover:bg-[#F7F7F8]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-[#59606B]" />
                  {t.menu.backToHome}
                </span>
                <ChevronRight className="h-4 w-4 text-[#6B7280]" />
              </button>

              <button
                type="button"
                onClick={() => openConfiguratorForVehicle(activeVehicleId)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-[15px] transition-colors ${
                  activeView === 'configurator'
                    ? 'bg-[#F2F3F5] font-medium text-[#111316]'
                    : 'font-normal text-[#111316] hover:bg-[#F7F7F8]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Sliders className="h-4 w-4 text-[#59606B]" />
                  {t.menu.configurator}
                </span>
                <ChevronRight className="h-4 w-4 text-[#6B7280]" />
              </button>
            </nav>

            {/* Showroom Lighting Presets */}
            <div className="mt-7 border-t border-[#ECEDEF] pt-6 md:mt-10 md:pt-7">
              <div className="mb-3 px-4 text-xs font-medium text-[#6B7280]">
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
                      className={`flex w-full cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-center text-[13px] transition-colors md:justify-between md:px-4 md:py-2.5 md:text-left md:text-[14px] ${
                        selected
                          ? 'bg-[#F2F3F5] font-medium text-[#111316]'
                          : 'font-normal text-[#374151] hover:bg-[#F7F7F8] hover:text-[#111316]'
                      }`}
                    >
                      <span>{t.themes[themeId]}</span>
                      <ChevronRight className="hidden h-4 w-4 text-[#6B7280] md:block" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Language & Agency Footer */}
          <div className="mt-6 space-y-3 border-t border-[#ECEDEF] pt-4 md:mt-8 md:pt-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                <Globe className="h-4 w-4" />
                {t.menu.language}
              </span>
              <div className="flex rounded-md bg-[#F2F3F5] p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`cursor-pointer rounded px-2.5 py-1 transition-colors ${
                    language === 'en'
                      ? 'bg-white text-[#111316] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#111316]'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`cursor-pointer rounded px-2.5 py-1 transition-colors ${
                    language === 'es'
                      ? 'bg-white text-[#111316] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#111316]'
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
              className="flex items-center justify-between rounded-md bg-[#F7F8FA] px-3 py-2 text-[11px] text-[#59606B] transition-colors hover:bg-[#EFF1F5] hover:text-[#111316]"
            >
              <span>{t.madeBy}</span>
              <span className="font-semibold text-[#111316]">progressdigital.company</span>
            </a>
          </div>
        </div>

        {/* Right Model Column — Pure Porsche borderless cutout side profiles on quiet light-grey ground */}
        <div className="config-scroll flex-1 bg-[#F2F3F5] px-6 py-8 md:overflow-y-auto md:px-11 md:py-11">
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
                  {/* Clean Porsche model heading */}
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-[18px] tracking-[-0.01em] transition-colors sm:text-[19px] ${
                        isCurrent
                          ? 'font-medium text-[#111316]'
                          : 'font-normal text-[#111316] group-hover:text-[#000000]'
                      }`}
                    >
                      {shortLabel}
                    </span>
                    <span className="text-xs text-[#6B7280] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {t.menu.configureNow}
                    </span>
                  </div>

                  {/* Pure transparent cutout side-profile vehicle floating cleanly — complete nose-to-tail */}
                  <div className="my-3 flex items-center justify-center px-2">
                    <img
                      src={`/previews/profile-${v.id}.png`}
                      alt={`${v.brand} ${v.name}`}
                      className="porsche-card-img h-28 w-full max-w-[360px] object-contain sm:h-32"
                    />
                  </div>

                  {/* Restrained Porsche pill tag beneath the cutout */}
                  <div className="mt-1">
                    <span className="inline-block rounded-full bg-white px-3.5 py-1 text-xs font-normal text-[#111316]">
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
