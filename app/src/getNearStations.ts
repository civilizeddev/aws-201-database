import * as Monad from 'fp-ts/lib/Monad'
import { AirKoreaA1, StationA1 } from './algebras'
import { URIS, Kind } from 'fp-ts/lib/HKT'
import { Station } from './package'
import { Do } from 'fp-ts-contrib/lib/Do'

export function getNearStations<M extends URIS>(
  M: Monad.Monad1<M> & AirKoreaA1<M> & StationA1<M>,
): (tmX: number, tmY: number) => Kind<M, Array<Station>> {
  return (tmX: number, tmY: number) =>
    Do(M)
      .bind('stations', M.getNearbyMsrstnList(tmX, tmY))
      .return(({ stations }) => stations)
}
