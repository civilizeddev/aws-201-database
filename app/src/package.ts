import { Newtype, iso } from 'newtype-ts'
import { Iso } from 'monocle-ts'

export type StationName = Newtype<
  { readonly StationName: unique symbol },
  string
>

export const StationName: Iso<StationName, string> = iso<StationName>()

export class AirConditionServiceError {
  constructor(public readonly message: string) {}
}

export class AirCondition {
  constructor(
    public readonly stationName: StationName,
    public readonly dataTime: string,
    public readonly so2: number,
  ) {}
}

export class Station {
  constructor(
    public readonly stationName: StationName,
    public readonly address: string,
    public readonly description: string,
  ) {}
}
