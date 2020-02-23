import { ServiceKeyProvider } from './src/ServiceKeyProvider'
import { findLatestAirConditionBy } from './src/findLatestAirConditionBy'
import { impl } from './src/Impl'
import { StationName } from './src/package'

export { StationName } from './src/package'

const serviceKeyProvider = new ServiceKeyProvider()

export const service = new AirConditionServiceImpl(serviceKeyProvider)

export default {
  findLatestAirConditionBy(stationName: StationName) {
    return findLatestAirConditionBy(impl)(stationName)()
  },
}
