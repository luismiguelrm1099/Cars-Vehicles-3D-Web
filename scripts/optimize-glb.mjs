#!/usr/bin/env node
/**
 * Optimizes a raw Sketchfab .glb file for web delivery using @gltf-transform/cli.
 * Applies dedup, prune, texture resize (1024px WebP), and Meshopt/Draco compression.
 *
 * Usage: npm run optimize-model -- raw/mclaren.glb public/models/mclaren-p1.glb
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [, , inputArg, outputArg] = process.argv

if (!inputArg || !outputArg) {
  console.error('Usage: npm run optimize-model -- <input.glb> <output.glb>')
  process.exit(1)
}

const inputPath = path.resolve(inputArg)
const outputPath = path.resolve(outputArg)

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`)
  process.exit(1)
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })

const beforeMB = (fs.statSync(inputPath).size / (1024 * 1024)).toFixed(2)
console.log(`Optimizing ${path.basename(inputPath)} (${beforeMB} MB)...`)

const cliBin = path.resolve('node_modules/.bin/gltf-transform')

try {
  execFileSync(
    cliBin,
    [
      'optimize',
      inputPath,
      outputPath,
      '--compress',
      'meshopt',
      '--texture-compress',
      'webp',
      '--texture-size',
      '1024',
      '--palette',
      'false',
      '--join',
      'false',
      '--flatten',
      'false',
    ],
    { stdio: 'inherit' }
  )

  const afterMB = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2)
  const reduction = (((Number(beforeMB) - Number(afterMB)) / Number(beforeMB)) * 100).toFixed(1)
  console.log(`\nDone! ${beforeMB} MB -> ${afterMB} MB (-${reduction}%)`)
  console.log(`Saved to: ${outputPath}`)
} catch (err) {
  console.error('Optimization failed:', err.message)
  process.exit(1)
}
