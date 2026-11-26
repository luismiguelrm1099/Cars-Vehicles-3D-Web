import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { translations } from '../i18n/translations'
import { useConfiguratorStore } from '../store/useConfiguratorStore'

interface ParticleCarHeroProps {
  onEnterConfigurator: () => void
  onScrollToModels: () => void
}

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 aNormal;
  attribute float aRole;
  attribute float aSeed;

  uniform float uTime;
  uniform float uMotion;
  uniform float uMobileBoost;
  uniform vec3 uCursor3D;
  uniform float uCursorActive;
  uniform float uPixelRatio;

  varying float vBrightness;
  varying float vWarmth;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    vec3 norm = normalize(aNormal);

    // Subtle organic breathing shimmer along surface normal
    float breathe = sin(uTime * 1.4 + aSeed * 6.2831 + pos.z * 1.3) * 0.008 * uMotion;
    pos += norm * breathe;

    // Aerodynamic cursor wake dispersion in 3D space (desktop fine pointer only)
    float distToCursor = distance(pos, uCursor3D);
    float radius = 1.15;
    float influence = uCursorActive * uMotion * smoothstep(radius, 0.0, distToCursor);
    float wake = influence * influence;

    // Push particles softly outward + backward along slipstream (-Z rear)
    vec3 swirl = vec3(
      sin(aSeed * 19.0 + uTime * 3.0) * 0.14,
      cos(aSeed * 13.0 + uTime * 2.6) * 0.12 + 0.06,
      -0.36
    );
    pos += (norm * 0.24 + swirl) * wake;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vec3 viewDir = normalize(-mvPosition.xyz);
    vec3 worldNormal = normalize(normalMatrix * norm);

    // Dramatic overhead-front-left studio key light + sharp Fresnel silhouette rim
    vec3 keyLight = normalize(vec3(-0.35, 0.9, 0.45));
    vec3 rimLight = normalize(vec3(0.65, 0.45, -0.55));
    float ndl = max(dot(worldNormal, keyLight), 0.0);
    float rim = pow(1.0 - abs(dot(worldNormal, viewDir)), 1.6);
    float backRim = max(dot(worldNormal, rimLight), 0.0) * 0.45;

    // Emphasize wheels, headlights, upper fender crests & sculpted side intake
    float highBoost = smoothstep(0.9, 1.0, aRole) * 0.55;
    float shade = (0.14 + ndl * 0.72 + rim * 0.8 + backRim) * (0.38 + aRole * 0.76) + highBoost;
    float sparkle = 0.86 + 0.14 * sin(uTime * 2.8 + aSeed * 43.0);

    // On compact mobile canvas, 36k additive points overlap ~7x denser per pixel: attenuate alpha & size so gold shading stays sculpted, never blown out
    float mobileAlphaAtten = mix(1.0, 0.36, uMobileBoost);
    float mobileBrightAtten = mix(1.0, 0.78, uMobileBoost);
    float mobileSizeScale = mix(1.0, 0.58, uMobileBoost);

    vBrightness = clamp(shade * sparkle * mobileBrightAtten + wake * 0.9, 0.08, 1.55);
    vWarmth = clamp(aRole + wake * 0.45, 0.0, 1.0);
    vAlpha = clamp((0.24 + shade * 0.82) * mobileAlphaAtten + wake * 0.35, 0.06, 1.0);

    // Fine pinpoint molten-gold sizing
    float baseSize = (mix(1.05, 2.2, aRole) + rim * 0.68 + wake * 1.3) * mobileSizeScale;
    gl_PointSize = clamp(baseSize * uPixelRatio * (5.2 / max(1.0, -mvPosition.z)), 0.9, 5.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  varying float vBrightness;
  varying float vWarmth;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.1, d);
    float hotCore = smoothstep(0.24, 0.0, d);

    vec3 deepAmber = vec3(0.52, 0.24, 0.03);
    vec3 richGold = vec3(0.96, 0.70, 0.24);
    vec3 champagneWhite = vec3(1.0, 0.96, 0.84);

    vec3 col = mix(deepAmber, richGold, clamp(vBrightness * 0.95, 0.0, 1.0));
    col = mix(col, champagneWhite, clamp((vBrightness - 0.76) * 1.35 + hotCore * 0.42 * vWarmth, 0.0, 1.0));

    gl_FragColor = vec4(col, core * vAlpha);
  }
