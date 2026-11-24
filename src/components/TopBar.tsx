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
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-2.5 sm:h-16 sm:px-4 lg:px-6">
      {/* Left: Porsche Menu Trigger + Progress Digital Wordmark + 3-Vehicle Selector */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-5">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-xs font-medium text-[#111316] transition-colors hover:bg-[#F4F5F7] sm:px-2"
          aria-label={t.menuLabel}
        >
          <Menu className="h-4 w-4 stroke-[1.9]" />
          <span className="hidden sm:inline">{t.menuLabel}</span>
        </button>

        <div className="hidden h-5 w-px bg-[#E5E7EB] sm:block" />

        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="hidden shrink-0 cursor-pointer text-left md:block"
          title={t.menu.backToHome}
        >
          <div className="font-wordmark text-[11px] tracking-[0.2em] text-[#111316]">
            PROGRESS DIGITAL
          </div>
          <div className="text-[10px] tracking-[0.16em] text-[#59606B] uppercase">
            {t.brandSubtitle}
          </div>
        </button>

        <div className="hidden h-5 w-px bg-[#E5E7EB] md:block" />

        {/* 3-Vehicle Selector */}
        <nav
          aria-label="Vehicle models"
          className="flex items-center gap-0.5 rounded-lg bg-[#F4F5F7] p-0.5 sm:gap-1 sm:p-1"
        >
          {VEHICLES.map((v) => {
            const isActive = v.id === activeVehicleId
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVehicle(v.id)}
                className={`cursor-pointer whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-colors sm:px-2.5 sm:py-1.5 sm:text-xs ${
                  isActive
                    ? 'bg-white text-[#111316] shadow-xs ring-1 ring-black/6'
                    : 'text-[#59606B] hover:text-[#111316]'
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

      {/* Center: Step Navigation */}
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
                  ? 'text-[#111316]'
                  : 'text-[#59606B] hover:text-[#111316]'
              }`}
            >
              {t.steps[step]}
              {isActive && (
                <span className="absolute right-2 bottom-0 left-2 h-[3px] rounded-t-full bg-[#C8102E]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Right: EN/ES Toggle (sm+) + Dynamic Live Price */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div
          className="hidden items-center rounded-lg border border-[#E5E7EB] bg-[#F4F5F7] p-0.5 text-xs font-medium sm:flex"
          role="group"
          aria-label="Language selector"
        >
          <Globe className="ml-1.5 mr-1 hidden h-3.5 w-3.5 text-[#59606B] md:block" />
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`cursor-pointer rounded-md px-2 py-1 transition-colors ${
              language === 'en'
                ? 'bg-white text-[#111316] shadow-xs'
                : 'text-[#59606B] hover:text-[#111316]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`cursor-pointer rounded-md px-2 py-1 transition-colors ${
              language === 'es'
                ? 'bg-white text-[#111316] shadow-xs'
                : 'text-[#59606B] hover:text-[#111316]'
            }`}
          >
            ES
          </button>
        </div>

        {/* Live Total Price Button */}
        <button
          type="button"
          onClick={() => setPriceOpen((prev) => !prev)}
          className="flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1 text-right transition-colors hover:bg-[#F4F5F7] sm:gap-2 sm:px-2.5 sm:py-1.5"
        >
          <div>
            <div className="tabular-nums text-sm font-semibold leading-tight text-[#111316] sm:text-base">
              {formatCurrency(totalPrice)}
            </div>
            <div className="hidden text-[11px] leading-tight text-[#59606B] sm:block">
              {t.topbar.totalAsBuilt}
            </div>
          </div>
          {priceOpen ? (
            <ChevronUp className="h-3.5 w-3.5 text-[#59606B] sm:h-4 sm:w-4" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[#59606B] sm:h-4 sm:w-4" />
          )}
        </button>
      </div>

      {/* Expandable Price & Specs Breakdown Popover */}
      {priceOpen && (
        <div className="absolute top-16 right-4 z-40 mt-2 w-80 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#111316]">
                {vehicle.year} {vehicle.brand} {vehicle.name}
              </div>
              <div className="text-xs text-[#59606B]">
                {vehicle.category[language]}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPriceOpen(false)}
              className="cursor-pointer rounded-md p-1 text-[#59606B] hover:bg-[#F4F5F7] hover:text-[#111316]"
              aria-label={t.topbar.closeBreakdown}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5 border-y border-[#E5E7EB] py-3 text-xs">
            <div className="flex justify-between text-[#59606B]">
              <span>{t.topbar.baseVehicle}</span>
              <span className="tabular-nums font-medium text-[#111316]">
                {formatCurrency(vehicle.basePrice)}
              </span>
            </div>
            <div className="flex justify-between text-[#59606B]">
              <span>{t.topbar.selectedOptions}</span>
              <span className="tabular-nums font-medium text-[#111316]">
                +{formatCurrency(optionsPrice)}
              </span>
            </div>
            <div className="flex justify-between pt-1.5 text-sm font-semibold text-[#111316]">
              <span>{t.topbar.totalAsBuilt}</span>
              <span className="tabular-nums">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-2 text-xs font-medium text-[#59606B]">
              {t.topbar.vehicleSpecs}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-[#F4F5F7] px-2.5 py-2">
                <div className="text-[11px] text-[#59606B]">Power</div>
                <div className="font-semibold text-[#111316]">{vehicle.specs.power}</div>
              </div>
              <div className="rounded-lg bg-[#F4F5F7] px-2.5 py-2">
                <div className="text-[11px] text-[#59606B]">Weight</div>
                <div className="font-semibold text-[#111316]">{vehicle.specs.weight}</div>
              </div>
              <div className="rounded-lg bg-[#F4F5F7] px-2.5 py-2">
                <div className="text-[11px] text-[#59606B]">Drivetrain</div>
                <div className="font-semibold text-[#111316]">{vehicle.specs.drivetrain}</div>
              </div>
              <div className="rounded-lg bg-[#F4F5F7] px-2.5 py-2">
                <div className="text-[11px] text-[#59606B]">Engine</div>
                <div className="truncate font-semibold text-[#111316]">
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
