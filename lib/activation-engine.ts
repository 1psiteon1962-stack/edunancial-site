import { Level } from "./levels"
import { LevelAccess } from "./level-access"

export type ActivationResult = {
  level: Level
  access: LevelAccess
  region: string
  price: number
  currency: string
}
