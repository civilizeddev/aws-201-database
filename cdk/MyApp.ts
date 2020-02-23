import { App } from '@aws-cdk/core'

import { DevAuroraStack } from './stacks/DevAuroraStack'

export class MyApp extends App {
  constructor() {
    super()
    new DevAuroraStack(this, 'my-aurora-stack')
  }
}
