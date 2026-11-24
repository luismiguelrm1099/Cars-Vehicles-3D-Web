import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Pause, Play } from 'lucide-react'
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

    // Aerodynamic cursor wake dispersion in 3D space
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
    float rim = pow(1.0 - abs(dot(worldNormal, viewDir)), 1.65);
    float backRim = max(dot(worldNormal, rimLight), 0.0) * 0.4;

    // Emphasize wheels, headlights, upper fender crests & sculpted side intake
    float highBoost = smoothstep(0.9, 1.0, aRole) * 0.55;
    float shade = (0.14 + ndl * 0.72 + rim * 0.8 + backRim) * (0.38 + aRole * 0.78) + highBoost;
    float sparkle = 0.84 + 0.16 * sin(uTime * 3.0 + aSeed * 43.0);

    vBrightness = clamp(shade * sparkle + wake * 0.9, 0.08, 1.6);
    vWarmth = clamp(aRole + wake * 0.45, 0.0, 1.0);
    vAlpha = clamp(0.24 + shade * 0.85 + wake * 0.35, 0.14, 1.0);

    // Fine pinpoint gold-dust sizing
    float baseSize = mix(1.05, 2.25, aRole) + rim * 0.7 + wake * 1.3;
    gl_PointSize = clamp(baseSize * uPixelRatio * (5.2 / max(1.0, -mvPosition.z)), 1.0, 5.5);
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

    // Crisp pinpoint golden spark
    float core = smoothstep(0.5, 0.12, d);
    float hotCore = smoothstep(0.24, 0.0, d);

    vec3 deepAmber = vec3(0.46, 0.22, 0.02);
    vec3 richGold = vec3(0.98, 0.68, 0.22);
    vec3 champagneWhite = vec3(1.0, 0.96, 0.82);

    vec3 col = mix(deepAmber, richGold, clamp(vBrightness * 0.95, 0.0, 1.0));
    col = mix(col, champagneWhite, clamp((vBrightness - 0.78) * 1.4 + hotCore * 0.4 * vWarmth, 0.0, 1.0));

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

  void main() {
    vec3 pos = position;
    float t = uTime * aSpeed * 0.35 * uMotion + aSeed * 10.0;
    float cycle = fract(t);

    // Drift gently backward & upward off the hypercar body like golden embers in dark air
    pos.z -= cycle * 1.65;
    pos.y += cycle * 0.72 + sin(cycle * 6.2831 + aSeed * 12.0) * 0.08;
    pos.x += cos(cycle * 4.5 + aSeed * 17.0) * 0.14;

    float fadeIn = smoothstep(0.0, 0.18, cycle);
    float fadeOut = smoothstep(1.0, 0.55, cycle);
    vAlpha = fadeIn * fadeOut * (0.45 + 0.45 * sin(uTime * 3.0 + aSeed * 31.0));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp((1.6 + fract(aSeed * 7.3) * 2.6) * uPixelRatio * (4.2 / max(1.0, -mvPosition.z)), 1.0, 7.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const EMBER_FRAGMENT = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    // Slightly elongated ember fleck
    uv.x *= 0.72;
    float d = length(uv);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.05, d);
    vec3 col = mix(vec3(0.92, 0.58, 0.16), vec3(1.0, 0.9, 0.68), glow);
    gl_FragColor = vec4(col, glow * vAlpha);
  }
