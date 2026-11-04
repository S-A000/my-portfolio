export const SCENE_COLORS = Object.freeze({
  background: '#030b12',
  navy: '#061521',
  deepNavy: '#082433',
  panel: '#0c3444',
  teal: '#25d2d8',
  cyan: '#8cf3f4',
  blue: '#3f91c7',
  orange: '#ff762b',
  warmWhite: '#f2eadf',
  shadow: '#010609',
})

export const SCENE_MATERIALS = Object.freeze({
  shell: {
    color: SCENE_COLORS.deepNavy,
    metalness: 0.72,
    roughness: 0.24,
    clearcoat: 0.72,
    clearcoatRoughness: 0.22,
  },
  panel: {
    color: SCENE_COLORS.panel,
    metalness: 0.48,
    roughness: 0.3,
    clearcoat: 0.62,
    clearcoatRoughness: 0.28,
  },
  ceramic: {
    color: SCENE_COLORS.warmWhite,
    metalness: 0.08,
    roughness: 0.38,
    clearcoat: 0.42,
    clearcoatRoughness: 0.34,
  },
})

