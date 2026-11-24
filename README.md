# Atelier 3D — Interactive Vehicle Configurator

Commercial-grade real-time 3D vehicle configurator built with **React 19**, **TypeScript**, **Three.js**, **React Three Fiber**, **@react-three/drei**, **Zustand**, and **Tailwind CSS v4**.

## Features

- **3 Configurable Vehicles**: McLaren P1, Lotus Exige S 240, and Honda Acty HA3 Utility (with modular bed rack, toolbox, tonneau cover, and LED lightbar).
- **3 Selectable Showroom Environments**:
  - **Agency Showroom** (default): glossy white circular turntable, curved white cyclorama wall, dark charcoal agency floor, and recessed radial overhead light canopy.
  - **Light Studio**: clean pearl-white Toyota/Porsche-style studio.
  - **Midnight Showroom**: high-contrast dark stage with rim reflections.
- **Exterior & Interior 360° Views**: smooth animated camera transitions with automatic lens/FOV adjustment and interior cabin fill lighting.
- **PBR Paint Finishes & Interior Trim**: Solid, Metallic, and Matte clearcoat paints (`MeshPhysicalMaterial`), upholstery & trim customization, wheel finishes, and brake calipers.
- **Commercial UX**: EN / ES language selector (English default), live dynamic MSRP calculation & itemized breakdown, shareable URL query state, and PNG build snapshot export.
- **Plug-and-Play `.glb` Pipeline**: automatically detects optimized `.glb` files in `public/models/` or previews any local `.glb` directly in the browser with a built-in mesh/material inspector.

## Getting Started

```bash
npm install
npm run dev
```

## Integrating Sketchfab `.glb` Models

```bash
# 1. Inspect material & mesh names
npm run inspect-model -- path/to/raw-model.glb

# 2. Compress with Meshopt + WebP 1K textures
npm run optimize-model -- path/to/raw-model.glb public/models/mclaren-p1.glb
```
