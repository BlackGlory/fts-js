import { BlacklistManager } from './blacklist-manager.js'
import { WhitelistManager } from './whitelist-manager.js'
import { TokenPolicyManager } from './token-policy-manager.js'
import { TokenManager } from './token-manager.js'

export interface IFTSManagerOptions {
  server: string
  adminPassword: string
  keepalive?: boolean
  timeout?: number
}

export class FTSManager {
  constructor(private options: IFTSManagerOptions) {}

  Blacklist = new BlacklistManager(this.options)
  Whitelist = new WhitelistManager(this.options)
  TokenPolicy = new TokenPolicyManager(this.options)
  Token = new TokenManager(this.options)
}
