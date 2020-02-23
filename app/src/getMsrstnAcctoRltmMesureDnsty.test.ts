import { DOMParserImpl } from 'xmldom-ts'
import { AirCondition, StationName } from './package'
import * as xpath from 'xpath-ts'

const sample = `
<?xml version="1.0" encoding="UTF-8"?>
<response>
    <header>
        <resultCode>00</resultCode>
        <resultMsg>NORMAL SERVICE.</resultMsg>
    </header>
    <body>
        <items>
            <item>
                <dataTime>2020-01-22 16:00</dataTime>
                <mangName>도시대기</mangName>
                <so2Value>0.003</so2Value>
                <coValue>0.8</coValue>
                <o3Value>0.003</o3Value>
                <no2Value>0.065</no2Value>
                <pm10Value>52</pm10Value>
                <pm10Value24>49</pm10Value24>
                <pm25Value>33</pm25Value>
                <pm25Value24>21</pm25Value24>
                <khaiValue>105</khaiValue>
                <khaiGrade>3</khaiGrade>
                <so2Grade>1</so2Grade>
                <coGrade>1</coGrade>
                <o3Grade>1</o3Grade>
                <no2Grade>3</no2Grade>
                <pm10Grade>2</pm10Grade>
                <pm25Grade>2</pm25Grade>
                <pm10Grade1h>2</pm10Grade1h>
                <pm25Grade1h>2</pm25Grade1h>
            </item>
        </items>
        <numOfRows>1</numOfRows>
        <pageNo>1</pageNo>
        <totalCount>23</totalCount>
    </body>
</response>
`

const parser = new DOMParserImpl()

const parseResponse = (xml: string): AirCondition => {
  const document = parser.parseFromString(xml)
  const item = xpath.select1('/response/body/items/item', document) as Node
  return {
    dataTime: String(xpath.select('dataTime/text()', item)),
    so2: Number(xpath.select1('so2Value/text()', item)),
    stationName: StationName.from(''),
  }
}

describe('getMsrstnAcctoRltmMesureDnsty', () => {
  it('#parseResponse', () => {
    const record = parseResponse(sample)
    expect(record).toEqual({
      dataTime: '2020-01-22 16:00',
      so2: 0.003,
      stationName: StationName.from(''),
    } as AirCondition)
  })
})
