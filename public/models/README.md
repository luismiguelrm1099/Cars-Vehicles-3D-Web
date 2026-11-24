# 3D Vehicle Models (`.glb`)

Place your optimized Sketchfab `.glb` models here using these exact filenames so the configurator loads them automatically:

- `mclaren-p1.glb`
- `lotus-exige-240.glb`
- `honda-acty-ha3.glb`

## Quick Workflow (No Blender needed in most cases)

1. Download **GLB (Converted format)** from Sketchfab into a temporary folder (e.g. `assets-raw/`).
2. Inspect materials and mesh names:
   ```bash
   npm run inspect-model -- assets-raw/mclaren.glb
   ```
3. Optimize geometry & textures (shrinks ~11 MB down to ~2–4 MB with Meshopt + WebP):
   ```bash
   npm run optimize-model -- assets-raw/mclaren.glb public/models/mclaren-p1.glb
   ```
4. If any material name on your `.glb` does not auto-match, click **Inspect parts** inside the app (or copy names from `inspect-model`) and add them to `materialSlots` in `src/config/vehicles.ts`.
