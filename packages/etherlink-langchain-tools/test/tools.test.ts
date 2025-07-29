import { describe, it, expect, vi } from 'vitest';
import { createEtherlinkTools } from '../src/index';

// Mock the etherlink-agent-kit module
vi.mock('etherlink-agent-kit', () => ({
  EtherlinkKit: vi.fn().mockImplementation(() => ({
    account: {
      create: vi.fn().mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        privateKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      }),
    },
    token: {
      transfer: vi.fn().mockResolvedValue('0xtxhash123'),
    },
    nft: {
      mint: vi.fn().mockResolvedValue('0xtxhash456'),
    },
    chain: {
      executeContract: vi.fn().mockResolvedValue('0xtxhash789'),
    },
  })),
}));

describe('Etherlink LangChain Tools', () => {
  it('should create all required tools', () => {
    const mockKit = {
      account: {
        create: vi.fn().mockReturnValue({
          address: '0x1234567890123456789012345678901234567890',
          privateKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        }),
      },
      token: {
        transfer: vi.fn().mockResolvedValue('0xtxhash123'),
      },
      nft: {
        mint: vi.fn().mockResolvedValue('0xtxhash456'),
      },
      chain: {
        executeContract: vi.fn().mockResolvedValue('0xtxhash789'),
      },
    };
    const tools = createEtherlinkTools(mockKit as any);
    
    expect(tools).toHaveLength(4);
    expect(tools[0].name).toBe('createEtherlinkAccount');
    expect(tools[1].name).toBe('transferFungibleToken');
    expect(tools[2].name).toBe('mintNFT');
    expect(tools[3].name).toBe('executeSmartContract');
  });

  it('should have proper tool descriptions', () => {
    const mockKit = {
      account: {
        create: vi.fn().mockReturnValue({
          address: '0x1234567890123456789012345678901234567890',
          privateKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        }),
      },
      token: {
        transfer: vi.fn().mockResolvedValue('0xtxhash123'),
      },
      nft: {
        mint: vi.fn().mockResolvedValue('0xtxhash456'),
      },
      chain: {
        executeContract: vi.fn().mockResolvedValue('0xtxhash789'),
      },
    };
    const tools = createEtherlinkTools(mockKit as any);
    
    expect(tools[0].description).toContain('Generates a new, empty Etherlink wallet');
    expect(tools[1].description).toContain('Transfers a specific amount of a fungible token');
    expect(tools[2].description).toContain('Mints a new, unique Non-Fungible Token');
    expect(tools[3].description).toContain('Executes a write function on any smart contract');
  });
}); 