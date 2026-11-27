import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ArrowRight } from 'lucide-react'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'

interface ParticleCarHeroProps {
  onEnterConfigurator: () => void
  onScrollToModels: () => void
}

const PULSE_DURATION = 820

interface Pulse {
  x: number
  y: number
  startedAt: number
}

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 aNormal;
  attribute float aRole;
  attribute float aSeed;

  uniform vec2 uOrigin;
  uniform float uProgress;
  uniform float uAspect;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vRim;

  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vec4 projected = projectionMatrix * view;
    vec2 offset = (projected.xy / projected.w - uOrigin) * vec2(uAspect, 1.0);
    float distanceToOrigin = length(offset);
    float expansion = 1.0 - pow(1.0 - uProgress, 3.0);
    float energy = 1.0 - smoothstep(0.25, 1.0, uProgress);
    energy *= step(0.001, uProgress);
    float radius = mix(0.025, 0.32, expansion);
    float ringOffset = (distanceToOrigin - radius) / 0.045;
    float ring = exp(-ringOffset * ringOffset) * energy;
    float cavity = (1.0 - smoothstep(radius * 0.35, radius, distanceToOrigin)) * energy;
    vec2 direction = offset / max(distanceToOrigin, 0.001);
    view.xy += direction * (ring * 0.24 + cavity * 0.18) * mix(0.44, 1.0, aSeed);

    vec3 normal = normalize(normalMatrix * aNormal);
    float key = max(dot(normal, normalize(vec3(-0.42, 0.76, 0.46))), 0.0);
    float silhouette = pow(1.0 - abs(dot(normal, normalize(-view.xyz))), 2.0);
    float paint = 1.0 - smoothstep(0.014, 0.035, abs(aRole - 0.85));
    float trim = smoothstep(0.88, 0.98, aRole);
    float facingSide = mix(0.07, 1.0, smoothstep(-0.66, 0.15, position.x));
    float shading = 0.18 + key * 0.48 + silhouette * 0.24 + paint * 0.27 + trim * 0.21;
    vAlpha = clamp((shading * (1.0 - cavity * 0.72) + ring * 0.45) * facingSide, 0.0, 1.0);
    vRim = ring;
    gl_PointSize = clamp(mix(1.2, 2.15, max(paint, trim)) * uPixelRatio + ring * 0.7, 1.0, 4.5);
    gl_Position = projectionMatrix * view;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uPaint;
  varying float vAlpha;
  varying float vRim;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float coverage = 1.0 - smoothstep(0.12, 0.5, distanceToCenter);
    vec3 color = mix(uPaint, vec3(1.0, 0.94, 0.73), vRim * 0.38);
    gl_FragColor = vec4(color, coverage * vAlpha);
  }
