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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D10]/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
    >
      <div className="showroom-studio flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#F0F3F7]/[0.14] bg-[#101318] text-[#F3F5F8] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0F3F7]/[0.09] px-6 py-4">
          <div>
            <h2 id="summary-title" className="text-lg font-semibold text-[#F3F5F8]">
              {t.summary.title}
            </h2>
            <p className="text-xs text-[#99A3B2]">{t.summary.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setSummaryOpen(false)}
            className="btn-tactile cursor-pointer rounded-full p-1.5 text-[#99A3B2] hover:bg-[#151920] hover:text-[#F3F5F8]"
            aria-label={t.summary.backToEdit}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="config-scroll grid flex-1 gap-6 overflow-y-auto p-6 md:grid-cols-2">
          {/* Left: Captured Live Preview + Specs */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-[#F0F3F7]/[0.09] bg-[#0B0D10]">
              {snapshotUrl ? (
                <img
                  src={snapshotUrl}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center text-xs text-[#758091]">
                  Preview captured on render
                </div>
              )}
            </div>

            <div>
              <div className="text-base font-semibold text-[#F3F5F8]">
                {vehicle.year} {vehicle.brand} {vehicle.name}
              </div>
              <div className="mt-0.5 text-xs text-[#99A3B2]">
                {vehicle.specs.power} · {vehicle.specs.weight} · {vehicle.specs.drivetrain}
              </div>
            </div>

            {/* Branded agency & 3D model attribution footer */}
            <div className="rounded-xl border border-[#F0F3F7]/[0.09] bg-[#151920] p-3 text-[11px] leading-relaxed text-[#99A3B2]">
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
                    className="font-semibold text-[#F3F5F8] underline decoration-[#18C8F0]/70 underline-offset-2 hover:text-[#18C8F0]"
                  >
                    progressdigital.company
                  </a>
                </span>
              </div>
              <p className="text-[#758091]">{t.summary.disclaimer}</p>
              <a
                href={vehicle.attribution.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 font-medium text-[#F3F5F8] hover:text-[#18C8F0]"
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
              <div className="flex items-center justify-between border-b border-[#F0F3F7]/[0.09] pb-2.5">
                <span className="text-[#99A3B2]">{t.summary.basePrice}</span>
                <span className="tabular-nums font-semibold text-[#F3F5F8]">
                  {formatCurrency(vehicle.basePrice)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F0F3F7]/[0.09] pb-2.5">
                <div>
                  <div className="text-xs text-[#758091]">{t.summary.exteriorPaint}</div>
                  <div className="flex items-center gap-2 font-medium text-[#F3F5F8]">
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-white/25"
                      style={{ backgroundColor: paint.hex }}
                    />
                    <span>
                      {paint.name[language]} ({t.finishes[paint.finish]})
                    </span>
                  </div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#F4C430]">
                  {paint.price === 0 ? t.sidebar.included : `+${formatCurrency(paint.price)}`}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F0F3F7]/[0.09] pb-2.5">
                <div>
                  <div className="text-xs text-[#758091]">{t.summary.interiorTrim}</div>
                  <div className="font-medium text-[#F3F5F8]">{interior.name[language]}</div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#F4C430]">
                  {interior.price === 0
                    ? t.sidebar.included
                    : `+${formatCurrency(interior.price)}`}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F0F3F7]/[0.09] pb-2.5">
                <div>
                  <div className="text-xs text-[#758091]">{t.summary.wheels}</div>
                  <div className="font-medium text-[#F3F5F8]">{wheel.name[language]}</div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#F4C430]">
                  {wheel.price === 0 ? t.sidebar.included : `+${formatCurrency(wheel.price)}`}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F0F3F7]/[0.09] pb-2.5">
                <div>
                  <div className="text-xs text-[#758091]">{t.summary.brakeCalipers}</div>
                  <div className="font-medium text-[#F3F5F8]">{caliper.name[language]}</div>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#F4C430]">
                  {caliper.price === 0
                    ? t.sidebar.included
                    : `+${formatCurrency(caliper.price)}`}
                </span>
              </div>

              <div className="border-b border-[#F0F3F7]/[0.09] pb-2.5">
                <div className="mb-1 text-xs text-[#758091]">{t.summary.accessories}</div>
                {enabledAccessories.length === 0 ? (
                  <div className="text-xs text-[#758091]">{t.summary.noAccessories}</div>
                ) : (
                  <div className="space-y-1">
                    {enabledAccessories.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#F3F5F8]">{acc.name[language]}</span>
                        <span className="tabular-nums font-semibold text-[#F4C430]">
                          +{formatCurrency(acc.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <span className="text-sm font-semibold text-[#F3F5F8]">
                  {t.summary.totalEstimated}
                </span>
                <span className="tabular-nums text-xl font-semibold text-[#F4C430]">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F3F7]/[0.09] bg-[#0B0D10] px-6 py-4">
          <button
            type="button"
            onClick={() => setSummaryOpen(false)}
            className="btn-tactile cursor-pointer rounded-full px-4 py-2 text-xs font-medium text-[#99A3B2] hover:text-[#F3F5F8]"
          >
            {t.summary.backToEdit}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-tactile flex cursor-pointer items-center gap-1.5 rounded-full border border-[#F0F3F7]/[0.22] bg-transparent px-4 py-2 text-xs font-medium text-[#F3F5F8] hover:border-[#F0F3F7]/40 hover:bg-[#151920]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#34D399]" />
                  <span className="text-[#34D399]">{t.sidebar.linkCopied}</span>
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
              className="btn-tactile flex cursor-pointer items-center gap-1.5 rounded-full bg-[#F4C430] px-5 py-2 text-xs font-semibold text-[#090B0E] hover:bg-[#FFD44F]"
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
