import { useState } from 'react'
import { ChevronDown, ChevronUp, Globe, Menu, X } from 'lucide-react'
import {
  VEHICLES,
  calculateTotalPrice,
  getVehicleById,
} from '../config/vehicles'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import type { ConfigStep } from '../types/configurator'

const STEPS: ConfigStep[] = ['exterior', 'interior', 'extras', 'summary']

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function TopBar() {
  const [priceOpen, setPriceOpen] = useState(false)

  const language = useConfiguratorStore((s) => s.language)
  const setLanguage = useConfiguratorStore((s) => s.setLanguage)
  const setMenuOpen = useConfiguratorStore((s) => s.setMenuOpen)
  const setActiveView = useConfiguratorStore((s) => s.setActiveView)
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const setActiveVehicle = useConfiguratorStore((s) => s.setActiveVehicle)
  const activeStep = useConfiguratorStore((s) => s.activeStep)
  const setActiveStep = useConfiguratorStore((s) => s.setActiveStep)
  const selection = useConfiguratorStore((s) => s.selections[s.activeVehicleId])

  const t = translations[language]
  const vehicle = getVehicleById(activeVehicleId)
  const totalPrice = calculateTotalPrice(vehicle, selection)
  const optionsPrice = totalPrice - vehicle.basePrice

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#F0F3F7]/[0.09] bg-[#0B0D10] px-2.5 text-[#F3F5F8] sm:h-16 sm:px-4 lg:px-6">
      {/* Left: Menu Trigger + Progress Digital Wordmark + 3-Vehicle Selector */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-5">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="btn-tactile flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-2 py-1.5 text-xs font-medium text-[#F3F5F8] hover:bg-[#151920] sm:px-2.5"
          aria-label={t.menuLabel}
        >
          <Menu className="h-4 w-4 stroke-[1.75]" />
          <span className="hidden sm:inline">{t.menuLabel}</span>
        </button>

        <div className="hidden h-5 w-px bg-[#F0F3F7]/[0.09] sm:block" />

        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="hidden shrink-0 cursor-pointer items-center gap-2.5 text-left md:flex"
          title={t.menu.backToHome}
        >
          <img
            src="/brand/progress-digital-logo.webp"
            alt="Progress Digital"
            className="h-7 w-7 shrink-0 object-contain"
          />
          <div>
            <div className="font-wordmark text-[11px] leading-tight tracking-[0.2em] text-[#F3F5F8]">
              PROGRESS DIGITAL
            </div>
            <div className="text-[10px] leading-tight tracking-[0.16em] text-[#99A3B2]">
              {t.brandSubtitle}
            </div>
          </div>
        </button>

        <div className="hidden h-5 w-px bg-[#F0F3F7]/[0.09] md:block" />

        {/* 3-Vehicle Selector */}
        <nav
          aria-label="Vehicle models"
          className="flex items-center gap-0.5 rounded-full border border-[#F0F3F7]/[0.09] bg-[#151920] p-0.5 sm:gap-1 sm:p-1"
        >
          {VEHICLES.map((v) => {
            const isActive = v.id === activeVehicleId
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVehicle(v.id)}
                className={`btn-tactile cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${
                  isActive
                    ? 'bg-[#18C8F0]/[0.16] text-[#18C8F0] ring-1 ring-[#18C8F0]/45'
                    : 'text-[#99A3B2] hover:text-[#F3F5F8]'
                }`}
              >
                <span className="hidden lg:inline">{v.brand} </span>
                <span>
                  {v.id === 'mclaren-p1'
                    ? 'P1'
                    : v.id === 'lotus-exige-240'
                      ? 'Exige'
                      : 'Acty'}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Center: Step Navigation (Cian Progress Digital active telemetry underline) */}
      <nav
        aria-label="Configuration steps"
        className="hidden h-full items-center gap-1 xl:flex"
      >
        {STEPS.map((step) => {
          const isActive = activeStep === step
          return (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(step)}
              className={`relative flex h-full cursor-pointer items-center px-4 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'text-[#F3F5F8]'
                  : 'text-[#99A3B2] hover:text-[#F3F5F8]'
              }`}
            >
              {t.steps[step]}
              {isActive && (
                <span className="absolute right-2 bottom-0 left-2 h-[2px] rounded-t-full bg-[#18C8F0]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Right: EN/ES Toggle (sm+) + Dynamic Live Price */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div
          className="hidden items-center rounded-full border border-[#F0F3F7]/[0.12] bg-[#151920] p-0.5 text-xs font-medium sm:flex"
          role="group"
          aria-label="Language selector"
        >
          <Globe className="ml-2 mr-1 hidden h-3.5 w-3.5 text-[#758091] md:block" />
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`btn-tactile cursor-pointer rounded-full px-2 py-1 ${
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
            className={`btn-tactile cursor-pointer rounded-full px-2 py-1 ${
              language === 'es'
                ? 'bg-[#F3F5F8] text-[#090B0E]'
                : 'text-[#99A3B2] hover:text-[#F3F5F8]'
            }`}
          >
            ES
          </button>
        </div>

        {/* Live Total Price Button (Amarillo Señal highlight) */}
        <button
          type="button"
          onClick={() => setPriceOpen((prev) => !prev)}
          className="btn-tactile flex cursor-pointer items-center gap-1 rounded-xl px-1.5 py-1 text-right hover:bg-[#151920] sm:gap-2 sm:px-2.5 sm:py-1.5"
        >
          <div>
            <div className="tabular-nums text-sm font-semibold leading-tight text-[#F4C430] sm:text-base">
              {formatCurrency(totalPrice)}
            </div>
            <div className="hidden text-[11px] leading-tight text-[#99A3B2] sm:block">
              {t.topbar.totalAsBuilt}
            </div>
          </div>
          {priceOpen ? (
            <ChevronUp className="h-3.5 w-3.5 text-[#99A3B2] sm:h-4 sm:w-4" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[#99A3B2] sm:h-4 sm:w-4" />
          )}
        </button>
      </div>

      {/* Expandable Price & Specs Breakdown Popover */}
      {priceOpen && (
        <div className="absolute top-16 right-4 z-40 mt-2 w-80 rounded-2xl border border-[#F0F3F7]/[0.14] bg-[#101318] p-4 text-[#F3F5F8] shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#F3F5F8]">
                {vehicle.year} {vehicle.brand} {vehicle.name}
              </div>
              <div className="text-xs text-[#99A3B2]">
                {vehicle.category[language]}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPriceOpen(false)}
              className="cursor-pointer rounded-full p-1 text-[#99A3B2] hover:bg-[#151920] hover:text-[#F3F5F8]"
              aria-label={t.topbar.closeBreakdown}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5 border-y border-[#F0F3F7]/[0.09] py-3 text-xs">
            <div className="flex justify-between text-[#99A3B2]">
              <span>{t.topbar.baseVehicle}</span>
              <span className="tabular-nums font-medium text-[#F3F5F8]">
                {formatCurrency(vehicle.basePrice)}
              </span>
            </div>
            <div className="flex justify-between text-[#99A3B2]">
              <span>{t.topbar.selectedOptions}</span>
              <span className="tabular-nums font-medium text-[#18C8F0]">
                +{formatCurrency(optionsPrice)}
              </span>
            </div>
            <div className="flex justify-between pt-1.5 text-sm font-semibold text-[#F3F5F8]">
              <span>{t.topbar.totalAsBuilt}</span>
              <span className="tabular-nums text-[#F4C430]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-2 text-xs font-medium text-[#99A3B2]">
              {t.topbar.vehicleSpecs}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-[#F0F3F7]/[0.07] bg-[#151920] px-2.5 py-2">
                <div className="text-[11px] text-[#758091]">Power</div>
                <div className="font-semibold text-[#F3F5F8]">{vehicle.specs.power}</div>
              </div>
              <div className="rounded-xl border border-[#F0F3F7]/[0.07] bg-[#151920] px-2.5 py-2">
                <div className="text-[11px] text-[#758091]">Weight</div>
                <div className="font-semibold text-[#F3F5F8]">{vehicle.specs.weight}</div>
              </div>
              <div className="rounded-xl border border-[#F0F3F7]/[0.07] bg-[#151920] px-2.5 py-2">
                <div className="text-[11px] text-[#758091]">Drivetrain</div>
                <div className="font-semibold text-[#F3F5F8]">{vehicle.specs.drivetrain}</div>
              </div>
              <div className="rounded-xl border border-[#F0F3F7]/[0.07] bg-[#151920] px-2.5 py-2">
                <div className="text-[11px] text-[#758091]">Engine</div>
                <div className="truncate font-semibold text-[#F3F5F8]">
                  {vehicle.specs.layout[language]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
