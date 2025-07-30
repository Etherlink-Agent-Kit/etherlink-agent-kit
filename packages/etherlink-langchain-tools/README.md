# Etherlink LangChain Tools

A comprehensive set of LangChain tools for interacting with the Etherlink blockchain. This package provides AI agents with the ability to perform blockchain operations through natural language commands.

## 🚀 Features

- **AI-Powered Blockchain Operations**: Enable AI agents to interact with Etherlink
- **Account Management**: Create new wallets and manage accounts
- **Token Operations**: Transfer ERC-20 tokens between addresses
- **NFT Management**: Mint and manage NFTs
- **Smart Contract Execution**: Execute any smart contract function
- **TypeScript Support**: Full type safety and IntelliSense
- **LangChain Integration**: Seamless integration with LangChain agents

## 📦 Installation

```bash
npm install etherlink-langchain-tools
```

**Note**: This package includes `etherlink-agent-kit` as a dependency, so you don't need to install it separately.

## 🔧 Quick Start

### Basic Setup

```typescript
import { EtherlinkKit } from 'etherlink-agent-kit';
import { createEtherlinkTools } from 'etherlink-langchain-tools';

// Initialize the Etherlink Kit
const kit = new EtherlinkKit({
  rpcUrl: 'https://node.ghostnet.etherlink.com',
  privateKey: '0x...' // Your private key with 0x prefix
});

// Create LangChain tools
const tools = createEtherlinkTools(kit);
```

### LangChain Agent Integration

```typescript
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { createEtherlinkTools } from 'etherlink-langchain-tools';
import { EtherlinkKit } from 'etherlink-agent-kit';

// Initialize the kit
const kit = new EtherlinkKit({
  rpcUrl: 'https://node.ghostnet.etherlink.com',
  privateKey: process.env.PRIVATE_KEY!
});

// Create tools
const tools = createEtherlinkTools(kit);

// Create the agent
const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt: PromptTemplate.fromTemplate(`
    You are a helpful AI assistant that can interact with the Etherlink blockchain.
    You have access to tools for creating accounts, transferring tokens, minting NFTs, and executing smart contracts.
    
    {input}
    {agent_scratchpad}
  `),
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
});

// Use the agent
const result = await agentExecutor.invoke({
  input: "Create a new wallet and transfer 0.1 XTZ to it"
});
```

## 🛠️ Available Tools

### 1. createEtherlinkAccount

Creates a new Etherlink wallet and returns the address and private key.

**Description**: Generates a new, empty Etherlink wallet. Returns the new wallet's address and private key. Use this when a user needs a fresh wallet to start with.

**Usage Example**:
```typescript
// Direct tool usage
const createAccountTool = tools[0];
const result = await createAccountTool.func('');
console.log(result);
// Output: "New account created. Address: 0x..., Private Key: 0x... IMPORTANT: Store this private key securely and do not share it."
```

### 2. transferFungibleToken

Transfers ERC-20 tokens from the agent's wallet to another address.

**Description**: Transfers a specific amount of a fungible token (like an ERC-20) from the agent's wallet to another address on the Etherlink testnet. Requires the token's contract address, the recipient's address, and the amount to send in its smallest unit (e.g., '1000000000000000000' for 1 token with 18 decimals).

**Usage Example**:
```typescript
// Direct tool usage
const transferTool = tools[1];
const input = JSON.stringify({
  tokenAddress: '0x...', // ERC-20 contract address
  to: '0x...',           // Recipient address
  amount: '1000000000000000000' // 1 token (18 decimals)
});
const result = await transferTool.func(input);
console.log(result);
// Output: "Successfully initiated transfer. Transaction hash: 0x..."
```

### 3. mintNFT

Mints a new NFT within a collection.

**Description**: Mints a new, unique Non-Fungible Token (NFT) within a given collection on the Etherlink testnet. Requires the collection's contract address, the recipient's address, and a URL pointing to the NFT's JSON metadata.

**Usage Example**:
```typescript
// Direct tool usage
const mintTool = tools[2];
const input = JSON.stringify({
  collectionAddress: '0x...', // NFT collection contract address
  to: '0x...',                // Recipient address
  metadataUri: 'https://example.com/metadata.json'
});
const result = await mintTool.func(input);
console.log(result);
// Output: "Successfully initiated NFT mint. Transaction hash: 0x..."
```

### 4. executeSmartContract

Executes any smart contract function that requires a transaction.

**Description**: Executes a write function on any smart contract on the Etherlink testnet that requires a transaction. Use this for any action that changes blockchain state, like voting, staking, or claiming rewards. Requires the contract's address, its JSON ABI, the function name, and any arguments.

**Usage Example**:
```typescript
// Direct tool usage
const executeTool = tools[3];
const input = JSON.stringify({
  address: '0x...',           // Contract address
  abi: [...],                 // Contract ABI
  functionName: 'transfer',   // Function to call
  args: ['0x...', '1000']     // Function arguments
});
const result = await executeTool.func(input);
console.log(result);
// Output: "Successfully executed contract function. Transaction hash: 0x..."
```

## 🤖 AI Agent Examples

### Example 1: Account Creation and Token Transfer

```typescript
const result = await agentExecutor.invoke({
  input: "Create a new wallet and send 0.05 XTZ to address 0x100b0fc1cFE1845428089b9d8A85c4b2d1358c5C"
});
```

### Example 2: NFT Operations

```typescript
const result = await agentExecutor.invoke({
  input: "Mint an NFT to address 0x100b0fc1cFE1845428089b9d8A85c4b2d1358c5C with metadata at https://example.com/nft1.json"
});
```

### Example 3: Smart Contract Interaction

```typescript
const result = await agentExecutor.invoke({
  input: "Execute the 'claim' function on contract 0x... with no arguments"
});
```

## 🔗 Network Support

This package supports both Etherlink testnet and mainnet:

### Etherlink Testnet (Default)
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

You can specify which network to use in your EtherlinkKit configuration:

```typescript
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
```

## 📋 API Reference

### createEtherlinkTools

Creates a comprehensive suite of LangChain tools from an initialized EtherlinkKit instance.

```typescript
function createEtherlinkTools(kit: EtherlinkKit): Tool[]
```

**Parameters**:
- `kit`: An instance of EtherlinkKit, configured with a private key and RPC URL

**Returns**: An array of Tool instances ready to be used by a LangChain agent

### Tool Structure

Each tool follows the LangChain Tool interface:

```typescript
interface Tool {
  name: string;
  description: string;
  func: (input: string) => Promise<string>;
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

## 🔒 Security Considerations

- **Private Key Management**: Always store private keys securely and never expose them in client-side code
- **Environment Variables**: Use environment variables for sensitive configuration
- **Network Selection**: This package supports both testnet and mainnet. For mainnet usage, ensure proper security measures and use appropriate RPC URLs

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: This is an alpha release (v0.0.1). The API may change in future versions. Use with caution in production environments. 