import { useState } from 'react'
import {
  Check,
  Eye,
  RotateCcw,
  Share2,
  SlidersHorizontal,
} from 'lucide-react'
import { getVehicleById } from '../config/vehicles'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import type { ConfigStep, PaintFinish } from '../types/configurator'
import { formatCurrency } from './TopBar'

const MOBILE_STEPS: ConfigStep[] = ['exterior', 'interior', 'extras']

function getSwatchStyle(hex: string, finish: PaintFinish) {
  if (finish === 'metallic') {
    return {
      background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.12) 28%, ${hex} 62%, ${hex} 100%)`,
    }
  }
  if (finish === 'matte') {
    return {
      background: `linear-gradient(145deg, ${hex} 0%, ${hex} 100%)`,
      filter: 'saturate(0.92)',
    }
  }
  return {
    background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, ${hex} 48%, ${hex} 100%)`,
  }
}

export function ConfigSidebar() {
  const [finishFilter, setFinishFilter] = useState<'all' | PaintFinish>('all')
  const [copied, setCopied] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const language = useConfiguratorStore((s) => s.language)
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const activeStep = useConfiguratorStore((s) => s.activeStep)
  const setActiveStep = useConfiguratorStore((s) => s.setActiveStep)
  const activeCamera = useConfiguratorStore((s) => s.activeCamera)
  const setActiveCamera = useConfiguratorStore((s) => s.setActiveCamera)
  const selection = useConfiguratorStore((s) => s.selections[s.activeVehicleId])
  const setPaint = useConfiguratorStore((s) => s.setPaint)
  const setInterior = useConfiguratorStore((s) => s.setInterior)
  const setWheel = useConfiguratorStore((s) => s.setWheel)
  const setCaliper = useConfiguratorStore((s) => s.setCaliper)
  const toggleAccessory = useConfiguratorStore((s) => s.toggleAccessory)
  const resetActiveVehicle = useConfiguratorStore((s) => s.resetActiveVehicle)
  const setSummaryOpen = useConfiguratorStore((s) => s.setSummaryOpen)
  const getShareUrl = useConfiguratorStore((s) => s.getShareUrl)

  const t = translations[language]
  const vehicle = getVehicleById(activeVehicleId)

  const filteredPaints =
    finishFilter === 'all'
      ? vehicle.paints
      : vehicle.paints.filter((p) => p.finish === finishFilter)

  const handleShare = async () => {
    const url = getShareUrl()
    window.history.replaceState({}, '', url)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback if clipboard API is unavailable
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <aside
      className={`z-20 flex w-full shrink-0 flex-col border-t border-[#E6E8EC] bg-white lg:h-full lg:w-[390px] lg:border-t-0 lg:border-l ${
        mobileExpanded ? 'h-[62vh]' : 'h-[42vh]'
      } transition-[height] duration-200 lg:transition-none`}
    >
      {/* Mobile drag/expand handle + step selector */}
      <div className="flex items-center justify-between border-b border-[#E6E8EC] px-4 py-2 lg:hidden">
        <div className="flex items-center gap-1">
          {MOBILE_STEPS.map((step) => {
            const active = activeStep === step
            return (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium ${
                  active
                    ? 'bg-[#141619] text-white'
                    : 'text-[#5C636E] hover:bg-[#F5F6F8]'
                }`}
              >
                {t.steps[step]}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setMobileExpanded((prev) => !prev)}
          className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#5C636E] hover:bg-[#F5F6F8]"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{mobileExpanded ? '−' : '+'}</span>
        </button>
      </div>

      {/* Desktop Sub-Header: Vehicle title + desktop compact step bar for lg..xl */}
      <div className="hidden border-b border-[#E6E8EC] px-6 pt-5 pb-4 lg:block">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#141619]">
              {vehicle.brand} {vehicle.name}
            </h1>
            <p className="mt-0.5 text-xs text-[#5C636E]">
              {vehicle.tagline[language]}
            </p>
          </div>
          <button
            type="button"
            onClick={resetActiveVehicle}
            className="cursor-pointer rounded-md p-1.5 text-[#5C636E] transition-colors hover:bg-[#F5F6F8] hover:text-[#141619]"
            title={t.sidebar.resetVehicle}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Compact step tabs on lg screens where center TopBar tabs are hidden */}
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-lg bg-[#F5F6F8] p-1 xl:hidden">
          {MOBILE_STEPS.map((step) => {
            const active = activeStep === step
            return (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`cursor-pointer rounded-md py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-white text-[#141619] shadow-xs'
                    : 'text-[#5C636E] hover:text-[#141619]'
                }`}
              >
                {t.steps[step]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable Configuration Content */}
      <div className="config-scroll flex-1 overflow-y-auto px-5 py-4 lg:px-6 lg:py-5">
        {/* STEP 1: EXTERIOR PAINT */}
        {(activeStep === 'exterior' || activeStep === 'summary') && (
          <div>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-[#141619]">
                {t.sidebar.exteriorTitle}
              </h2>
              <p className="text-xs text-[#5C636E]">
                {t.sidebar.exteriorSubtitle}
              </p>
            </div>

            {/* Finish Filter Segmented Control */}
            <div className="mb-4 grid grid-cols-4 gap-1 rounded-lg bg-[#F5F6F8] p-1 text-xs font-medium">
              {(['all', 'solid', 'metallic', 'matte'] as const).map((finish) => {
                const active = finishFilter === finish
                return (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setFinishFilter(finish)}
                    className={`cursor-pointer rounded-md py-1.5 transition-colors ${
                      active
                        ? 'bg-white text-[#141619] shadow-xs'
                        : 'text-[#5C636E] hover:text-[#141619]'
                    }`}
                  >
                    {t.finishes[finish]}
                  </button>
                )
              })}
            </div>

            {/* Paint Options List (Toyota-style clean rows with realistic circular swatches) */}
            <div className="space-y-2">
              {filteredPaints.map((paint) => {
                const selected = selection.paintId === paint.id
                return (
                  <button
                    key={paint.id}
                    type="button"
                    onClick={() => setPaint(paint.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      selected
                        ? 'border-[#C8102E] bg-[#C8102E]/[0.03] ring-1 ring-[#C8102E]'
                        : 'border-[#E6E8EC] bg-white hover:border-[#B8BFC9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 shadow-inner"
                        style={getSwatchStyle(paint.hex, paint.finish)}
                      >
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/90 text-[#141619] shadow-xs">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </span>
                        )}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-[#141619]">
                          {paint.name[language]}
                        </div>
                        <div className="text-xs text-[#5C636E]">
                          {t.finishes[paint.finish]}
                        </div>
                      </div>
                    </div>

                    <div className="tabular-nums text-xs font-semibold text-[#141619]">
                      {paint.price === 0
                        ? t.sidebar.included
                        : `+${formatCurrency(paint.price)}`}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 2: INTERIOR TRIM */}
        {activeStep === 'interior' && (
          <div>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-[#141619]">
                  {t.sidebar.interiorTitle}
                </h2>
                <p className="text-xs text-[#5C636E]">
                  {t.sidebar.interiorSubtitle}
                </p>
              </div>
              {activeCamera !== 'interior' && (
                <button
                  type="button"
                  onClick={() => setActiveCamera('interior')}
                  className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-[#E6E8EC] bg-[#F5F6F8] px-2.5 py-1.5 text-xs font-medium text-[#141619] hover:border-[#141619]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t.sidebar.enterCabinHint}</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {vehicle.interiors.map((interior) => {
                const selected = selection.interiorId === interior.id
                return (
                  <button
                    key={interior.id}
                    type="button"
                    onClick={() => setInterior(interior.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      selected
                        ? 'border-[#C8102E] bg-[#C8102E]/[0.03] ring-1 ring-[#C8102E]'
                        : 'border-[#E6E8EC] bg-white hover:border-[#B8BFC9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Dual-tone upholstery & accent swatch */}
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/15 shadow-xs">
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: interior.primaryHex }}
                        />
                        <div
                          className="absolute right-0 bottom-0 h-4 w-4 rounded-tl-md border-t border-l border-white/40"
                          style={{ backgroundColor: interior.accentHex }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#141619]">
                          {interior.name[language]}
                        </div>
                        <div className="text-xs text-[#5C636E]">
                          {t.interiorTypes[interior.materialType]}
                        </div>
                      </div>
                    </div>

                    <div className="tabular-nums text-xs font-semibold text-[#141619]">
                      {interior.price === 0
                        ? t.sidebar.included
                        : `+${formatCurrency(interior.price)}`}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 3: WHEELS, CALIPERS & MODULAR ACCESSORIES */}
        {activeStep === 'extras' && (
          <div className="space-y-6">
            {/* Wheel Finishes */}
            <section>
              <div className="mb-2.5">
                <h2 className="text-sm font-semibold text-[#141619]">
                  {t.sidebar.wheelsSection}
                </h2>
              </div>
              <div className="space-y-2">
                {vehicle.wheels.map((wheel) => {
                  const selected = selection.wheelId === wheel.id
                  return (
                    <button
                      key={wheel.id}
                      type="button"
                      onClick={() => {
                        setWheel(wheel.id)
                        if (activeCamera === 'interior') setActiveCamera('wheels')
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        selected
                          ? 'border-[#C8102E] bg-[#C8102E]/[0.03] ring-1 ring-[#C8102E]'
                          : 'border-[#E6E8EC] bg-white hover:border-[#B8BFC9]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#141619]/20"
                          style={{
                            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), ${wheel.hex} 65%)`,
                          }}
                        />
                        <div className="text-sm font-medium text-[#141619]">
                          {wheel.name[language]}
                        </div>
                      </div>
                      <div className="tabular-nums text-xs font-semibold text-[#141619]">
                        {wheel.price === 0
                          ? t.sidebar.included
                          : `+${formatCurrency(wheel.price)}`}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Brake Calipers */}
            <section>
              <h2 className="mb-2.5 text-sm font-semibold text-[#141619]">
                {t.sidebar.calipersSection}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {vehicle.calipers.map((caliper) => {
                  const selected = selection.caliperId === caliper.id
                  return (
                    <button
                      key={caliper.id}
                      type="button"
                      onClick={() => setCaliper(caliper.id)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                        selected
                          ? 'border-[#C8102E] bg-[#C8102E]/[0.03] ring-1 ring-[#C8102E]'
                          : 'border-[#E6E8EC] bg-white hover:border-[#B8BFC9]'
                      }`}
                    >
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border border-black/15"
                        style={{ backgroundColor: caliper.hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-[#141619]">
                          {caliper.name[language]}
                        </div>
                        <div className="tabular-nums text-[11px] text-[#5C636E]">
                          {caliper.price === 0
                            ? t.sidebar.included
                            : `+${formatCurrency(caliper.price)}`}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Modular Equipment / Accessories */}
            <section>
              <h2 className="mb-2.5 text-sm font-semibold text-[#141619]">
                {t.sidebar.accessoriesSection}
              </h2>
              <div className="space-y-2">
                {vehicle.accessories.map((acc) => {
                  const enabled = selection.accessoryIds.includes(acc.id)
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => toggleAccessory(acc.id)}
                      className={`flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                        enabled
                          ? 'border-[#C8102E] bg-[#C8102E]/[0.03] ring-1 ring-[#C8102E]'
                          : 'border-[#E6E8EC] bg-white hover:border-[#B8BFC9]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            enabled
                              ? 'border-[#C8102E] bg-[#C8102E] text-white'
                              : 'border-[#C7CDD6] bg-white'
                          }`}
                        >
                          {enabled && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-[#141619]">
                            {acc.name[language]}
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-[#5C636E]">
                            {acc.description[language]}
                          </p>
                        </div>
                      </div>
                      <div className="tabular-nums shrink-0 text-xs font-semibold text-[#141619]">
                        +{formatCurrency(acc.price)}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Fixed Commercial Footer Actions */}
      <div className="flex items-center gap-2.5 border-t border-[#E6E8EC] bg-white px-5 py-3.5 lg:px-6">
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#141619] bg-white px-4 py-2.5 text-xs font-semibold text-[#141619] transition-colors hover:bg-[#F5F6F8]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t.sidebar.linkCopied}</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>{t.sidebar.shareBuild}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSummaryOpen(true)}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-full bg-[#C8102E] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#a90d26]"
        >
          {t.sidebar.finishBuild}
        </button>
      </div>
    </aside>
  )
}