`

const EMBER_VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aSpeed;

  uniform float uTime;
  uniform float uMotion;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vEmberHue;

  void main() {
    vec3 pos = position;
    float t = uTime * aSpeed * 0.34 * uMotion + aSeed * 10.0;
    float cycle = fract(t);

    // Drift gently backward & upward off the hypercar body like molten embers in obsidian air
    pos.z -= cycle * 1.6;
    pos.y += cycle * 0.7 + sin(cycle * 6.2831 + aSeed * 12.0) * 0.08;
    pos.x += cos(cycle * 4.5 + aSeed * 17.0) * 0.14;

    float fadeIn = smoothstep(0.0, 0.18, cycle);
    float fadeOut = smoothstep(1.0, 0.55, cycle);
    vAlpha = fadeIn * fadeOut * (0.45 + 0.45 * sin(uTime * 3.0 + aSeed * 31.0));
    vEmberHue = fract(aSeed * 13.7);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp((1.6 + fract(aSeed * 7.3) * 2.5) * uPixelRatio * (4.2 / max(1.0, -mvPosition.z)), 1.0, 6.8);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const EMBER_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying float vEmberHue;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    uv.x *= 0.72;
    float d = length(uv);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.06, d);
    // Warm molten gold with occasional subtle Progress Digital blue spark
    vec3 goldCol = mix(vec3(0.92, 0.60, 0.18), vec3(1.0, 0.92, 0.72), glow);
    vec3 brandBlueSpark = vec3(0.125, 0.675, 0.925);
    vec3 col = mix(goldCol, brandBlueSpark, step(0.86, vEmberHue) * 0.55);
    gl_FragColor = vec4(col, glow * vAlpha);
  }
`

interface ParticleCloudSceneProps {
  pointsData: Float32Array
  paused: boolean
  reducedMotion: boolean
  isMobileView: boolean
  pointerRef: React.MutableRefObject<{ nx: number; ny: number; active: boolean }>
}

