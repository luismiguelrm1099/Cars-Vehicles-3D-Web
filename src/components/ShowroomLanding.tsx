import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Menu } from 'lucide-react'
import { VEHICLES } from '../config/vehicles'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import { ParticleCarHero } from './ParticleCarHero'
import { formatCurrency } from './TopBar'

export function ShowroomLanding() {
  const heroSentinelRef = useRef<HTMLDivElement>(null)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)

  const language = useConfiguratorStore((s) => s.language)
  const setLanguage = useConfiguratorStore((s) => s.setLanguage)
  const setMenuOpen = useConfiguratorStore((s) => s.setMenuOpen)
  const openConfiguratorForVehicle = useConfiguratorStore(
    (s) => s.openConfiguratorForVehicle
  )

  const t = translations[language]

  useEffect(() => {
    const el = heroSentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolledPastHero(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollToModels = () => {
    document.getElementById('showroom-models')?.scrollIntoView({ behavior: 'smooth' })
  }

  const flagshipCars = VEHICLES.slice(0, 2)
  const utilityVehicle = VEHICLES[2]

  return (
    <div className="min-h-screen w-full bg-[#08090B] text-[#F4EFE6]">
      {/* Quiet Obsidian Header — seamlessly stays nocturnal across hero & gallery */}
      <header
        className={`fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-4 transition-[background-color,border-color] duration-200 sm:h-20 sm:px-10 ${
          scrolledPastHero
            ? 'border-b border-[#E2B659]/18 bg-[#08090B]/92 backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-[#08090B]/90 via-[#08090B]/40 to-transparent'
        }`}
      >
        {/* Left: Menu Trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t.menuLabel}
          className="btn-tactile flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-normal text-[#F4EFE6]/90 hover:bg-white/[0.07] hover:text-[#F4EFE6]"
        >
          <Menu className="h-[18px] w-[18px] stroke-[1.5]" />
          <span className="hidden sm:inline">{t.menuLabel}</span>
        </button>

        {/* Center: Progress Digital Logo + Wide Geometric Wordmark */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex cursor-pointer items-center gap-2.5 text-left sm:gap-3"
        >
          <img
            src="/brand/progress-digital-logo.webp"
            alt="Progress Digital"
            className="h-6 w-6 shrink-0 object-contain sm:h-8 sm:w-8"
          />
          <span className="flex flex-col">
            <span className="font-wordmark text-[10px] leading-tight tracking-[0.18em] text-[#F4EFE6] sm:text-[14px] sm:tracking-[0.28em]">
              PROGRESS DIGITAL
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-[0.16em] text-[#A49E93] sm:text-[11px]">
              {t.brandSubtitle}
            </span>
          </span>
        </button>

        {/* Right: EN/ES Switcher */}
        <div
          className="flex items-center rounded-lg border border-[#F4EFE6]/12 bg-[#13161C]/85 p-0.5 text-xs font-medium backdrop-blur-md"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`btn-tactile cursor-pointer rounded-md px-2 py-1 ${
              language === 'en'
                ? 'bg-[#F4EFE6] text-[#08090B]'
                : 'text-[#A49E93] hover:text-[#F4EFE6]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`btn-tactile cursor-pointer rounded-md px-2 py-1 ${
              language === 'es'
                ? 'bg-[#F4EFE6] text-[#08090B]'
                : 'text-[#A49E93] hover:text-[#F4EFE6]'
            }`}
          >
            ES
          </button>
        </div>
      </header>

      {/* 1. Interactive Molten-Gold Particle Car Hero */}
      <div ref={heroSentinelRef}>
        <ParticleCarHero
          onEnterConfigurator={() => openConfiguratorForVehicle('mclaren-p1')}
          onScrollToModels={scrollToModels}
        />
      </div>

      {/* 2. Nocturnal Architectural Model Gallery (Real High-Res DSLR Photography) */}
      <section
        id="showroom-models"
        className="relative w-full border-t border-[#E2B659]/16 bg-[#0D0F13] px-5 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="max-w-2xl text-[28px] leading-[1.12] font-normal tracking-[-0.02em] text-[#F4EFE6] sm:text-4xl lg:text-[44px]">
              {t.landing.showcaseHeading}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#A49E93]">
              <span
                className="h-2 w-2 rounded-full bg-[#20ACEC]"
                aria-hidden="true"
              />
              <span>{t.landing.featureRealtime}</span>
            </div>
          </div>

          {/* Flagship 2-Column Editorial Photo Cards */}
          <div className="mt-8 grid gap-6 sm:mt-12 md:grid-cols-2">
            {flagshipCars.map((v) => (
              <article
                key={v.id}
                onClick={() => openConfiguratorForVehicle(v.id)}
                className="porsche-card group relative flex aspect-[4/3] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#F4EFE6]/10 bg-[#13161C] p-6 text-[#F4EFE6] transition-[border-color] duration-200 hover:border-[#E2B659]/50 sm:p-8"
              >
                <img
                  src={`/previews/${v.id}.webp`}
                  alt={`${v.brand} ${v.name}`}
                  loading="eager"
                  className="porsche-card-img absolute inset-0 h-full w-full object-cover"
                />

                {/* Calibrated top & bottom obsidian scrims for crisp readability over real photography */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#08090B]/82 via-[#08090B]/12 to-[#08090B]/92"
                  aria-hidden="true"
                />

                {/* Top centered model logotype */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="font-wordmark text-lg tracking-[0.22em] text-[#F4EFE6] sm:text-2xl">
                    {v.id === 'mclaren-p1' ? 'P1' : 'EXIGE 240'}
                  </span>
                  <span className="mt-1 text-xs text-[#F4EFE6]/75">{v.brand}</span>
                </div>

                {/* Bottom metadata + Progress Digital blue hover affordance */}
                <div className="relative z-10 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-base font-medium text-[#F4EFE6] sm:text-lg">
                      {v.brand} {v.name}
                    </div>
                    <div className="tabular-nums mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[#F4EFE6]/75">
                      <span>{v.specs.power}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.specs.weight}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#E2B659]">
                        {t.landing.startingFrom} {formatCurrency(v.basePrice)}
                      </span>
                    </div>
                  </div>
                  <span className="btn-tactile flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F4EFE6]/30 bg-[#08090B]/55 text-[#F4EFE6] backdrop-blur-sm group-hover:border-[#126AB7] group-hover:bg-[#126AB7] group-hover:text-white">
                    <ArrowRight className="h-4 w-4 stroke-[1.5]" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Panoramic Modular Utility Card (Honda Acty HA3 — real photograph + asymmetric editorial split) */}
          {utilityVehicle && (
            <article
              onClick={() => openConfiguratorForVehicle(utilityVehicle.id)}
              className="porsche-card group relative mt-6 grid cursor-pointer overflow-hidden rounded-2xl border border-[#F4EFE6]/10 bg-[#13161C] text-[#F4EFE6] transition-[border-color] duration-200 hover:border-[#E2B659]/50 lg:grid-cols-12"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[360px]">
                <img
                  src={`/previews/${utilityVehicle.id}.webp`}
                  alt={`${utilityVehicle.brand} ${utilityVehicle.name}`}
                  loading="lazy"
                  className="porsche-card-img absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#13161C] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#13161C]"
                  aria-hidden="true"
                />
              </div>

              <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <div>
                  <div className="font-wordmark text-lg tracking-[0.2em] text-[#F4EFE6] sm:text-xl">
                    ACTY HA3
                  </div>
                  <div className="mt-1 text-sm text-[#A49E93]">
                    {utilityVehicle.brand} · {utilityVehicle.category[language]}
                  </div>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F4EFE6]/80">
                    {utilityVehicle.tagline[language]}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#F4EFE6]/10 pt-5">
                  <div className="tabular-nums text-sm font-medium text-[#E2B659]">
                    {t.landing.startingFrom} {formatCurrency(utilityVehicle.basePrice)}
                  </div>
                  <span className="btn-tactile inline-flex items-center gap-2 rounded-lg border border-[#E2B659]/35 bg-[#1A1E26] px-4 py-2 text-xs font-medium text-[#F4EFE6] group-hover:border-[#126AB7] group-hover:bg-[#126AB7] group-hover:text-white">
                    <span>{t.landing.configureModel}</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
                  </span>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* 3. Closing Obsidian Studio Band & Branded Progress Digital Footer */}
      <section className="w-full border-t border-[#E2B659]/16 bg-[#08090B] px-5 py-16 text-[#F4EFE6] sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <h2 className="text-[28px] leading-[1.15] font-normal tracking-[-0.02em] text-[#F4EFE6] sm:text-4xl">
              {t.landing.studioHeading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A49E93] sm:text-base">
              {t.landing.studioBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#7C766C]">
              <span>{t.landing.featureExterior}</span>
              <span>{t.landing.featureInterior}</span>
              <span>{t.landing.featureModular}</span>
              <span className="inline-flex items-center gap-1.5 text-[#A49E93]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#20ACEC]" aria-hidden="true" />
                {t.landing.featureRealtime}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openConfiguratorForVehicle('mclaren-p1')}
            className="btn-tactile group inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-lg bg-[#126AB7] px-6 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-[#1882D6]"
          >
            <span>{t.landing.studioCta}</span>
            <ArrowRight className="h-4 w-4 stroke-[1.75] transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </div>

        <footer className="mx-auto mt-14 flex max-w-7xl flex-col items-start justify-between gap-6 border-t border-[#F4EFE6]/10 pt-8 sm:flex-row sm:items-center">
          {/* Left: Brand Lockup */}
          <div className="flex items-center gap-3">
            <img
              src="/brand/progress-digital-logo.webp"
              alt="Progress Digital"
              className="h-8 w-8 shrink-0 object-contain"
            />
            <div>
              <div className="font-wordmark text-xs tracking-[0.22em] text-[#F4EFE6]">
                PROGRESS DIGITAL
              </div>
              <div className="mt-0.5 text-[11px] tracking-[0.14em] text-[#A49E93]">
                {t.brandSubtitle}
              </div>
            </div>
          </div>

          {/* Right: Highlighted Agency Credit + Technical Note */}
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <a
              href="https://progressdigital.company"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile group inline-flex items-center gap-2 rounded-lg border border-[#E2B659]/25 bg-[#13161C] px-4 py-2 text-xs text-[#A49E93] hover:border-[#20ACEC]/60 hover:bg-[#1A1E26] hover:text-[#F4EFE6]"
            >
              <span>{t.madeBy}</span>
              <span className="font-semibold text-[#F4EFE6] underline decoration-[#20ACEC]/75 underline-offset-4 group-hover:text-[#20ACEC]">
                progressdigital.company
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[1.5] text-[#20ACEC] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="text-xs text-[#7C766C]">{t.landing.footerNote}</p>
          </div>
        </footer>
      </section>
    </div>
  )
}
