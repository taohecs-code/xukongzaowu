export interface ThoughtNode {
  id: string;
  title: string;
  category: 'TECH' | 'PHILOSOPHY' | 'LIFE' | 'ART';
  content: string;
  date: string; // ISO format YYYY-MM-DD
  importance: number; // 1-10, determines size
  position?: [number, number, number]; // Calculated at runtime
}

export interface GalaxyConfig {
  spiralTightness: number;
  verticalSpread: number;
  starSizeMultiplier: number;
}

export type LayoutMode = 'SPIRAL' | 'SPHERE' | 'FORCE' | 'GROUPED';