function ParticleCloudScene({
  pointsData,
  paused,
  reducedMotion,
  isMobileView,
  pointerRef,
}: ParticleCloudSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const smoothPointer = useRef({ nx: 0, ny: 0, active: 0 })
  const elapsedRef = useRef(0)
  const { size, camera } = useThree()

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    let targetZ: number
    let targetY: number

    if (isMobileView) {
      // Dedicated wide mobile stage (e.g. 390x235 -> aspect ~1.65): frame entire car cleanly nose-to-tail
      targetZ = aspect < 1.35 ? 8.1 : 6.9
      targetY = 0.56
    } else {
      targetZ = aspect < 1.25 ? 7.4 : 6.2
      targetY = 0.72
    }

    camera.position.set(0, targetY, targetZ)
    camera.lookAt(0, isMobileView ? 0.16 : 0.08, 0)
    camera.updateProjectionMatrix()
  }, [size.width, size.height, isMobileView, camera])

  const { carGeometry, emberGeometry } = useMemo(() => {
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

    // Sample 460 drifting molten embers spawned from upper body/fender points
    const emberCount = 460
    const emberPos = new Float32Array(emberCount * 3)
    const emberSeed = new Float32Array(emberCount)
    const emberSpeed = new Float32Array(emberCount)

    for (let i = 0; i < emberCount; i++) {
      const srcIdx = Math.floor(rand() * count)
      emberPos[i * 3] = positions[srcIdx * 3] + (rand() - 0.5) * 0.24
      emberPos[i * 3 + 1] = Math.max(0.25, positions[srcIdx * 3 + 1]) + rand() * 0.26
      emberPos[i * 3 + 2] = positions[srcIdx * 3 + 2] + (rand() - 0.5) * 0.28
      emberSeed[i] = rand()
      emberSpeed[i] = 0.5 + rand() * 0.9
    }

    const emberGeo = new THREE.BufferGeometry()
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3))
    emberGeo.setAttribute('aSeed', new THREE.BufferAttribute(emberSeed, 1))
    emberGeo.setAttribute('aSpeed', new THREE.BufferAttribute(emberSpeed, 1))

    return { carGeometry: carGeo, emberGeometry: emberGeo }
  }, [pointsData])

  const carMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMotion: { value: 1 },
          uMobileBoost: { value: 0 },
          uCursor3D: { value: new THREE.Vector3(99, 99, 99) },
          uCursorActive: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        },
      }),
    []
  )

  const emberMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: EMBER_VERTEX,
        fragmentShader: EMBER_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMotion: { value: 1 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        },
      }),
    []
  )

  useEffect(() => {
    return () => {
      carGeometry.dispose()
      emberGeometry.dispose()
      carMaterial.dispose()
      emberMaterial.dispose()
    }
  }, [carGeometry, emberGeometry, carMaterial, emberMaterial])

  useFrame((_, delta) => {
    const activeMotion = !paused && !reducedMotion
    const dt = Math.min(delta, 0.05)
    if (activeMotion) {
      elapsedRef.current += dt
    }

    const allowPointer = !isMobileView && pointerRef.current.active
    const targetNx = allowPointer ? pointerRef.current.nx : 0
    const targetNy = allowPointer ? pointerRef.current.ny : 0
    const targetActive = allowPointer ? 1 : 0

    smoothPointer.current.nx += (targetNx - smoothPointer.current.nx) * 0.065
    smoothPointer.current.ny += (targetNy - smoothPointer.current.ny) * 0.065
    smoothPointer.current.active += (targetActive - smoothPointer.current.active) * 0.08

    // Iconic front-left 3/4 stance; completely static orientation on mobile (no rotation/sway)
    const baseYaw = -0.92
    if (groupRef.current) {
      if (isMobileView) {
        groupRef.current.rotation.y = baseYaw
        groupRef.current.rotation.x = 0.05
      } else {
        const idleSway = activeMotion ? Math.sin(elapsedRef.current * 0.35) * 0.045 : 0
        groupRef.current.rotation.y = baseYaw + idleSway + smoothPointer.current.nx * 0.22
        groupRef.current.rotation.x = 0.06 + smoothPointer.current.ny * 0.06
      }
    }

    carMaterial.uniforms.uTime.value = elapsedRef.current
    carMaterial.uniforms.uMotion.value = activeMotion ? 1.0 : 0.0
    carMaterial.uniforms.uMobileBoost.value = isMobileView ? 1.0 : 0.0
    carMaterial.uniforms.uCursorActive.value = smoothPointer.current.active
    carMaterial.uniforms.uCursor3D.value.set(
      smoothPointer.current.nx * 1.6,
      0.62 - smoothPointer.current.ny * 0.85,
      -smoothPointer.current.nx * 1.9
    )

    emberMaterial.uniforms.uTime.value = elapsedRef.current
    emberMaterial.uniforms.uMotion.value = activeMotion ? 1.0 : 0.0
  })

  return (
    <group
      ref={groupRef}
      position={isMobileView ? [0.05, -0.34, 0] : [0.35, -0.32, 0]}
    >
      <points geometry={carGeometry} material={carMaterial} />
      <points geometry={emberGeometry} material={emberMaterial} />
    </group>
  )
}

