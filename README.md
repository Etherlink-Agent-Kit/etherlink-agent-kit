# Etherlink AI Agent Kit

A complete monorepo for building AI agents that interact with the Etherlink blockchain. This project provides both a core SDK and LangChain-compatible tools for seamless blockchain integration.

## Project Structure

```
etherlink-agent-kit/
├── packages/
│   ├── etherlink-agent-kit/          # Core SDK for Etherlink blockchain interaction
│   └── etherlink-langchain-tools/  # LangChain tools adapter
├── package.json                # Root workspace configuration
└── README.md                   # This file
```

## 📦 Published Packages

Both packages are now available on npm:

- **`etherlink-agent-kit@0.0.1`** - [View on npm](https://www.npmjs.com/package/etherlink-agent-kit)
- **`etherlink-langchain-tools@0.0.1`** - [View on npm](https://www.npmjs.com/package/etherlink-langchain-tools)

## Packages

### etherlink-agent-kit (v0.0.1)
Core SDK for direct interaction with the Etherlink blockchain.

**Features:**
- Account management and wallet operations
- ERC-20 token transfers, minting, and burning
- NFT collection creation, minting, and transfers
- Generic smart contract interactions
- Built with Viem for robust blockchain interaction

**Installation:**
```bash
npm install etherlink-agent-kit
```

**Usage:**
```typescript
import { EtherlinkKit } from 'etherlink-agent-kit';

const kit = new EtherlinkKit({
  rpcUrl: 'https://node.ghostnet.etherlink.com',
  privateKey: '0x...' // Your private key
});

// Create a new account
const newAccount = kit.account.create();

// Transfer tokens
await kit.token.transfer({
  tokenAddress: '0x...',
  to: '0x...',
  amount: BigInt('1000000000000000000')
});

// Mint an NFT
await kit.nft.mint({
  collectionAddress: '0x...',
  to: '0x...',
  metadataUri: 'https://...'
});
```

### etherlink-langchain-tools (v0.0.1)
LangChain-compatible tools that wrap the core SDK functionality.

**Features:**
- Create new Etherlink accounts
- Transfer fungible tokens
- Mint NFTs
- Execute smart contract functions
- Full integration with LangChain agents

**Installation:**
```bash
npm install etherlink-langchain-tools
```

**Usage:**
```typescript
import { EtherlinkKit } from 'etherlink-agent-kit';
import { createEtherlinkTools } from 'etherlink-langchain-tools';

// For testnet (default)
const testnetKit = new EtherlinkKit({
  rpcUrl: 'https://node.ghostnet.etherlink.com',
  privateKey: '0x...',
  network: 'testnet' // Optional, defaults to 'testnet'
});

// For mainnet
const mainnetKit = new EtherlinkKit({
  rpcUrl: 'https://node.mainnet.etherlink.com',
  privateKey: '0x...',
  network: 'mainnet'
});

const tools = createEtherlinkTools(testnetKit); // or mainnetKit

// Use with LangChain agent
const agent = new Agent({
  tools,
  // ... other configuration
});
```

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd etherlink-agent-kit

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

### Workspace Commands
- `npm run build` - Build all packages
- `npm test` - Run tests for all packages
- `npm run build --workspace=etherlink-agent-kit` - Build specific package
- `npm test --workspace=etherlink-langchain-tools` - Test specific package

## Tech Stack

- **Package Manager**: npm workspaces
- **Language**: TypeScript
- **Blockchain Interaction**: Viem
- **Build Tool**: Vite
- **Testing Framework**: Vitest
- **Schema Validation**: Zod
- **AI Framework Integration**: LangChain

## Configuration

### Network Support
The SDK supports both Etherlink testnet and mainnet:

#### Etherlink Testnet (Default)
- Chain ID: 128123
- RPC URL: https://node.ghostnet.etherlink.com
- Explorer: https://testnet-explorer.etherlink.com

#### Etherlink Mainnet
- Chain ID: 42793
- RPC URL: https://node.mainnet.etherlink.com
- Explorer: https://explorer.etherlink.com

### Environment Variables
Set up your environment variables for development:
```bash
# For testnet
ETHERLINK_RPC_URL=https://node.ghostnet.etherlink.com
ETHERLINK_PRIVATE_KEY=0x...
ETHERLINK_NETWORK=testnet

# For mainnet
ETHERLINK_RPC_URL=https://node.mainnet.etherlink.com
ETHERLINK_PRIVATE_KEY=0x...
ETHERLINK_NETWORK=mainnet
```


## License

MIT License - see LICENSE file for details.

