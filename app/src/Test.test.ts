import * as Monad from 'fp-ts/lib/Monad'
import * as Option from 'fp-ts/lib/Option'
import { AirKoreaA1, AirConditionA1, StationA1 } from './algebras'

import { AirCondition, Station, StationName } from './package'
import { constVoid } from 'fp-ts/lib/function'
import { fetchAndStoreAirConditionThroughoutAllStations } from './fetchAndStoreAirConditionThroughoutAllStations'
import * as IO from 'fp-ts/lib/IO'
import { getNearStations } from './getNearStations'

type Test<A> = IO.IO<A>

const URI = '@musma/airkorea/Test'
type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    [URI]: Test<A>
  }
}

const stations = {
  stationName: new Station(
    StationName.from('stationName'),
    'address',
    'description',
  ),
}

type Program = Monad.Monad1<URI> &
  AirKoreaA1<URI> &
  AirConditionA1<URI> &
  StationA1<URI>

const test: Program = {
  ...IO.io,
  URI,
  findAllStations() {
    return test.of(Object.values(stations))
  },
  findLatestAirConditionBy(_: StationName) {
    return test.of(Option.none as Option.Option<AirCondition>)
  },
  findStationBy(_: StationName) {
    return test.of(stations.stationName)
  },
  getMsrstnAcctoRltmMesureDnsty(stationName) {
    return test.of(new AirCondition(stationName, '2020-01-23 18:00', 0.003))
  },
  getNearbyMsrstnList() {
    return test.of([] as Array<Station>)
  },
  saveAirCondition(_: AirCondition) {
    return test.of(constVoid())
  },
  saveStation(_: Station) {
    return test.of(constVoid())
  },
}

describe('Test', () => {
  it('#fetchAndStoreAirConditionThroughoutAllStations', () => {
    const conditions = fetchAndStoreAirConditionThroughoutAllStations(test)()
    expect(conditions.length).toBe(1)
  })
  it('#getNearStations', () => {
    const stations = getNearStations(test)(0, 0)()
    expect(stations.length).toBe(0)
  })
})