export function ParticleCarHero({
  onEnterConfigurator,
  onScrollToModels,
}: ParticleCarHeroProps) {
  const [pointsData, setPointsData] = useState<Float32Array | null>(null)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const pointerRef = useRef({ nx: 0, ny: 0, active: false })

  const language = useConfiguratorStore((s) => s.language)
  const t = translations[language]

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const mq = window.matchMedia('(max-width: 767px)')
    const syncMobile = () => setIsMobileView(mq.matches)
    syncMobile()
    mq.addEventListener('change', syncMobile)

    let cancelled = false
    fetch('/models/hero-p1-points.bin')
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        if (!cancelled) setPointsData(new Float32Array(buf))
      })
      .catch(() => {
        // Silently degrade to atmospheric background if fetch interrupted
      })

    return () => {
      cancelled = true
      mq.removeEventListener('change', syncMobile)
    }
  }, [])

  return (
    <section
      aria-label="Progress Digital Showroom Hero"
      onPointerMove={(e) => {
        if (isMobileView || e.pointerType === 'touch') return
        const rect = e.currentTarget.getBoundingClientRect()
        pointerRef.current.nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2
        pointerRef.current.ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2
        pointerRef.current.active = true
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false
      }}
      className="relative flex w-full flex-col overflow-hidden bg-[#08090B] pt-16 pb-10 text-[#F4EFE6] md:block md:h-[100svh] md:min-h-[620px] md:max-h-[960px] md:pt-0 md:pb-0"
    >
      {/* Subtle architectural warm-gold key atmosphere behind the 3D McLaren sculpture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isMobileView
            ? 'radial-gradient(ellipse 85% 42% at 50% 32%, rgba(226, 182, 89, 0.14) 0%, rgba(18, 106, 183, 0.05) 48%, rgba(8, 9, 11, 1) 80%)'
            : 'radial-gradient(ellipse 60% 52% at 55% 46%, rgba(226, 182, 89, 0.14) 0%, rgba(18, 106, 183, 0.05) 48%, rgba(8, 9, 11, 1) 82%)',
        }}
        aria-hidden="true"
      />

      {/* 3D Golden Point-Cloud McLaren P1 Sculpture:
          - Mobile (<md): dedicated compact landscape stage (zero dead vertical space, static unrotated stance)
          - Desktop (md+): full-bleed interactive viewport stage */}
      <div className="relative h-[230px] w-full shrink-0 sm:h-[290px] md:absolute md:inset-0 md:h-full">
        {pointsData && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0.68, 6.4], fov: 32, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ParticleCloudScene
              pointsData={pointsData}
              paused={paused}
              reducedMotion={reducedMotion}
              isMobileView={isMobileView}
              pointerRef={pointerRef}
            />
          </Canvas>
        )}

        {/* Mobile-only compact Pause / Play toggle nested cleanly inside stage corner */}
        <button
          type="button"
          onClick={() => setPaused((prev) => !prev)}
          aria-label={paused ? t.landing.playMotion : t.landing.pauseMotion}
          title={paused ? t.landing.playMotion : t.landing.pauseMotion}
          className="btn-tactile absolute right-4 bottom-2 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2B659]/25 bg-[#13161C]/80 text-[#F4EFE6] backdrop-blur-sm md:hidden"
        >
          {paused ? (
            <Play className="h-3.5 w-3.5 translate-x-[1px] stroke-[1.5]" />
          ) : (
            <Pause className="h-3.5 w-3.5 stroke-[1.5]" />
          )}
        </button>
      </div>

      {/* Desktop bottom editorial vignette for effortless legibility */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-56 bg-gradient-to-t from-[#08090B] via-[#08090B]/60 to-transparent md:block"
        aria-hidden="true"
      />

      {/* Headline & Progress Digital Blue CTA */}
      <div className="pointer-events-none relative z-10 flex flex-col justify-end px-6 pt-3 sm:px-10 md:h-full md:px-12 md:pt-0 md:pb-14 lg:px-16 lg:pb-16">
        <div className="max-w-xl">
          <h1 className="animate-hero-lead text-[36px] leading-[1.06] font-normal tracking-[-0.025em] text-[#F4EFE6] sm:text-5xl lg:text-[4rem] lg:leading-[1.04]">
            <span className="block">{t.landing.heroTitleLine1}</span>
            <span className="block text-[#E2B659]">{t.landing.heroTitleLine2}</span>
          </h1>

          <div className="animate-hero-support pointer-events-auto mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <button
              type="button"
              onClick={onEnterConfigurator}
              className="btn-tactile group inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#126AB7] px-5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-[#1882D6] sm:h-12 sm:px-6"
            >
              <span>{t.landing.heroCta}</span>
              <ArrowRight className="h-4 w-4 stroke-[1.75] transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={onScrollToModels}
              className="btn-tactile inline-flex h-11 cursor-pointer items-center rounded-lg border border-[#E2B659]/30 bg-[#13161C]/90 px-5 text-sm font-normal text-[#F4EFE6] hover:border-[#E2B659]/65 hover:bg-[#1A1E26] sm:h-12 sm:px-5"
            >
              {t.landing.heroSecondaryCta}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop bottom-center cursor cue */}
      <div className="animate-hero-decoration pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs text-[#7C766C] md:block">
        {t.landing.cursorHint}
      </div>

      {/* Desktop bottom-right circular Pause / Play toggle */}
      <button
        type="button"
        onClick={() => setPaused((prev) => !prev)}
        aria-label={paused ? t.landing.playMotion : t.landing.pauseMotion}
        title={paused ? t.landing.playMotion : t.landing.pauseMotion}
        className="btn-tactile absolute right-10 bottom-10 z-20 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#E2B659]/25 bg-[#13161C]/75 text-[#F4EFE6] backdrop-blur-md hover:border-[#E2B659]/60 hover:bg-[#1A1E26] md:flex"
      >
        {paused ? (
          <Play className="h-4 w-4 translate-x-[1px] stroke-[1.5]" />
        ) : (
          <Pause className="h-4 w-4 stroke-[1.5]" />
        )}
      </button>
    </section>
  )
}
