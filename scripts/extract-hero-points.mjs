#!/usr/bin/env node
/**
 * Extracts 36,000 fine area-weighted 3D surface points (position + normal + role)
 * from public/models/mclaren-p1.glb into public/models/hero-p1-points.bin
 * for the high-density golden particle McLaren P1 hero sculpture.
 */

import fs from 'node:fs'
import path from 'node:path'
import { NodeIO, getBounds } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'

await MeshoptDecoder.ready

const INPUT = path.resolve('public/models/mclaren-p1.glb')
const OUTPUT = path.resolve('public/models/hero-p1-points.bin')
const TARGET_POINTS = 36000
const TARGET_LENGTH = 4.59

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder })

const doc = await io.read(INPUT)
const scene = doc.getRoot().listScenes()[0]
const bounds = getBounds(scene)

const sx = bounds.max[0] - bounds.min[0]
const sz = bounds.max[2] - bounds.min[2]
const scale = TARGET_LENGTH / Math.max(sx, sz)
const cx = (bounds.min[0] + bounds.max[0]) / 2
const minY = bounds.min[1]
const cz = (bounds.min[2] + bounds.max[2]) / 2

function transformPoint(m, x, y, z) {
  const wx = m[0] * x + m[4] * y + m[8] * z + m[12]
  const wy = m[1] * x + m[5] * y + m[9] * z + m[13]
  const wz = m[2] * x + m[6] * y + m[10] * z + m[14]
  return [(wx - cx) * scale, (wy - minY) * scale, (wz - cz) * scale]
}

function transformNormal(m, x, y, z) {
  const nx = m[0] * x + m[4] * y + m[8] * z
  const ny = m[1] * x + m[5] * y + m[9] * z
  const nz = m[2] * x + m[6] * y + m[10] * z
  const len = Math.hypot(nx, ny, nz) || 1
  return [nx / len, ny / len, nz / len]
}

const triangles = []
let totalWeight = 0

// Exclude deeply occluded interior/mechanical parts so the outer sculpture reads razor-sharp
const SKIP_MAT = /^(int_|in_cinture|mechanicals|mirror|grid)/i

