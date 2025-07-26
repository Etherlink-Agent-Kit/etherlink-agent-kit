import { describe, it, expect, vi } from 'vitest';
import { EtherlinkKit } from '../src/EtherlinkKit';

// Mock viem modules
vi.mock('viem', () => ({
  createWalletClient: vi.fn(),
  createPublicClient: vi.fn(),
  http: vi.fn(),
  defineChain: vi.fn(),
}));

vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn(),
  generatePrivateKey: vi.fn(),
  privateKeyToAddress: vi.fn(),
}));

describe('EtherlinkKit', () => {
  const mockConfig = {
    rpcUrl: 'https://node.ghostnet.etherlink.com',
    privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234' as const,
  };

  it('should initialize with valid config', () => {
    expect(() => new EtherlinkKit(mockConfig)).not.toThrow();
  });

  it('should throw error with invalid private key', () => {
    const invalidConfig = {
      ...mockConfig,
      privateKey: 'invalid-key' as any,
    };
    expect(() => new EtherlinkKit(invalidConfig)).toThrow('A valid 0x-prefixed private key is required');
  });

  it('should throw error with missing RPC URL', () => {
    const invalidConfig = {
      ...mockConfig,
      rpcUrl: '',
    };
    expect(() => new EtherlinkKit(invalidConfig)).toThrow('RPC URL is required');
  });

  it('should have all required modules', () => {
    const kit = new EtherlinkKit(mockConfig);
    expect(kit.account).toBeDefined();
    expect(kit.token).toBeDefined();
    expect(kit.nft).toBeDefined();
    expect(kit.chain).toBeDefined();
  });
}); 