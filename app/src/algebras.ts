import { URIS, Kind } from 'fp-ts/lib/HKT'
import { StationName, AirCondition, Station } from './package'
import * as Option from 'fp-ts/lib/Option'

// export interface AirKoreaA<F> {
//   getMsrstnAcctoRltmMesureDnsty(stationName: StationName): HKT<F, AirCondition>
//   getNearbyMsrstnList(tmX: number, tmY: number): HKT<F, Array<Station>>
// }
export interface AirKoreaA1<F extends URIS> {
  getMsrstnAcctoRltmMesureDnsty(stationName: StationName): Kind<F, AirCondition>
  getNearbyMsrstnList(tmX: number, tmY: number): Kind<F, Array<Station>>
}

// export interface AirConditionA<F> {
//   saveAirCondition(airCondition: AirCondition): HKT<F, void>
//   findLatestAirConditionBy(
//     stationName: StationName,
//   ): HKT<F, Option.Option<AirCondition>>
// }
export interface AirConditionA1<F extends URIS> {
  saveAirCondition(airCondition: AirCondition): Kind<F, void>
  findLatestAirConditionBy(
    stationName: StationName,
  ): Kind<F, Option.Option<AirCondition>>
}

// export interface StationA<F> {
//   saveStation(station: Station): HKT<F, void>
//   findAllStations(): HKT<F, Array<Station>>
//   findStationBy(stationName: StationName): HKT<F, Option.Option<Station>>
// }
export interface StationA1<F extends URIS> {
  saveStation(station: Station): Kind<F, void>
  findAllStations(): Kind<F, Array<Station>>
  findStationBy(stationName: StationName): Kind<F, Option.Option<Station>>
}
