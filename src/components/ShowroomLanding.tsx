import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu } from 'lucide-react'
import { VEHICLES } from '../config/vehicles'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import { ParticleCarHero } from './ParticleCarHero'
import { formatCurrency } from './TopBar'

export function ShowroomLanding() {
  const heroSentinelRef = useRef<HTMLDivElement>(null)
  const [overLightSection, setOverLightSection] = useState(false)

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
        setOverLightSection(!entry.isIntersecting)
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
    <div className="min-h-screen w-full bg-[#07080a] text-[#111316]">
      {/* Porsche-inspired Adaptive Overlay Header (white-on-dark in hero -> crisp frosted white over gallery) */}
      <header
        className={`fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-4 transition-[background-color,color,border-color] duration-200 sm:h-20 sm:px-10 ${
          overLightSection
            ? 'border-b border-[#E5E7EB] bg-white/92 text-[#111316] backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-[#07080a]/85 via-[#07080a]/35 to-transparent text-white'
        }`}
      >
        {/* Left: Menu Trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t.menuLabel}
          className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-normal transition-colors ${
            overLightSection
              ? 'text-[#111316] hover:bg-[#F4F5F7]'
              : 'text-white/95 hover:bg-white/10'
          }`}
        >
          <Menu className="h-5 w-5 stroke-[1.75]" />
          <span className="hidden sm:inline">{t.menuLabel}</span>
        </button>

        {/* Center: Wide Porsche-inspired Geometric Wordmark */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex cursor-pointer flex-col items-center text-center"
        >
          <span
            className={`font-wordmark text-[10px] tracking-[0.2em] sm:text-[15px] sm:tracking-[0.34em] ${
              overLightSection ? 'text-[#111316]' : 'text-white'
            }`}
          >
            PROGRESS DIGITAL
          </span>
          <span
            className={`mt-0.5 text-[9px] font-medium tracking-[0.24em] uppercase sm:text-[10px] sm:tracking-[0.32em] ${
              overLightSection ? 'text-[#59606B]' : 'text-white/65'
            }`}
          >
            {t.brandSubtitle}
          </span>
        </button>

        {/* Right: EN/ES Switcher */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center rounded-md border p-0.5 text-xs font-medium backdrop-blur-md ${
              overLightSection
                ? 'border-[#E5E7EB] bg-[#F4F5F7]'
                : 'border-white/18 bg-white/8'
            }`}
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                language === 'en'
                  ? overLightSection
                    ? 'bg-white text-[#111316] shadow-xs'
                    : 'bg-white text-[#07080a]'
                  : overLightSection
                    ? 'text-[#59606B] hover:text-[#111316]'
                    : 'text-white/75 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                language === 'es'
                  ? overLightSection
                    ? 'bg-white text-[#111316] shadow-xs'
                    : 'bg-white text-[#07080a]'
                  : overLightSection
                    ? 'text-[#59606B] hover:text-[#111316]'
                    : 'text-white/75 hover:text-white'
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </header>

      {/* 1. Full-Viewport Interactive Particle-Dot Car Hero */}
      <div ref={heroSentinelRef}>
        <ParticleCarHero
          onEnterConfigurator={() => openConfiguratorForVehicle('mclaren-p1')}
          onScrollToModels={scrollToModels}
        />
      </div>

      {/* 2. Porsche-Inspired Editorial Model Showcase Band (Crisp White Ground) */}
      <section
        id="showroom-models"
        className="w-full bg-white px-6 py-24 sm:px-12 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl text-3xl font-normal tracking-[-0.02em] text-[#111316] sm:text-5xl">
            {t.landing.showcaseHeading}
          </h2>

          {/* Flagship 2-Column Large Visual Cards (mirroring Porsche 911 / 718 showcase) */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {flagshipCars.map((v) => (
              <article
                key={v.id}
                onClick={() => openConfiguratorForVehicle(v.id)}
                className="porsche-card group relative flex aspect-[4/3] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-[#0d0f13] p-7 text-white sm:p-9"
              >
                <img
                  src={`/previews/${v.id}.png`}
                  alt={`${v.brand} ${v.name}`}
                  className="porsche-card-img absolute inset-0 h-full w-full object-cover"
                />
                {/* Soft top & bottom gradient scrims for crisp legibility */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/80"
                  aria-hidden="true"
                />

                {/* Top centered wide logotype (Porsche 911 / 718 signature placement) */}
                <div className="relative z-10 flex flex-col items-center pt-1 text-center">
                  <span className="font-wordmark text-xl tracking-[0.22em] text-white sm:text-2xl">
                    {v.id === 'mclaren-p1' ? 'P1' : 'EXIGE 240'}
                  </span>
                  <span className="mt-1 text-xs text-white/70">{v.brand}</span>
                </div>

                {/* Bottom vehicle meta + action */}
                <div className="relative z-10 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-base font-medium text-white">
                      {v.brand} {v.name}
                    </div>
                    <div className="tabular-nums mt-0.5 text-xs text-white/75">
                      {v.specs.power} · {v.specs.weight} · {t.landing.startingFrom}{' '}
                      {formatCurrency(v.basePrice)}
                    </div>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#0d0f13]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Panoramic Modular Utility Showcase Card (Honda Acty HA3 — commercial modular story) */}
          {utilityVehicle && (
            <article
              onClick={() => openConfiguratorForVehicle(utilityVehicle.id)}
              className="porsche-card group relative mt-6 grid cursor-pointer overflow-hidden rounded-2xl bg-[#0d0f13] text-white lg:grid-cols-12"
            >
              <div className="relative min-h-[280px] overflow-hidden lg:col-span-7 lg:min-h-[360px]">
                <img
                  src={`/previews/${utilityVehicle.id}.png`}
                  alt={`${utilityVehicle.brand} ${utilityVehicle.name}`}
                  className="porsche-card-img absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d0f13]/90 hidden lg:block"
                  aria-hidden="true"
                />
              </div>

              <div className="relative z-10 flex flex-col justify-between p-7 sm:p-10 lg:col-span-5">
                <div>
                  <div className="font-wordmark text-lg tracking-[0.2em] text-white sm:text-xl">
                    ACTY HA3
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    {utilityVehicle.brand} · {utilityVehicle.category[language]}
                  </div>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
                    {utilityVehicle.tagline[language]}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/12 pt-5">
                  <div className="tabular-nums text-sm text-white/85">
                    {t.landing.startingFrom} {formatCurrency(utilityVehicle.basePrice)}
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-[4px] border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#0d0f13]">
                    {t.landing.configureModel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* 3. Obsidian Closing Studio Strip & Editorial Footer */}
      <section className="w-full bg-[#0d0f13] px-6 py-20 text-white sm:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-normal tracking-[-0.02em] text-white sm:text-4xl">
              {t.landing.studioHeading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
              {t.landing.studioBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
              <span>{t.landing.featureExterior}</span>
              <span>{t.landing.featureInterior}</span>
              <span>{t.landing.featureModular}</span>
              <span>{t.landing.featureRealtime}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openConfiguratorForVehicle('mclaren-p1')}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-[4px] bg-white px-7 py-3.5 text-sm font-medium text-[#07080a] transition-colors hover:bg-[#E5E7EB]"
          >
            {t.landing.studioCta}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <footer className="mx-auto mt-16 flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center">
          <div className="font-wordmark tracking-[0.22em] text-white/75">
            PROGRESS DIGITAL
          </div>
          <p>{t.landing.footerNote}</p>
        </footer>
      </section>
    </div>
  )
}
