import { Cache, ExpirationStrategy, MemoryStorage } from 'node-ts-cache'
import { SecretsManager } from 'aws-sdk'

const SecretId = 'airkorea'
const secretsManager = new SecretsManager()
const strategy = new ExpirationStrategy(new MemoryStorage())

export class ServiceKeyProvider {
  @Cache(strategy, { ttl: 60 * 60 })
  public async getServiceKey(): Promise<string> {
    const result = await secretsManager.getSecretValue({ SecretId }).promise()
    return JSON.parse(result.SecretString || '').serviceKey
  }
}
