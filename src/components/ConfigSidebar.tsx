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
      className={`z-20 flex w-full shrink-0 flex-col border-t border-[#F0F3F7]/[0.09] bg-[#101318] text-[#F3F5F8] lg:h-full lg:w-[390px] lg:border-t-0 lg:border-l ${
        mobileExpanded ? 'h-[62vh]' : 'h-[42vh]'
      } transition-[height] duration-200 lg:transition-none`}
    >
      {/* Mobile drag/expand handle + step selector */}
      <div className="flex items-center justify-between border-b border-[#F0F3F7]/[0.09] px-4 py-2 lg:hidden">
        <div className="flex items-center gap-1">
          {MOBILE_STEPS.map((step) => {
            const active = activeStep === step
            return (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`btn-tactile cursor-pointer rounded-full px-3 py-1 text-xs font-medium ${
                  active
                    ? 'bg-[#F4C430]/[0.16] font-semibold text-[#F4C430] ring-1 ring-[#F4C430]/55'
                    : 'text-[#F4C430]/80 hover:bg-[#151920] hover:text-[#FFD44F]'
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
          className="flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-[#99A3B2] hover:bg-[#151920] hover:text-[#F3F5F8]"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{mobileExpanded ? '−' : '+'}</span>
        </button>
      </div>

      {/* Desktop Sub-Header: Vehicle title + desktop compact step bar for lg..xl */}
      <div className="hidden border-b border-[#F0F3F7]/[0.09] px-6 pt-5 pb-4 lg:block">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#F3F5F8]">
              {vehicle.brand} {vehicle.name}
            </h1>
            <p className="mt-0.5 text-xs text-[#99A3B2]">
              {vehicle.tagline[language]}
            </p>
          </div>
          <button
            type="button"
            onClick={resetActiveVehicle}
            className="btn-tactile cursor-pointer rounded-full p-1.5 text-[#99A3B2] hover:bg-[#151920] hover:text-[#F3F5F8]"
            title={t.sidebar.resetVehicle}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Compact step tabs on lg screens where center TopBar tabs are hidden */}
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-full border border-[#F0F3F7]/[0.09] bg-[#0B0D10] p-1 xl:hidden">
          {MOBILE_STEPS.map((step) => {
            const active = activeStep === step
            return (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`btn-tactile cursor-pointer rounded-full py-1.5 text-xs font-medium ${
                  active
                    ? 'bg-[#F4C430]/[0.16] font-semibold text-[#F4C430] ring-1 ring-[#F4C430]/55'
                    : 'text-[#F4C430]/80 hover:text-[#FFD44F]'
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
              <h2 className="text-base font-semibold text-[#F3F5F8]">
                {t.sidebar.exteriorTitle}
              </h2>
              <p className="text-xs text-[#99A3B2]">
                {t.sidebar.exteriorSubtitle}
              </p>
            </div>

            {/* Finish Filter Segmented Control */}
            <div className="mb-4 grid grid-cols-4 gap-1 rounded-full border border-[#F0F3F7]/[0.09] bg-[#0B0D10] p-1 text-xs font-medium">
              {(['all', 'solid', 'metallic', 'matte'] as const).map((finish) => {
                const active = finishFilter === finish
                return (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setFinishFilter(finish)}
                    className={`btn-tactile cursor-pointer rounded-full py-1.5 ${
                      active
                        ? 'bg-[#151920] text-[#F3F5F8] ring-1 ring-[#F0F3F7]/[0.14]'
                        : 'text-[#99A3B2] hover:text-[#F3F5F8]'
                    }`}
                  >
                    {t.finishes[finish]}
                  </button>
                )
              })}
            </div>

            {/* Paint Options List */}
            <div className="space-y-2">
              {filteredPaints.map((paint) => {
                const selected = selection.paintId === paint.id
                return (
                  <button
                    key={paint.id}
                    type="button"
                    onClick={() => setPaint(paint.id)}
                    className={`btn-tactile flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 text-left ${
                      selected
                        ? 'border-[#18C8F0] bg-[#18C8F0]/[0.12]'
                        : 'border-[#F0F3F7]/[0.09] bg-[#151920] hover:border-[#F0F3F7]/[0.22] hover:bg-[#1B2029]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 shadow-inner"
                        style={getSwatchStyle(paint.hex, paint.finish)}
                      >
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#18C8F0] text-[#090B0E] shadow-xs">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </span>
                        )}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-[#F3F5F8]">
                          {paint.name[language]}
                        </div>
                        <div className="text-xs text-[#99A3B2]">
                          {t.finishes[paint.finish]}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tabular-nums text-xs font-semibold ${
                        paint.price === 0 ? 'text-[#99A3B2]' : 'text-[#F4C430]'
                      }`}
                    >
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
                <h2 className="text-base font-semibold text-[#F3F5F8]">
                  {t.sidebar.interiorTitle}
                </h2>
                <p className="text-xs text-[#99A3B2]">
                  {t.sidebar.interiorSubtitle}
                </p>
              </div>
              {activeCamera !== 'interior' && (
                <button
                  type="button"
                  onClick={() => setActiveCamera('interior')}
                  className="btn-tactile flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-[#F0F3F7]/[0.2] bg-[#151920] px-3 py-1.5 text-xs font-medium text-[#F3F5F8] hover:border-[#18C8F0] hover:text-[#18C8F0]"
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
                    className={`btn-tactile flex w-full cursor-pointer items-center justify-between rounded-xl border p-3.5 text-left ${
                      selected
                        ? 'border-[#18C8F0] bg-[#18C8F0]/[0.12]'
                        : 'border-[#F0F3F7]/[0.09] bg-[#151920] hover:border-[#F0F3F7]/[0.22] hover:bg-[#1B2029]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/15 shadow-xs">
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: interior.primaryHex }}
                        />
                        <div
                          className="absolute right-0 bottom-0 h-4 w-4 rounded-tl-md border-t border-l border-white/35"
                          style={{ backgroundColor: interior.accentHex }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#F3F5F8]">
                          {interior.name[language]}
                        </div>
                        <div className="text-xs text-[#99A3B2]">
                          {t.interiorTypes[interior.materialType]}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tabular-nums text-xs font-semibold ${
                        interior.price === 0 ? 'text-[#99A3B2]' : 'text-[#F4C430]'
                      }`}
                    >
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
              <h2 className="mb-2.5 text-sm font-semibold text-[#F3F5F8]">
                {t.sidebar.wheelsSection}
              </h2>
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
                      className={`btn-tactile flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 text-left ${
                        selected
                          ? 'border-[#18C8F0] bg-[#18C8F0]/[0.12]'
                          : 'border-[#F0F3F7]/[0.09] bg-[#151920] hover:border-[#F0F3F7]/[0.22] hover:bg-[#1B2029]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#0B0D10]"
                          style={{ backgroundColor: wheel.hex }}
                        >
                          <span className="h-2.5 w-2.5 rounded-full bg-[#0B0D10]/70" />
                        </span>
                        <div>
                          <div className="text-sm font-medium text-[#F3F5F8]">
                            {wheel.name[language]}
                          </div>
                          <div className="text-xs capitalize text-[#99A3B2]">
                            {wheel.finish}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`tabular-nums text-xs font-semibold ${
                          wheel.price === 0 ? 'text-[#99A3B2]' : 'text-[#F4C430]'
                        }`}
                      >
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
              <h2 className="mb-2.5 text-sm font-semibold text-[#F3F5F8]">
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
                      className={`btn-tactile flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-left ${
                        selected
                          ? 'border-[#18C8F0] bg-[#18C8F0]/[0.12]'
                          : 'border-[#F0F3F7]/[0.09] bg-[#151920] hover:border-[#F0F3F7]/[0.22] hover:bg-[#1B2029]'
                      }`}
                    >
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border border-white/20"
                        style={{ backgroundColor: caliper.hex }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium text-[#F3F5F8]">
                          {caliper.name[language]}
                        </div>
                        <div
                          className={`tabular-nums text-[11px] ${
                            caliper.price === 0 ? 'text-[#99A3B2]' : 'text-[#F4C430]'
                          }`}
                        >
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

            {/* Modular Accessories */}
            <section>
              <h2 className="mb-2.5 text-sm font-semibold text-[#F3F5F8]">
                {t.sidebar.accessoriesSection}
              </h2>
              <div className="space-y-2.5">
                {vehicle.accessories.map((acc) => {
                  const enabled = selection.accessoryIds.includes(acc.id)
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => toggleAccessory(acc.id)}
                      className={`btn-tactile flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border p-3.5 text-left ${
                        enabled
                          ? 'border-[#18C8F0] bg-[#18C8F0]/[0.12]'
                          : 'border-[#F0F3F7]/[0.09] bg-[#151920] hover:border-[#F0F3F7]/[0.22] hover:bg-[#1B2029]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            enabled
                              ? 'border-[#18C8F0] bg-[#18C8F0] text-[#090B0E]'
                              : 'border-[#F0F3F7]/[0.22] bg-[#0B0D10]'
                          }`}
                        >
                          {enabled && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-[#F3F5F8]">
                            {acc.name[language]}
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-[#99A3B2]">
                            {acc.description[language]}
                          </p>
                        </div>
                      </div>
                      <div className="tabular-nums shrink-0 text-xs font-semibold text-[#F4C430]">
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

      {/* Fixed Commercial Footer Actions (Amarillo Señal conversion CTA) + Agency Credit */}
      <div className="border-t border-[#F0F3F7]/[0.09] bg-[#0B0D10] px-5 pt-3.5 pb-2.5 lg:px-6">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="btn-tactile flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#F0F3F7]/[0.22] bg-transparent px-4 py-2.5 text-xs font-medium text-[#F3F5F8] hover:border-[#F0F3F7]/40 hover:bg-[#151920]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#34D399]" />
                <span className="text-[#34D399]">{t.sidebar.linkCopied}</span>
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
            className="btn-tactile flex flex-1 cursor-pointer items-center justify-center rounded-full bg-[#F4C430] px-4 py-2.5 text-xs font-semibold text-[#090B0E] hover:bg-[#FFD44F]"
          >
            {t.sidebar.finishBuild}
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-[#758091]">
          <img
            src="/brand/progress-digital-logo.webp"
            alt="Progress Digital"
            className="h-3.5 w-3.5 shrink-0 object-contain"
          />
          <span>{t.madeBy}</span>
          <a
            href="https://progressdigital.company"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#F3F5F8] underline decoration-[#18C8F0]/70 underline-offset-2 transition-colors hover:text-[#18C8F0]"
          >
            progressdigital.company
          </a>
        </div>
      </div>
    </aside>
  )
}
