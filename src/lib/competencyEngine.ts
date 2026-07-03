export interface CompetencyArea {
  id: string;
  score: number;
}

export interface CompetencyProfile {
  financial: number;
  sales: number;
  marketing: number;
  leadership: number;
  operations: number;
  strategy: number;
  overall: number;
  level: string;
}

export function calculateCompetencyProfile(
  areas: CompetencyArea[]
): CompetencyProfile {

  const lookup = (id: string) =>
    areas.find(a => a.id === id)?.score ?? 0;

  const financial =
    Math.round(
      (
        lookup("cashFlow") +
        lookup("profit") +
        lookup("pricing")
      ) / 3
    );

  const sales =
    Math.round(
      (
        lookup("sales") +
        lookup("conversionRate")
      ) / 2
    );

  const marketing =
    Math.round(
      (
        lookup("marketing") +
        lookup("customerAcquisition")
      ) / 2
    );

  const leadership =
    Math.round(
      (
        lookup("leadership") +
        lookup("hiring")
      ) / 2
    );

  const operations =
    Math.round(
      (
        lookup("systems") +
        lookup("operations")
      ) / 2
    );

  const strategy =
    Math.round(
      (
        lookup("growth") +
        lookup("planning")
      ) / 2
    );

  const overall =
    Math.round(
      (
        financial +
        sales +
        marketing +
        leadership +
        operations +
        strategy
      ) / 6
    );

  let level = "";

  if (overall >= 90)
    level = "Master";

  else if (overall >= 80)
    level = "Expert";

  else if (overall >= 70)
    level = "Advanced";

  else if (overall >= 60)
    level = "Competent";

  else if (overall >= 50)
    level = "Developing";

  else
    level = "Foundation";

  return {

    financial,

    sales,

    marketing,

    leadership,

    operations,

    strategy,

    overall,

    level

  };

}
