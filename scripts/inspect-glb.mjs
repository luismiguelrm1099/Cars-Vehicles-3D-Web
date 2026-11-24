#!/usr/bin/env node
/**
 * Inspects a .glb / .gltf file and prints:
 * - File size, mesh count, triangle count, texture resolutions
 * - Exact material names & node/mesh names
 * - Auto-detected candidates for exterior paint, interior, wheels, calipers, glass
 *
 * Usage: npm run inspect-model -- path/to/vehicle.glb
 */

import fs from 'node:fs'
import path from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: npm run inspect-model -- <path-to-model.glb>')
  process.exit(1)
}

const resolved = path.resolve(filePath)
if (!fs.existsSync(resolved)) {
  console.error(`File not found: ${resolved}`)
  process.exit(1)
}

const stats = fs.statSync(resolved)
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const doc = await io.read(resolved)
const root = doc.getRoot()

const meshes = root.listMeshes()
const materials = root.listMaterials()
const textures = root.listTextures()
const nodes = root.listNodes()

let totalTriangles = 0
for (const mesh of meshes) {
  for (const prim of mesh.listPrimitives()) {
    const indices = prim.getIndices()
    const position = prim.getAttribute('POSITION')
    if (indices) {
      totalTriangles += indices.getCount() / 3
    } else if (position) {
      totalTriangles += position.getCount() / 3
    }
  }
}

console.log('\n========================================')
console.log(`GLB Model Inspection: ${path.basename(resolved)}`)
console.log('========================================')
console.log(`File Size:     ${sizeMB} MB ${Number(sizeMB) > 10 ? '(Recommend running npm run optimize-model)' : '(Good web size)'}`)
console.log(`Meshes:        ${meshes.length}`)
console.log(`Nodes:         ${nodes.length}`)
console.log(`Triangles:     ${Math.round(totalTriangles).toLocaleString()}`)
console.log(`Materials:     ${materials.length}`)
console.log(`Textures:      ${textures.length}`)

if (textures.length > 0) {
  console.log('\n--- Textures ---')
  textures.forEach((tex, i) => {
    const size = tex.getSize()
    const mime = tex.getMimeType()
    const kb = tex.getImage() ? (tex.getImage().byteLength / 1024).toFixed(0) : '?'
    console.log(`  [${i}] ${tex.getName() || '(unnamed)'} — ${size ? `${size[0]}x${size[1]}` : '?'} ${mime} (${kb} KB)`)
  })
}

console.log('\n--- Materials (use these names in src/config/vehicles.ts) ---')
const materialNames = materials.map((m) => m.getName() || '(unnamed)')
materialNames.forEach((name, i) => {
  const mat = materials[i]
  const base = mat.getBaseColorFactor().map((n) => n.toFixed(2)).join(', ')
  const hasMap = mat.getBaseColorTexture() ? 'hasColorMap' : 'solidColor'
  console.log(`  [${i}] "${name}"  (metal=${mat.getMetallicFactor().toFixed(2)}, rough=${mat.getRoughnessFactor().toFixed(2)}, ${hasMap}, rgba=[${base}])`)
})

console.log('\n--- Named Nodes (first 40) ---')
const namedNodes = nodes.map((n) => n.getName()).filter(Boolean)
namedNodes.slice(0, 40).forEach((name) => console.log(`  - "${name}"`))
if (namedNodes.length > 40) {
  console.log(`  ... and ${namedNodes.length - 40} more nodes`)
}

const matchBy = (patterns) =>
  materialNames.filter((name) => patterns.some((re) => re.test(name)))

console.log('\n--- Suggested Material Slot Mapping ---')
console.log(
  JSON.stringify(
    {
      body: matchBy([/paint/i, /carpaint/i, /body/i, /ext/i, /chassis/i, /carroz/i, /clearcoat/i]),
      interiorPrimary: matchBy([/leather/i, /seat/i, /alcantara/i, /fabric/i, /interior/i, /carpet/i, /dash/i]),
      interiorAccent: matchBy([/stitch/i, /carbon/i, /trim/i, /console/i, /accent/i, /steering/i]),
      wheels: matchBy([/rim/i, /wheel/i, /alloy/i]),
      calipers: matchBy([/caliper/i, /brake/i]),
    },
    null,
    2
  )
)
console.log('')
