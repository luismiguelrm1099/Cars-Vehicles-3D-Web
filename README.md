# Progress Digital — Cars Showroom

Commercial-grade real-time 3D vehicle showroom & configurator built with **React 19**, **TypeScript**, **Three.js**, **React Three Fiber**, **@react-three/drei**, **Zustand**, and **Tailwind CSS v4**.

## Features

- **3 Configurable Vehicles**: McLaren P1, Lotus Exige S 240, and Honda Acty HA3 Utility (with modular bed rack, toolbox, tonneau cover, and LED lightbar).
- **3 Selectable Showroom Environments**:
  - **Agency Showroom** (default): honed-stone circular turntable, curved white cyclorama wall, dark charcoal agency floor, and recessed radial overhead light canopy.
  - **Light Studio**: clean pearl-white studio.
  - **Midnight Showroom**: high-contrast dark stage with rim reflections.
- **Exterior & Interior 360° Views**: smooth animated camera transitions with automatic lens/FOV adjustment and interior cabin fill lighting.
- **AgX PBR Paint Finishes & Interior Trim**: Solid, Metallic, and Matte clearcoat paints (`MeshPhysicalMaterial`), natural leather/Alcantara upholstery, wheel finishes, and brake calipers.
- **Commercial UX**: EN / ES language selector (English default), live dynamic MSRP calculation & itemized breakdown, shareable URL query state, and PNG build snapshot export.
- **Plug-and-Play `.glb` Pipeline**: locally bundled `MeshoptDecoder` loading optimized `.glb` files in `public/models/`, plus browser-local `.glb` preview and mesh inspector.

## Getting Started

```bash
npm install
npm run dev
```

## Deploying with Coolify

This repository includes a multi-stage `Dockerfile` (`node:22-alpine` → `nginx:1.27-alpine`) and `nginx.conf` tuned for 3D WebGL assets (gzip compression, `model/gltf-binary` MIME type, caching, SPA fallback, and `/health` endpoint).

1. Connect the repository in Coolify (`main` branch).
2. Select **Build Pack: Dockerfile**.
3. Set **Ports Exposes: `80`** (healthcheck path `/health`).
4. Assign your domain and deploy.

## Integrating Sketchfab `.glb` Models

```bash
# 1. Inspect material & mesh names
npm run inspect-model -- path/to/raw-model.glb

# 2. Compress with Meshopt + WebP 1K textures (preserving material & node names)
npm run optimize-model -- path/to/raw-model.glb public/models/mclaren-p1.glb
```
