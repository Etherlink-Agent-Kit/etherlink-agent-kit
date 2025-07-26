# Etherlink Agent Kit

A comprehensive TypeScript SDK for interacting with the Etherlink blockchain. Built with Viem for robust Ethereum-compatible blockchain interactions.

## 🚀 Features

- **Account Management**: Create wallets, get balances, sign messages
- **Token Operations**: Transfer, mint, burn ERC-20 tokens
- **NFT Management**: Create collections, mint, transfer, burn NFTs
- **Smart Contract Interaction**: Read and execute any smart contract
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Etherlink Testnet Ready**: Pre-configured for Etherlink testnet

## 📦 Installation

```bash
npm install etherlink-agent-kit
```

## 🔧 Quick Start

### Basic Setup

```typescript
import { EtherlinkKit } from 'etherlink-agent-kit';

// Initialize the kit with your configuration
const kit = new EtherlinkKit({
  rpcUrl: 'https://node.ghostnet.etherlink.com',
  privateKey: '0x...' // Your private key with 0x prefix
});
```

### Account Operations

```typescript
// Get your wallet address
const address = kit.account.getAddress();
console.log('Wallet address:', address);

// Get native XTZ balance
const balance = await kit.account.getBalance();
console.log('XTZ balance:', balance);

// Create a new account (returns address and private key)
const newAccount = kit.account.create();
console.log('New account:', newAccount);

// Sign a message
const signature = await kit.account.signMessage('Hello Etherlink!');
console.log('Signature:', signature);
```

### Token Operations (ERC-20)

```typescript
// Transfer tokens
const txHash = await kit.token.transfer({
  tokenAddress: '0x...', // ERC-20 contract address
  to: '0x...',           // Recipient address
  amount: BigInt('1000000000000000000') // 1 token (18 decimals)
});
console.log('Transfer hash:', txHash);

// Mint tokens (if you have minting rights)
const mintHash = await kit.token.mint({
  tokenAddress: '0x...',
  to: '0x...',
  amount: BigInt('1000000000000000000')
});

// Burn tokens
const burnHash = await kit.token.burn({
  tokenAddress: '0x...',
  amount: BigInt('1000000000000000000')
});

// Get token balance
const tokenBalance = await kit.token.getBalance({
  tokenAddress: '0x...',
  ownerAddress: '0x...' // Optional, defaults to your address
});
```

### NFT Operations (ERC-721)

```typescript
// Create an NFT collection
const collectionAddress = await kit.nft.createCollection({
  name: 'My NFT Collection',
  symbol: 'MNFT'
});
console.log('Collection deployed at:', collectionAddress);

// Mint an NFT
const mintHash = await kit.nft.mint({
  collectionAddress: '0x...',
  to: '0x...',
  metadataUri: 'https://example.com/metadata.json'
});

// Transfer an NFT
const transferHash = await kit.nft.transfer({
  collectionAddress: '0x...',
  to: '0x...',
  tokenId: BigInt(1)
});

// Burn an NFT
const burnHash = await kit.nft.burn({
  collectionAddress: '0x...',
  tokenId: BigInt(1)
});

// Get NFT owner
const owner = await kit.nft.getOwner({
  collectionAddress: '0x...',
  tokenId: BigInt(1)
});
```

### Smart Contract Interaction

```typescript
// Read contract data
const result = await kit.chain.readContract({
  address: '0x...',
  abi: [...], // Contract ABI
  functionName: 'balanceOf',
  args: ['0x...']
});

// Execute contract function
const txHash = await kit.chain.executeContract({
  address: '0x...',
  abi: [...], // Contract ABI
  functionName: 'transfer',
  args: ['0x...', BigInt(1000)],
  value: BigInt(0) // Optional ETH value to send
});
```

## 🔗 Network Support

This SDK supports both Etherlink testnet and mainnet:

### Etherlink Testnet
- **Chain ID**: 128123
- **RPC URL**: `https://node.ghostnet.etherlink.com`
- **Explorer**: `https://testnet-explorer.etherlink.com`
- **Native Currency**: XTZ (Tezos)

### Etherlink Mainnet
- **Chain ID**: 42793
- **RPC URL**: `https://node.mainnet.etherlink.com`
- **Explorer**: `https://explorer.etherlink.com`
- **Native Currency**: XTZ (Tezos)

### Configuration

You can specify which network to use in your configuration:

```typescript
// For testnet (default)
const testnetConfig = {
  rpcUrl: 'https://node.ghostnet.etherlink.com',
  privateKey: '0x...',
  network: 'testnet' // Optional, defaults to 'testnet'
};

// For mainnet
const mainnetConfig = {
  rpcUrl: 'https://node.mainnet.etherlink.com',
  privateKey: '0x...',
  network: 'mainnet'
};
```

## 📋 API Reference

### EtherlinkKit

The main class that provides access to all modules.

```typescript
class EtherlinkKit {
  constructor(config: KitConfig)
  
  account: AccountModule
  token: TokenModule
  nft: NftModule
  chain: ChainModule
}
```

### KitConfig

```typescript
interface KitConfig {
  rpcUrl: string;      // Etherlink RPC endpoint
  privateKey: Hex;     // Your private key (0x-prefixed)
  network?: Network;   // Optional: 'mainnet' or 'testnet' (defaults to 'testnet')
}
```

### AccountModule

```typescript
class AccountModule {
  create(): { address: string; privateKey: string }
  getAddress(): string
  getBalance(): Promise<bigint>
  signMessage(message: string): Promise<string>
}
```

### TokenModule

```typescript
class TokenModule {
  transfer(params: TransferParams): Promise<string>
  mint(params: MintParams): Promise<string>
  burn(params: BurnParams): Promise<string>
  getBalance(params: BalanceParams): Promise<bigint>
}
```

### NftModule

```typescript
class NftModule {
  createCollection(params: CreateCollectionParams): Promise<string>
  mint(params: MintNftParams): Promise<string>
  transfer(params: TransferNftParams): Promise<string>
  burn(params: BurnNftParams): Promise<string>
  getOwner(params: GetOwnerParams): Promise<string>
}
```

### ChainModule

```typescript
class ChainModule {
  readContract(params: ContractInteractionParams): Promise<any>
  executeContract(params: ExecuteContractParams): Promise<string>
}
```

## 🛠️ Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: This is an alpha release (v0.0.1). The API may change in future versions. Use with caution in production environments. 