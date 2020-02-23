import { Table, Decorator, Query } from 'dynamo-types'
import { AirCondition } from './package'

type StationName = string
type DateTime = string

@Decorator.Table({ name: 'airkorea.AirCondition' })
export class AirConditionRecord extends Table {
  public static of(obj: AirCondition): AirConditionRecord {
    const record = new AirConditionRecord()
    record.setAttributes(obj)
    return record
  }

  @Decorator.Attribute()
  public stationName!: StationName

  @Decorator.Attribute()
  public dataTime!: DateTime

  @Decorator.FullPrimaryKey('stationName', 'dateTime')
  public static readonly primaryKey: Query.FullPrimaryKey<
    AirConditionRecord,
    StationName,
    DateTime
  >

  @Decorator.Writer()
  public static readonly writer: Query.Writer<AirConditionRecord>
}
