import * as request from 'request-promise-native'
import { RequestPromiseOptions } from 'request-promise-native'

import * as ReaderTaskEither from 'fp-ts/lib/ReaderTaskEither'
import { AirConditionRecord } from './AirConditionRecord'
import {
  AirConditionServiceError,
  Station,
  StationName,
  AirCondition,
} from './package'
import * as Monad from 'fp-ts/lib/Monad'
import * as Option from 'fp-ts/lib/Option'
import { AirKoreaA1, AirConditionA1, StationA1 } from './algebras'
import { DynamoDB } from 'aws-sdk'
import { pipe } from 'fp-ts/lib/pipeable'
import { StationRecord } from './StationRecord'
import * as Seq from 'fp-ts/lib/Array'
import * as Either from 'fp-ts/lib/Either'
import * as TaskEither from 'fp-ts/lib/TaskEither'
import * as Task from 'fp-ts/lib/Task'

const baseUrl = 'http://openapi.airkorea.or.kr/openapi/services/rest'

interface Env {
  dynamoDb: DynamoDB.DocumentClient
  getServiceKey(): Promise<string>
}

type Impl<A> = ReaderTaskEither.ReaderTaskEither<
  Env,
  AirConditionServiceError,
  A
>

const URI = '@musma/airkorea/Impl'
type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    [URI]: Impl<A>
  }
}

type Program = Monad.Monad1<URI> &
  AirKoreaA1<URI> &
  AirConditionA1<URI> &
  StationA1<URI> & {
    ask(): Impl<Env>
  }

function toStation(record: StationRecord): Station {
  return {
    address: record.address,
    description: record.description,
    stationName: StationName.from(record.stationName),
  }
}

function toAirCondition(record: AirConditionRecord): AirCondition {
  return {
    dataTime: record.dataTime,
    so2: 0,
    stationName: StationName.from(record.stationName),
  }
}

function fromTask<A>(ma: Task.Task<A>): Impl<A> {
  return ReaderTaskEither.fromTaskEither(
    TaskEither.tryCatch(ma, Either.toError),
  )
}

export const impl: Program = {
  ...ReaderTaskEither.readerTaskEither,
  URI,
  ask: ReaderTaskEither.ask,
  findAllStations(): Impl<Array<Station>> {
    return fromTask(async () => {
      const { records } = await StationRecord.primaryKey.scan()
      const stations = records.map(toStation)
      return stations
    })
  },
  findLatestAirConditionBy(
    stationName: StationName,
  ): Impl<Option.Option<AirCondition>> {
    return fromTask(async () => {
      const { records } = await AirConditionRecord.primaryKey.query({
        hash: StationName.get(stationName),
        limit: 1,
        rangeOrder: 'DESC',
      })
      const airConditions = records.map(toAirCondition)
      return Seq.head(airConditions)
    })
  },
  findStationBy(stationName: StationName): Impl<Option.Option<Station>> {
    return fromTask(async () => {
      const record = await StationRecord.primaryKey.get(
        StationName.get(stationName),
      )
      return pipe(Option.fromNullable(record), Option.map(toStation))
    })
  },
  getMsrstnAcctoRltmMesureDnsty(stationName: StationName): Impl<AirCondition> {
    return impl.of(new AirCondition(stationName, '2020-01-23 18:00', 0.003))
  },
  getNearbyMsrstnList(tmX: number, tmY: number): Impl<Array<Station>> {
    return fromTask(async () => {
      const options: RequestPromiseOptions = {
        baseUrl,
        method: 'GET',
        qs: {
          serviceKey: await impl.ask(),
          tmX,
          tmY,
        },
      }
      const response: Response = await request(
        '/MsrstnInfoInqireSvc/getNearbyMsrstnList',
        options,
      ).promise()
      const xml = await response.text()
      throw new Error('unimplemented')
    })
  },
  saveAirCondition(airCondition: AirCondition): Impl<void> {
    return fromTask(async () => {
      const record = AirConditionRecord.of(airCondition)
      await AirConditionRecord.writer.put(record)
    })
  },
  saveStation(station: Station): Impl<void> {
    return fromTask(async () => {
      const record = StationRecord.of(station)
      await StationRecord.writer.put(record)
    })
  },
}