`

function ParticleCloudScene({
  pointsData,
  pulseRef,
  reducedMotion,
}: {
  pointsData: Float32Array
  pulseRef: React.RefObject<Pulse | null>
  reducedMotion: boolean
}) {
  const { size, camera, gl, invalidate } = useThree()
  const carGeometry = useMemo(() => {
    const stride = 7
    const count = Math.floor(pointsData.length / stride)
    const positions = new Float32Array(count * 3)
    const normals = new Float32Array(count * 3)
    const roles = new Float32Array(count)
    const seeds = new Float32Array(count)

    let s = 918273
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0
      return s / 4294967296
    }

    for (let i = 0; i < count; i++) {
      const o = i * stride
      positions[i * 3] = pointsData[o]
      positions[i * 3 + 1] = pointsData[o + 1]
      positions[i * 3 + 2] = pointsData[o + 2]

      normals[i * 3] = pointsData[o + 3]
      normals[i * 3 + 1] = pointsData[o + 4]
      normals[i * 3 + 2] = pointsData[o + 5]

      roles[i] = pointsData[o + 6]
      seeds[i] = rand()
    }

    const carGeo = new THREE.BufferGeometry()
    carGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    carGeo.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3))
    carGeo.setAttribute('aRole', new THREE.BufferAttribute(roles, 1))
    carGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    return carGeo
  }, [pointsData])

  const carMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uOrigin: { value: new THREE.Vector2() },
      uProgress: { value: 1 },
      uAspect: { value: 1 },
      uPixelRatio: { value: 1 },
      uPaint: { value: new THREE.Color().setRGB(244 / 255, 196 / 255, 48 / 255) },
    },
  }), [])

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    camera.position.set(0, 0.46, Math.max(6.6, 9.9 / aspect))
    camera.lookAt(0, 0.12, 0)
    camera.updateProjectionMatrix()
    carMaterial.uniforms.uAspect.value = aspect
    carMaterial.uniforms.uPixelRatio.value = gl.getPixelRatio()
    invalidate()
  }, [size.width, size.height, camera, carMaterial, gl, invalidate])

  useEffect(() => () => {
    carGeometry.dispose()
    carMaterial.dispose()
  }, [carGeometry, carMaterial])

  useFrame(() => {
    const pulse = reducedMotion ? null : pulseRef.current
    const progress = pulse ? Math.min(1, (performance.now() - pulse.startedAt) / PULSE_DURATION) : 1
    carMaterial.uniforms.uProgress.value = progress
    if (pulse && progress < 1) {
      carMaterial.uniforms.uOrigin.value.set(pulse.x, pulse.y)
      invalidate()
    }
  })

  return (
    <points
      geometry={carGeometry}
      material={carMaterial}
      position={[0, -0.34, 0]}
      rotation={[0.035, -1.48, 0]}
    />
  )
}

export function ParticleCarHero({
  onEnterConfigurator,
  onScrollToModels,
}: ParticleCarHeroProps) {
  const [pointsData, setPointsData] = useState<Float32Array | null>(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const pulseRef = useRef<Pulse | null>(null)
  const invalidateRef = useRef<(() => void) | null>(null)

  function triggerPulse(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !invalidateRef.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = 2 * (event.clientX - bounds.left) / bounds.width - 1
    const y = 1 - 2 * (event.clientY - bounds.top) / bounds.height
    const startedAt = performance.now()
    const previous = pulseRef.current
    if (previous && startedAt - previous.startedAt < PULSE_DURATION) return
    if (previous && event.type === 'pointermove' && Math.hypot(x - previous.x, y - previous.y) < 0.08) return
    pulseRef.current = { x, y, startedAt }
    invalidateRef.current()
  }

  const language = useConfiguratorStore((s) => s.language)
  const t = translations[language]

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(motionPreference.matches)
    syncMotion()
    motionPreference.addEventListener('change', syncMotion)

    let cancelled = false
    fetch('/models/hero-p1-points.bin')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load McLaren point cloud')
        return res.arrayBuffer()
      })
      .then((buf) => {
        if (!cancelled) setPointsData(new Float32Array(buf))
      })
      .catch(() => {
        // Silently degrade to atmospheric background if fetch interrupted
      })

    return () => {
      cancelled = true
      motionPreference.removeEventListener('change', syncMotion)
    }
  }, [])

  return (
    <section
      aria-label="Progress Digital Showroom"
      className="relative flex w-full flex-col overflow-hidden bg-pd-bg pt-16 pb-10 text-[#F3F5F8] md:block md:h-[94svh] md:min-h-[620px] md:max-h-[960px] md:pt-0 md:pb-0"
    >
      <div
        className="hero-stage relative h-[255px] w-full shrink-0 touch-pan-y sm:h-[320px] md:absolute md:inset-0 md:h-full"
        onPointerDown={triggerPulse}
        onPointerMove={(event) => {
          if (event.pointerType !== 'touch' || event.buttons !== 0) triggerPulse(event)
        }}
      >
        {pointsData && (
          <Canvas
            dpr={[1, 1.75]}
            frameloop="demand"
            onCreated={({ invalidate }) => { invalidateRef.current = invalidate }}
            fallback={<img src="/previews/profile-mclaren-p1.png" alt="McLaren P1" className="hero-fallback" />}
            camera={{ position: [0, 0.68, 6.4], fov: 32, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ParticleCloudScene
              pointsData={pointsData}
              reducedMotion={reducedMotion}
              pulseRef={pulseRef}
            />
          </Canvas>
        )}
        {!pointsData && <img src="/previews/profile-mclaren-p1.png" alt="McLaren P1" className="hero-fallback" />}

      </div>

      {/* Desktop bottom editorial vignette for effortless legibility */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-56 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-transparent md:block"
        aria-hidden="true"
      />

      {/* Headline & Amarillo Señal Primary CTA (12.1:1 AAA contrast) */}
      <div className="pointer-events-none relative z-10 flex flex-col justify-end px-6 pt-3 sm:px-10 md:h-full md:px-12 md:pt-0 md:pb-12 lg:px-16 lg:pb-14">
        <div className="max-w-2xl">
          <h1 className="animate-hero-lead text-[clamp(2.25rem,4vw,3.75rem)] leading-[1] font-medium tracking-[-0.035em] text-[#F3F5F8]">
            <span className="block">{t.landing.heroTitleLine1}</span>
            <span className="block text-pd-secondary">{t.landing.heroTitleLine2}</span>
          </h1>

          <div className="animate-hero-support pointer-events-auto mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <button
              type="button"
              onClick={onEnterConfigurator}
              className="btn-tactile group inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-pd-signal px-6 text-sm font-medium text-[#090B0E] hover:bg-[#FFD44F] sm:h-12 sm:px-7"
            >
              <span>{t.landing.heroCta}</span>
              <ArrowRight className="h-4 w-4 stroke-[1.75] transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={onScrollToModels}
              className="btn-tactile inline-flex h-11 cursor-pointer items-center rounded-full border border-[#F0F3F7]/[0.22] bg-[#151920]/70 px-5 text-sm font-normal text-[#F3F5F8] hover:border-[#F0F3F7]/40 hover:bg-[#1B2029] sm:h-12 sm:px-6"
            >
              {t.landing.heroSecondaryCta}
            </button>
          </div>
        </div>
      </div>

    </section>
  )
}
