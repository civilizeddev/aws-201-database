import { AirCondition, StationName } from './package'
import { DOMParserImpl } from 'xmldom-ts'
import * as xpath from 'xpath-ts'

const parser = new DOMParserImpl()

export const parseAirCondition = (xml: string): AirCondition => {
  const document = parser.parseFromString(xml)
  const item = xpath.select1('/response/body/items/item', document) as Node
  return {
    dataTime: String(xpath.select('dataTime/text()', item)),
    so2: Number(xpath.select1('so2Value/text()', item)),
    stationName: StationName.from(''),
  }
}