for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh()
  if (!mesh) continue
  const worldMat = node.getWorldMatrix()
  const nodeName = node.getName() || ''

  for (const prim of mesh.listPrimitives()) {
    const matName = prim.getMaterial()?.getName() || ''
    if (SKIP_MAT.test(matName)) continue

    const posAcc = prim.getAttribute('POSITION')
    if (!posAcc) continue
    const normAcc = prim.getAttribute('NORMAL')
    const idxAcc = prim.getIndices()

    const isRim = /rim/i.test(nodeName)
    const isTyre = /tyre/i.test(matName) || /tyre/i.test(nodeName)
    const isHeadlight = /headlight/i.test(matName)
    const isTaillight = /taillight/i.test(matName)
    const isPaint = /^carpaint$/i.test(matName)
    const isGlass = /window|glass/i.test(matName)

    let role = 0.62
    let densityWeight = 1.0

    if (isHeadlight) {
      role = 1.0
      densityWeight = 5.5
    } else if (isRim) {
      role = 0.96
      densityWeight = 4.2
    } else if (isTaillight) {
      role = 0.92
      densityWeight = 3.0
    } else if (isPaint) {
      role = 0.85
      densityWeight = 1.9
    } else if (isTyre) {
      role = 0.42
      densityWeight = 0.75
    } else if (isGlass) {
      role = 0.48
      densityWeight = 0.75
    } else if (/brake_disk|caliper/i.test(matName)) {
      role = 0.72
      densityWeight = 1.6
    } else {
      role = 0.56
      densityWeight = 0.95
    }

    const triCount = idxAcc ? idxAcc.getCount() / 3 : posAcc.getCount() / 3
    const pA = [0, 0, 0]
    const pB = [0, 0, 0]
    const pC = [0, 0, 0]
    const nA = [0, 1, 0]
    const nB = [0, 1, 0]
    const nC = [0, 1, 0]

    for (let t = 0; t < triCount; t++) {
      const i0 = idxAcc ? idxAcc.getScalar(t * 3) : t * 3
      const i1 = idxAcc ? idxAcc.getScalar(t * 3 + 1) : t * 3 + 1
      const i2 = idxAcc ? idxAcc.getScalar(t * 3 + 2) : t * 3 + 2

      posAcc.getElement(i0, pA)
      posAcc.getElement(i1, pB)
      posAcc.getElement(i2, pC)

      const a = transformPoint(worldMat, pA[0], pA[1], pA[2])
      const b = transformPoint(worldMat, pB[0], pB[1], pB[2])
      const c = transformPoint(worldMat, pC[0], pC[1], pC[2])

      // Keep rims, tires, and front splitter edges; only skip flat interior floor pan
      const avgY = (a[1] + b[1] + c[1]) / 3
      const avgX = Math.abs((a[0] + b[0] + c[0]) / 3)
      if (avgY < 0.09 && avgX < 0.72 && !isRim && !isTyre) continue

      const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2]
      const acx = c[0] - a[0], acy = c[1] - a[1], acz = c[2] - a[2]
      const cxp = aby * acz - abz * acy
      const cyp = abz * acx - abx * acz
      const czp = abx * acy - aby * acx
      const area = 0.5 * Math.hypot(cxp, cyp, czp)
      if (area < 1e-6) continue

      let na, nb, nc
      if (normAcc) {
        normAcc.getElement(i0, nA)
        normAcc.getElement(i1, nB)
        normAcc.getElement(i2, nC)
        na = transformNormal(worldMat, nA[0], nA[1], nA[2])
        nb = transformNormal(worldMat, nB[0], nB[1], nB[2])
        nc = transformNormal(worldMat, nC[0], nC[1], nC[2])
      } else {
        const len = Math.hypot(cxp, cyp, czp) || 1
        na = nb = nc = [cxp / len, cyp / len, czp / len]
      }

      const w = area * densityWeight
      totalWeight += w
      triangles.push({ a, b, c, na, nb, nc, role, cumW: totalWeight })
    }
  }
}

let seed = 20261124
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

function pickTriangle(target) {
  let lo = 0
  let hi = triangles.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (triangles[mid].cumW < target) lo = mid + 1
    else hi = mid
  }
  return triangles[lo]
}

const out = new Float32Array(TARGET_POINTS * 7)

for (let i = 0; i < TARGET_POINTS; i++) {
  const tri = pickTriangle(rand() * totalWeight)
  let r1 = rand()
  let r2 = rand()
  if (r1 + r2 > 1) {
    r1 = 1 - r1
    r2 = 1 - r2
  }
  const r0 = 1 - r1 - r2

  const x = tri.a[0] * r0 + tri.b[0] * r1 + tri.c[0] * r2
  const y = tri.a[1] * r0 + tri.b[1] * r1 + tri.c[1] * r2
  const z = tri.a[2] * r0 + tri.b[2] * r1 + tri.c[2] * r2

  let nx = tri.na[0] * r0 + tri.nb[0] * r1 + tri.nc[0] * r2
  let ny = tri.na[1] * r0 + tri.nb[1] * r1 + tri.nc[1] * r2
  let nz = tri.na[2] * r0 + tri.nb[2] * r1 + tri.nc[2] * r2
  const nl = Math.hypot(nx, ny, nz) || 1
  nx /= nl
  ny /= nl
  nz /= nl

  const o = i * 7
  out[o] = x
  out[o + 1] = y
  out[o + 2] = z
  out[o + 3] = nx
  out[o + 4] = ny
  out[o + 5] = nz
  out[o + 6] = tri.role
}

fs.writeFileSync(OUTPUT, Buffer.from(out.buffer))
console.log(
  `Extracted ${TARGET_POINTS} fine 3D points from ${triangles.length} triangles -> ${OUTPUT} (${(
    out.byteLength / 1024
  ).toFixed(1)} KB)`
)
