import * as request from 'request-promise-native'
import { RequestPromiseOptions } from 'request-promise-native'
import { Response } from 'request'
import { ServiceKeyProvider } from './ServiceKeyProvider'

const baseUrl = 'http://openapi.airkorea.or.kr/openapi/services/rest'

export interface AirKoreaService {
  fetchAndStoreAirConditionThroughoutAllStations(): Promise<void>
  // getMsrstnAcctoRltmMesureDnsty(stationName: string): Promise<Response>
  // getNearbyMsrstnList(tmX: number, tmY: number): Promise<Response>
}

export class AirConditionServiceImpl implements AirKoreaService {
  constructor(protected readonly serviceKeyProvider: ServiceKeyProvider) {}

  public async fetchAndStoreAirConditionThroughoutAllStations(): Promise<void> {
    throw new Error('')
  }

  public async getMsrstnAcctoRltmMesureDnsty(
    stationName: string,
  ): Promise<Response> {
    const options: RequestPromiseOptions = {
      baseUrl,
      method: 'GET',
      qs: {
        dataTerm: 'DAILY',
        numOfRows: 1,
        pageNo: 1,
        pageSize: 1,
        serviceKey: await this.serviceKeyProvider.getServiceKey(),
        startPage: 1,
        stationName,
        ver: '1.3',
      },
    }
    return request(
      '/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty',
      options,
    ).promise()
  }

  public async getNearbyMsrstnList(
    tmX: number,
    tmY: number,
  ): Promise<Response> {
    const options: RequestPromiseOptions = {
      baseUrl,
      method: 'GET',
      qs: {
        serviceKey: await this.serviceKeyProvider.getServiceKey(),
        tmX,
        tmY,
      },
    }
    return request(
      '/MsrstnInfoInqireSvc/getNearbyMsrstnList',
      options,
    ).promise()
  }
}
