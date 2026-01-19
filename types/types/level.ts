// types/level.ts

export type LevelDefinition = {
  /**
   * Stable machine-readable identifier
   * Used by pages like level-1/page.tsx via x.code
   */
  code: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Description shown on level pages
   */
  description: string;
};
