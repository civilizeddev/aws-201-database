import { URIS, Kind } from 'fp-ts/lib/HKT'
import * as Monad from 'fp-ts/lib/Monad'
import * as Option from 'fp-ts/lib/Option'
import { AirKoreaA1, AirConditionA1 } from './algebras'
import { AirCondition, StationName } from './package'

export function findLatestAirConditionBy<M extends URIS>(
  M: Monad.Monad1<M> & AirKoreaA1<M> & AirConditionA1<M>,
): (stationName: StationName) => Kind<M, Option.Option<AirCondition>> {
  return (stationName: StationName) => M.findLatestAirConditionBy(stationName)
}
