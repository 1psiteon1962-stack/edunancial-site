// data/curriculum/us.ts

import { US_CURRICULUM_EN } from "./us.en";
import { US_CURRICULUM_ES } from "./us.es";

export function getUSCurriculum(lang: string) {
  switch (lang) {
    case "es":
      return US_CURRICULUM_ES;
    case "en":
    default:
      return US_CURRICULUM_EN;
  }
}
