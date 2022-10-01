import { BlacklistManager } from './blacklist-manager'
import { WhitelistManager } from './whitelist-manager'
import { TokenPolicyManager } from './token-policy-manager'
import { TokenManager } from './token-manager'

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
