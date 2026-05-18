# Sparkid Feature Structure

Sparkid is organized around reusable learning modules. The current playable module is Circuit Lab; future levels can add their own island scenes while reusing the circuit element assets.

## Folders

- `components/circuit-lab`
  - Runtime for the playable Circuit Lab experience.
  - Owns board/grid placement, ports, cable connection mode, camera presets, tutor panel, tray, circuit validation, and the `/circuit` route experience.

- `components/assets/circuit-elements`
  - Reusable 3D circuit element assets.
  - Includes battery, bulb, switch, cable, and their GLB-backed variants.
  - These assets should stay level-agnostic so future levels can reuse them.

- `components/assets/table`
  - Shared lab table model assets.

- `components/sparky`
  - Sparky robot mascot and face/emote primitives.
  - Use this for site-wide guide/tutor behavior, not circuit-specific logic.

- `components/showcase`
  - `/sparkid` showcase/demo experience.
  - Useful for presenting assets outside the playable lab.

- `components/ui`
  - Sparkid-specific UI/3D controls such as the block button kit.

- `components/dev-tools`
  - Local test/export tooling for asset iteration.
  - Keep production routes independent from this folder.

- `glb`
  - Generic GLB export/animation helpers.

## Naming Direction

- Playable modules should use `*Experience` for route-level runtime components.
- Dev-only tuning/export surfaces should use `*Dev`, `*TuningDev`, or `*Exporter`.
- Reusable visual assets should live under `components/assets`.
- Level-specific future work can use a structure like:
  - `levels/level-01-floating-island`
  - `levels/level-02-series-circuit`
  - each level can compose `components/circuit-lab` and `components/assets`.

## Current Cleanup Notes

- Deprecated Sparky scene-overlay files were removed.
- Old top-level circuit asset files were moved into `components/assets/circuit-elements`.
- Circuit Lab runtime files were moved from `components/circuit` into `components/circuit-lab`.
- Test/export components were moved into `components/dev-tools`.
