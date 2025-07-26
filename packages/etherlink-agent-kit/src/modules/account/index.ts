import { createWalletClient, http, createPublicClient, WalletClient, PublicClient, defineChain } from 'viem';
import { privateKeyToAccount, generatePrivateKey, privateKeyToAddress } from 'viem/accounts';
import { KitConfig } from '../../types';

// Define the Etherlink Testnet chain for Viem
const etherlinkTestnet = defineChain({
    id: 128123,
    name: 'Etherlink Testnet',
    nativeCurrency: { name: 'Tezos', symbol: 'XTZ', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://node.ghostnet.etherlink.com'] },
    },
    blockExplorers: {
        default: { name: 'Etherlink Testnet Explorer', url: 'https://testnet-explorer.etherlink.com' },
    },
});

// Define the Etherlink Mainnet chain for Viem
const etherlinkMainnet = defineChain({
    id: 42793,
    name: 'Etherlink Mainnet',
    nativeCurrency: { name: 'Tezos', symbol: 'XTZ', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://node.mainnet.etherlink.com'] },
    },
    blockExplorers: {
        default: { name: 'Etherlink Explorer', url: 'https://explorer.etherlink.com' },
    },
});

export class AccountModule {
    private client: WalletClient;
    private publicClient: PublicClient;
    private account: ReturnType<typeof privateKeyToAccount>;

    constructor(config: KitConfig) {
        this.account = privateKeyToAccount(config.privateKey);
        
        // Determine which chain to use based on network configuration
        const network = config.network || 'testnet';
        const chain = network === 'mainnet' ? etherlinkMainnet : etherlinkTestnet;
        
        this.client = createWalletClient({
            account: this.account,
            chain: chain,
            transport: http(config.rpcUrl)
        });

        this.publicClient = createPublicClient({
            chain: chain,
            transport: http(config.rpcUrl)
        });
    }

    /**
     * Generates a new, random private key and address.
     * Note: This does not change the key used by the current kit instance.
     */
    create() {
        const newPrivateKey = generatePrivateKey();
        const newAddress = privateKeyToAddress(newPrivateKey);
        return {
            address: newAddress,
            privateKey: newPrivateKey
        };
    }

    /**
     * Returns the address of the wallet configured in this kit instance.
     */
    getAddress() {
        return this.account.address;
    }

    /**
     * Fetches the native XTZ balance of the configured account.
     */
    async getBalance() {
        return this.publicClient.getBalance({ address: this.account.address });
    }

    /**
     * Signs an arbitrary string message with the configured account's private key.
     * @param message The message to sign.
     */
    async signMessage(message: string) {
        return this.client.signMessage({ message, account: this.account });
    }
    
    // Internal methods to provide the configured clients to other modules.
    _getWalletClient(): WalletClient {
        return this.client;
    }
    
    _getPublicClient(): PublicClient {
        return this.publicClient;
    }
} 