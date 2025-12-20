import us from "./us";
import africa from "./africa";
import latam from "./latam";
import asia from "./asia";

export const contentByRegion = {
  us,
  africa,
  latam,
  asia,
};

export type ContentRegionKey = keyof typeof contentByRegion;
