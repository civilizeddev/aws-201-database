import { Table, Decorator, Query } from 'dynamo-types'
import { Station } from './package'

type StationName = string

@Decorator.Table({ name: 'airkorea.Station' })
export class StationRecord extends Table {
  public static of(obj: Station): StationRecord {
    const record = new StationRecord()
    record.setAttributes(obj)
    return record
  }

  @Decorator.Attribute()
  public stationName!: StationName

  @Decorator.Attribute()
  public address!: string

  @Decorator.Attribute()
  public description!: string

  @Decorator.HashPrimaryKey('stationName')
  public static readonly primaryKey: Query.HashPrimaryKey<
    StationRecord,
    StationName
  >

  @Decorator.Writer()
  public static readonly writer: Query.Writer<StationRecord>
}
