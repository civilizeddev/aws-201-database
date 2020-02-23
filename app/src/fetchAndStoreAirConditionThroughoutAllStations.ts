import * as Seq from 'fp-ts/lib/Array'
import { Do } from 'fp-ts-contrib/lib/Do'
import { URIS, Kind } from 'fp-ts/lib/HKT'
import * as Monad from 'fp-ts/lib/Monad'
import { AirKoreaA1, AirConditionA1, StationA1 } from './algebras'
import { AirCondition, Station } from './package'

// export function fetchAndStoreAirConditionThroughoutAllStations<M extends URIS>(
//   M: MonadThrow1<M> & AirKoreaA1<M> & AirConditionA1<M> & StationA1<M>,
// ): Kind<M, Array<AirCondition>>

// export function fetchAndStoreAirConditionThroughoutAllStations<M extends URIS>(
//   M: MonadThrow<M> & AirKoreaA<M> & AirConditionA<M> & StationA<M>,
// ): HKT<M, Array<AirCondition>>

export function fetchAndStoreAirConditionThroughoutAllStations<M extends URIS>(
  M: Monad.Monad1<M> & AirKoreaA1<M> & AirConditionA1<M> & StationA1<M>,
): Kind<M, Array<AirCondition>> {
  const fetchAndStore = (stations: Array<Station>) => {
    return Seq.array.traverse(M)(stations, station => {
      return Do(M)
        .bind('condition', M.getMsrstnAcctoRltmMesureDnsty(station.stationName))
        .doL(({ condition }) => M.saveAirCondition(condition))
        .return(({ condition }) => condition)
    })
  }
  return Do(M)
    .bind('stations', M.findAllStations())
    .bindL('conditions', ({ stations }) => fetchAndStore(stations))
    .return(({ conditions }) => conditions)
}
