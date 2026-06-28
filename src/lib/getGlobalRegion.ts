import { isCaribbean } from "./isCaribbean";

export function getGlobalRegion(countryCode: string) {

  const code = countryCode.toUpperCase();

  if (isCaribbean(code)) {
    return "caribbean";
  }

  switch (code) {

    case "US":
    case "CA":
      return "north-america";

    case "MX":
    case "GT":
    case "HN":
    case "SV":
    case "NI":
    case "CR":
    case "PA":
    case "CO":
    case "PE":
    case "AR":
    case "BR":
    case "CL":
    case "EC":
    case "PY":
    case "UY":
    case "BO":
    case "VE":
      return "latin-america";

    default:
      return "international";
  }

}
