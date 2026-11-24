import { useEffect, useState } from 'react'
import { Check, Download, ExternalLink, Share2, X } from 'lucide-react'
import { calculateTotalPrice, getVehicleById } from '../config/vehicles'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import { formatCurrency } from './TopBar'

interface SummaryModalProps {
  captureSnapshot: () => string | null
}

export function SummaryModal({ captureSnapshot }: SummaryModalProps) {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const summaryOpen = useConfiguratorStore((s) => s.summaryOpen)
  const setSummaryOpen = useConfiguratorStore((s) => s.setSummaryOpen)
  const language = useConfiguratorStore((s) => s.language)
  const activeVehicleId = useConfiguratorStore((s) => s.activeVehicleId)
  const selection = useConfiguratorStore((s) => s.selections[s.activeVehicleId])
  const getShareUrl = useConfiguratorStore((s) => s.getShareUrl)

  const t = translations[language]
  const vehicle = getVehicleById(activeVehicleId)

  const paint =
    vehicle.paints.find((p) => p.id === selection.paintId) ?? vehicle.paints[0]
  const interior =
    vehicle.interiors.find((i) => i.id === selection.interiorId) ?? vehicle.interiors[0]
  const wheel =
    vehicle.wheels.find((w) => w.id === selection.wheelId) ?? vehicle.wheels[0]
  const caliper =
    vehicle.calipers.find((c) => c.id === selection.caliperId) ?? vehicle.calipers[0]
  const enabledAccessories = vehicle.accessories.filter((a) =>
    selection.accessoryIds.includes(a.id)
  )
  const totalPrice = calculateTotalPrice(vehicle, selection)

  useEffect(() => {
    if (summaryOpen) {
      setSnapshotUrl(captureSnapshot())
    }
  }, [summaryOpen, captureSnapshot])

  if (!summaryOpen) return null

  const handleDownload = () => {
    const dataUrl = snapshotUrl ?? captureSnapshot()
    if (!dataUrl) return
    const link = document.createElement('a')
    link.download = `${vehicle.id}-configuration.png`
    link.href = dataUrl
    link.click()
  }

  const handleCopyLink = async () => {
    const url = getShareUrl()
    window.history.replaceState({}, '', url)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard fallback ignored
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E6E8EC] px-6 py-4">
          <div>
            <h2 id="summary-title" className="text-lg font-bold text-[#141619]">
              {t.summary.title}
            </h2>
            <p className="text-xs text-[#5C636E]">{t.summary.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setSummaryOpen(false)}
            className="cursor-pointer rounded-lg p-1.5 text-[#5C636E] hover:bg-[#F5F6F8] hover:text-[#141619]"
            aria-label={t.summary.backToEdit}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="config-scroll grid flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-2">
          {/* Left: Captured Live Preview + Specs */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-[#E6E8EC] bg-[#141619]">
              {snapshotUrl ? (
                <img
                  src={snapshotUrl}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center text-xs text-white/60">
                  Preview captured on render
                </div>
              )}
            </div>

            <div>
              <div className="text-base font-bold text-[#141619]">
                {vehicle.year} {vehicle.brand} {vehicle.name}
              </div>
              <div className="mt-0.5 text-xs text-[#5C636E]">
                {vehicle.specs.power} · {vehicle.specs.weight} · {vehicle.specs.drivetrain}
              </div>
            </div>

            {/* Branded agency & 3D model attribution footer */}
            <div className="rounded-xl bg-[#F5F6F8] p-3 text-[11px] leading-relaxed text-[#5C636E]">
              <div className="mb-1.5 flex items-center gap-2">
                <img
                  src="/brand/progress-digital-logo.webp"
                  alt="Progress Digital"
                  className="h-4 w-4 shrink-0 object-contain"
                />
                <span>
                  {t.madeBy}{' '}
                  <a
                    href="https://progressdigital.company"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#141619] underline decoration-[#0ea5e9]/60 underline-offset-2 hover:text-[#0284c7]"
                  >
                    progressdigital.company
                  </a>
                </span>
              </div>
              <p>{t.summary.disclaimer}</p>
              <a
                href={vehicle.attribution.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 font-medium text-[#141619] hover:text-[#C8102E]"
              >
                <span>
                  {t.summary.modelCredit}: {vehicle.attribution.modelTitle} by{' '}
                  {vehicle.attribution.author}
                </span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Right: Itemized Commercial Price Sheet */}
          <div className="flex flex-col justify-between">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-2.5">
                <span className="text-[#5C636E]">{t.summary.basePrice}</span>
                <span className="tabular-nums font-semibold text-[#141619]">
                  {formatCurrency(vehicle.basePrice)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-2.5">
                <div>
                  <div className="text-xs text-[#5C636E]">{t.summary.exteriorPaint}</div>
                  <div className="flex items-center gap-2 font-medium text-[#141619]">
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-black/15"
                      style={{ backgroundColor: paint.hex }}
                    />
                    <span>
                      {paint.name[language]} ({t.finishes[paint.finish]})
                    </span>
                  </div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#141619]">
                  {paint.price === 0 ? t.sidebar.included : `+${formatCurrency(paint.price)}`}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-2.5">
                <div>
                  <div className="text-xs text-[#5C636E]">{t.summary.interiorTrim}</div>
                  <div className="font-medium text-[#141619]">{interior.name[language]}</div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#141619]">
                  {interior.price === 0
                    ? t.sidebar.included
                    : `+${formatCurrency(interior.price)}`}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-2.5">
                <div>
                  <div className="text-xs text-[#5C636E]">{t.summary.wheels}</div>
                  <div className="font-medium text-[#141619]">{wheel.name[language]}</div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#141619]">
                  {wheel.price === 0 ? t.sidebar.included : `+${formatCurrency(wheel.price)}`}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-2.5">
                <div>
                  <div className="text-xs text-[#5C636E]">{t.summary.brakeCalipers}</div>
                  <div className="font-medium text-[#141619]">{caliper.name[language]}</div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#141619]">
                  {caliper.price === 0
                    ? t.sidebar.included
                    : `+${formatCurrency(caliper.price)}`}
                </span>
              </div>

              <div className="border-b border-[#E6E8EC] pb-2.5">
                <div className="mb-1 text-xs text-[#5C636E]">{t.summary.accessories}</div>
                {enabledAccessories.length === 0 ? (
                  <div className="text-xs text-[#5C636E]">{t.summary.noAccessories}</div>
                ) : (
                  <div className="space-y-1">
                    {enabledAccessories.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#141619]">{acc.name[language]}</span>
                        <span className="tabular-nums font-semibold text-[#141619]">
                          +{formatCurrency(acc.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <span className="text-sm font-semibold text-[#141619]">
                  {t.summary.totalEstimated}
                </span>
                <span className="tabular-nums text-xl font-bold text-[#141619]">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E6E8EC] bg-[#F5F6F8] px-6 py-4">
          <button
            type="button"
            onClick={() => setSummaryOpen(false)}
            className="cursor-pointer rounded-full px-4 py-2 text-xs font-semibold text-[#5C636E] hover:text-[#141619]"
          >
            {t.summary.backToEdit}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#141619] bg-white px-4 py-2 text-xs font-semibold text-[#141619] hover:bg-[#F5F6F8]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{t.sidebar.linkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{t.summary.copyShareLink}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#C8102E] px-5 py-2 text-xs font-semibold text-white hover:bg-[#a90d26]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t.summary.downloadImage}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