`

interface ParticleCloudSceneProps {
  pointsData: Float32Array
  paused: boolean
  reducedMotion: boolean
  pointerRef: React.MutableRefObject<{ nx: number; ny: number; active: boolean }>
}

function ParticleCloudScene({
  pointsData,
  paused,
  reducedMotion,
  pointerRef,
}: ParticleCloudSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const smoothPointer = useRef({ nx: 0, ny: 0, active: 0 })
  const elapsedRef = useRef(0)
  const { size, camera } = useThree()
  const isPortrait = size.width < 768

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    const targetZ = aspect < 0.65 ? 12.8 : aspect < 1.0 ? 9.6 : aspect < 1.25 ? 7.4 : 6.2
    const targetY = aspect < 0.65 ? 0.68 : 0.72
    camera.position.set(0, targetY, targetZ)
    camera.updateProjectionMatrix()
  }, [size.width, size.height, camera])

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

    // Sample 480 drifting golden ember flecks spawned from upper body/fender points
    const emberCount = 480
    const emberPos = new Float32Array(emberCount * 3)
    const emberSeed = new Float32Array(emberCount)
    const emberSpeed = new Float32Array(emberCount)

    for (let i = 0; i < emberCount; i++) {
      const srcIdx = Math.floor(rand() * count)
      emberPos[i * 3] = positions[srcIdx * 3] + (rand() - 0.5) * 0.25
      emberPos[i * 3 + 1] = Math.max(0.25, positions[srcIdx * 3 + 1]) + rand() * 0.28
      emberPos[i * 3 + 2] = positions[srcIdx * 3 + 2] + (rand() - 0.5) * 0.3
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

    const targetNx = pointerRef.current.active ? pointerRef.current.nx : 0
    const targetNy = pointerRef.current.active ? pointerRef.current.ny : 0
    const targetActive = pointerRef.current.active ? 1 : 0

    smoothPointer.current.nx += (targetNx - smoothPointer.current.nx) * 0.065
    smoothPointer.current.ny += (targetNy - smoothPointer.current.ny) * 0.065
    smoothPointer.current.active += (targetActive - smoothPointer.current.active) * 0.08

    // Iconic front-left 3/4 stance facing left-forward (matching reference sculpture)
    const baseYaw = -0.92
    const idleSway = activeMotion ? Math.sin(elapsedRef.current * 0.35) * 0.045 : 0
    if (groupRef.current) {
      groupRef.current.rotation.y = baseYaw + idleSway + smoothPointer.current.nx * 0.22
      groupRef.current.rotation.x = 0.06 + smoothPointer.current.ny * 0.06
    }

    carMaterial.uniforms.uTime.value = elapsedRef.current
    carMaterial.uniforms.uMotion.value = activeMotion ? 1.0 : 0.0
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
    <group ref={groupRef} position={isPortrait ? [0, 0.08, 0] : [0.35, -0.34, 0]}>
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
  const pointerRef = useRef({ nx: 0, ny: 0, active: false })

  const language = useConfiguratorStore((s) => s.language)
  const t = translations[language]

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

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
    }
  }, [])

  return (
    <section
      aria-label="Progress Digital Showroom Hero"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        pointerRef.current.nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2
        pointerRef.current.ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2
        pointerRef.current.active = true
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false
      }}
      className="relative h-screen min-h-[560px] w-full overflow-hidden bg-[#050403] text-white"
    >
      {/* Subtle warm obsidian radial glow behind the 3D golden McLaren sculpture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 62% 54% at 54% 47%, rgba(186, 112, 26, 0.16) 0%, rgba(72, 42, 10, 0.06) 45%, rgba(5, 4, 3, 1) 82%)',
        }}
        aria-hidden="true"
      />

      {/* Interactive 3D Golden Point-Cloud McLaren P1 Sculpture (1 WebGL draw call) */}
      <div className="absolute inset-0 h-full w-full">
        {pointsData && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0.72, 6.2], fov: 32, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ParticleCloudScene
              pointsData={pointsData}
              paused={paused}
              reducedMotion={reducedMotion}
              pointerRef={pointerRef}
            />
          </Canvas>
        )}
      </div>

      {/* Bottom editorial vignette for crisp Porsche typography legibility */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#050403] via-[#050403]/55 to-transparent"
        aria-hidden="true"
      />

      {/* Porsche-inspired Bottom-Left Headline & Frosted Glass CTA (safe above fold on all viewports) */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-6 pb-8 sm:px-12 sm:pb-14 lg:px-16 lg:pb-16">
        <div className="max-w-xl">
          <h1 className="animate-hero-lead text-4xl font-light tracking-[-0.02em] text-white sm:text-5xl lg:text-[4rem] lg:leading-[1.06]">
            <span className="block">{t.landing.heroTitleLine1}</span>
            <span className="block text-white/90">{t.landing.heroTitleLine2}</span>
          </h1>

          <div className="animate-hero-support pointer-events-auto mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <button
              type="button"
              onClick={onEnterConfigurator}
              className="cursor-pointer rounded-[4px] border border-white/30 bg-white/12 px-5 py-2.5 text-sm font-medium tracking-wide text-white backdrop-blur-md transition-[background-color,color,border-color] duration-200 hover:border-white hover:bg-white hover:text-[#050403] sm:px-6 sm:py-3"
            >
              {t.landing.heroCta}
            </button>

            <button
              type="button"
              onClick={onScrollToModels}
              className="cursor-pointer rounded-[4px] border border-white/15 px-4 py-2.5 text-sm font-normal text-white/80 transition-[color,border-color] duration-200 hover:border-white/40 hover:text-white sm:px-5 sm:py-3"
            >
              {t.landing.heroSecondaryCta}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle bottom-center cursor cue */}
      <div className="animate-hero-decoration pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-xs tracking-wide text-white/45 md:block">
        {t.landing.cursorHint}
      </div>

      {/* Porsche bottom-right circular Pause / Play toggle */}
      <button
        type="button"
        onClick={() => setPaused((prev) => !prev)}
        aria-label={paused ? t.landing.playMotion : t.landing.pauseMotion}
        title={paused ? t.landing.playMotion : t.landing.pauseMotion}
        className="absolute right-6 bottom-6 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-[background-color,border-color] duration-200 hover:border-white/45 hover:bg-white/20 sm:right-10 sm:bottom-10 sm:h-11 sm:w-11"
      >
        {paused ? <Play className="h-4 w-4 translate-x-[1px]" /> : <Pause className="h-4 w-4" />}
      </button>
    </section>
  )
}
