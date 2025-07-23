import { AccountModule } from './modules/account';
import { TokenModule } from './modules/token';
import { NftModule } from './modules/nft';
import { ChainModule } from './modules/chain';
import { KitConfig } from './types';

/**
 * The main class for the Etherlink Kit SDK.
 * Provides access to all modules for blockchain interaction.
 */
export class EtherlinkKit {
    public account: AccountModule;
    public token: TokenModule;
    public nft: NftModule;
    public chain: ChainModule;

    constructor(config: KitConfig) {
        if (!config.privateKey || !config.privateKey.startsWith('0x')) {
            throw new Error("A valid 0x-prefixed private key is required for initialization.");
        }
        if (!config.rpcUrl) {
            throw new Error("RPC URL is required for initialization.");
        }

        this.account = new AccountModule(config);
        
        const walletClient = this.account._getWalletClient();
        const publicClient = this.account._getPublicClient();

        this.token = new TokenModule(walletClient, publicClient);
        this.nft = new NftModule(walletClient, publicClient);
        this.chain = new ChainModule(walletClient, publicClient);
    }
} 