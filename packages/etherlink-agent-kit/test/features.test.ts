import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EtherlinkKit } from '../src/EtherlinkKit';

// Mock viem modules
const mockWalletClient = {
  account: { address: '0x1234567890123456789012345678901234567890' },
  writeContract: vi.fn(),
  signMessage: vi.fn(),
  deployContract: vi.fn(),
  chain: { id: 128123 }
};

const mockPublicClient = {
  getBalance: vi.fn(),
  readContract: vi.fn(),
  simulateContract: vi.fn(),
  waitForTransactionReceipt: vi.fn()
};

vi.mock('viem', () => ({
  createWalletClient: vi.fn(() => mockWalletClient),
  createPublicClient: vi.fn(() => mockPublicClient),
  http: vi.fn(),
  defineChain: vi.fn(() => ({ id: 128123, name: 'Etherlink Testnet' })),
}));

vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn(() => ({ address: '0x1234567890123456789012345678901234567890' })),
  generatePrivateKey: vi.fn(() => '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'),
  privateKeyToAddress: vi.fn(() => '0xabcdef1234567890abcdef1234567890abcdef1234'),
}));

describe('EtherlinkKit Features', () => {
  let kit: EtherlinkKit;
  const mockConfig = {
    rpcUrl: 'https://node.ghostnet.etherlink.com',
    privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    kit = new EtherlinkKit(mockConfig);
  });

  describe('Balance Checking', () => {
    it('should get native XTZ balance successfully', async () => {
      const expectedBalance = BigInt('1000000000000000000'); // 1 XTZ
      mockPublicClient.getBalance.mockResolvedValue(expectedBalance);

      const balance = await kit.account.getBalance();

      expect(mockPublicClient.getBalance).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890'
      });
      expect(balance).toBe(expectedBalance);
    });

    it('should get token balance for specific address', async () => {
      const tokenAddress = '0xTokenContractAddress123456789012345678901234567890';
      const ownerAddress = '0xOwnerAddress123456789012345678901234567890123456';
      const expectedBalance = BigInt('500000000000000000'); // 0.5 tokens
      
      mockPublicClient.readContract.mockResolvedValue(expectedBalance);

      const balance = await kit.token.getBalance({
        tokenAddress: tokenAddress as `0x${string}`,
        ownerAddress: ownerAddress as `0x${string}`
      });

      expect(mockPublicClient.readContract).toHaveBeenCalledWith({
        address: tokenAddress,
        abi: expect.any(Array),
        functionName: 'balanceOf',
        args: [ownerAddress]
      });
      expect(balance).toBe(expectedBalance);
    });

    it('should get token balance for current account when owner not specified', async () => {
      const tokenAddress = '0xTokenContractAddress123456789012345678901234567890';
      const expectedBalance = BigInt('1000000000000000000'); // 1 token
      
      mockPublicClient.readContract.mockResolvedValue(expectedBalance);

      const balance = await kit.token.getBalance({
        tokenAddress: tokenAddress as `0x${string}`
      });

      expect(mockPublicClient.readContract).toHaveBeenCalledWith({
        address: tokenAddress,
        abi: expect.any(Array),
        functionName: 'balanceOf',
        args: ['0x1234567890123456789012345678901234567890']
      });
      expect(balance).toBe(expectedBalance);
    });

    it('should handle balance checking errors gracefully', async () => {
      const errorMessage = 'RPC error: connection failed';
      mockPublicClient.getBalance.mockRejectedValue(new Error(errorMessage));

      await expect(kit.account.getBalance()).rejects.toThrow(errorMessage);
    });
  });

  describe('Token Minting', () => {
    it('should mint tokens successfully', async () => {
      const tokenAddress = '0xTokenContractAddress123456789012345678901234567890';
      const toAddress = '0xRecipientAddress1234567890123456789012345678901234';
      const amount = BigInt('1000000000000000000'); // 1 token
      const expectedTxHash = '0xTransactionHash1234567890123456789012345678901234567890123456789012345678901234';

      mockPublicClient.simulateContract.mockResolvedValue({
        request: { to: tokenAddress, data: '0xMintData' }
      });
      mockWalletClient.writeContract.mockResolvedValue(expectedTxHash);

      const txHash = await kit.token.mint({
        tokenAddress: tokenAddress as `0x${string}`,
        to: toAddress as `0x${string}`,
        amount
      });

      expect(mockPublicClient.simulateContract).toHaveBeenCalledWith({
        address: tokenAddress,
        abi: expect.any(Array),
        functionName: 'mint',
        args: [toAddress, amount],
        account: mockWalletClient.account
      });
      expect(mockWalletClient.writeContract).toHaveBeenCalledWith({
        to: tokenAddress,
        data: '0xMintData'
      });
      expect(txHash).toBe(expectedTxHash);
    });

    it('should handle minting errors gracefully', async () => {
      const tokenAddress = '0xTokenContractAddress123456789012345678901234567890';
      const toAddress = '0xRecipientAddress1234567890123456789012345678901234';
      const amount = BigInt('1000000000000000000');

      const errorMessage = 'Insufficient permissions to mint';
      mockPublicClient.simulateContract.mockRejectedValue(new Error(errorMessage));

      await expect(kit.token.mint({
        tokenAddress: tokenAddress as `0x${string}`,
        to: toAddress as `0x${string}`,
        amount
      })).rejects.toThrow(errorMessage);
    });

    it('should validate minting parameters', async () => {
      const invalidParams = {
        tokenAddress: 'invalid-address' as any,
        to: '0xRecipientAddress1234567890123456789012345678901234' as `0x${string}`,
        amount: BigInt('1000000000000000000')
      };

      await expect(kit.token.mint(invalidParams)).rejects.toThrow();
    });
  });

  describe('Contract Reading', () => {
    it('should read contract data successfully', async () => {
      const contractAddress = '0xContractAddress1234567890123456789012345678901234';
      const abi = [
        {
          type: 'function' as const,
          name: 'getBalance',
          inputs: [{ name: 'user', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view' as const
        }
      ];
      const functionName = 'getBalance';
      const args = ['0xUserAddress123456789012345678901234567890123456'];
      const expectedResult = BigInt('1000000000000000000');

      mockPublicClient.readContract.mockResolvedValue(expectedResult);

      const result = await kit.chain.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args
      });

      expect(mockPublicClient.readContract).toHaveBeenCalledWith({
        address: contractAddress,
        abi,
        functionName,
        args
      });
      expect(result).toBe(expectedResult);
    });

    it('should read contract data without arguments', async () => {
      const contractAddress = '0xContractAddress1234567890123456789012345678901234';
      const abi = [
        {
          type: 'function' as const,
          name: 'totalSupply',
          inputs: [],
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view' as const
        }
      ];
      const functionName = 'totalSupply';
      const expectedResult = BigInt('1000000000000000000000');

      mockPublicClient.readContract.mockResolvedValue(expectedResult);

      const result = await kit.chain.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName
      });

      expect(mockPublicClient.readContract).toHaveBeenCalledWith({
        address: contractAddress,
        abi,
        functionName,
        args: []
      });
      expect(result).toBe(expectedResult);
    });

    it('should handle contract reading errors gracefully', async () => {
      const contractAddress = '0xContractAddress1234567890123456789012345678901234';
      const abi = [{ 
        type: 'function' as const, 
        name: 'invalidFunction', 
        inputs: [], 
        outputs: [],
        stateMutability: 'view' as const
      }];
      const functionName = 'invalidFunction';

      const errorMessage = 'Function not found';
      mockPublicClient.readContract.mockRejectedValue(new Error(errorMessage));

      await expect(kit.chain.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName
      })).rejects.toThrow(errorMessage);
    });

    it('should read complex contract data', async () => {
      const contractAddress = '0xContractAddress1234567890123456789012345678901234';
      const abi = [
        {
          type: 'function' as const,
          name: 'getUserInfo',
          inputs: [{ name: 'user', type: 'address' }],
          outputs: [
            { name: 'balance', type: 'uint256' },
            { name: 'lastUpdate', type: 'uint256' },
            { name: 'isActive', type: 'bool' }
          ],
          stateMutability: 'view' as const
        }
      ];
      const functionName = 'getUserInfo';
      const args = ['0xUserAddress123456789012345678901234567890123456'];
      const expectedResult = [
        BigInt('1000000000000000000'),
        BigInt('1640995200'),
        true
      ];

      mockPublicClient.readContract.mockResolvedValue(expectedResult);

      const result = await kit.chain.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Integration Tests', () => {
    it('should check balance, mint tokens, and read contract in sequence', async () => {
      // Setup mocks
      const initialBalance = BigInt('5000000000000000000'); // 5 XTZ
      const tokenAddress = '0xTokenContractAddress123456789012345678901234567890';
      const contractAddress = '0xContractAddress1234567890123456789012345678901234';
      
      mockPublicClient.getBalance.mockResolvedValue(initialBalance);
      mockPublicClient.simulateContract.mockResolvedValue({
        request: { to: tokenAddress, data: '0xMintData' }
      });
      mockWalletClient.writeContract.mockResolvedValue('0xMintTxHash');
      mockPublicClient.readContract
        .mockResolvedValueOnce(BigInt('1000000000000000000')) // Token balance
        .mockResolvedValueOnce('Token Name'); // Contract read

      // Test sequence
      const balance = await kit.account.getBalance();
      expect(balance).toBe(initialBalance);

      const mintTx = await kit.token.mint({
        tokenAddress: tokenAddress as `0x${string}`,
        to: '0xRecipientAddress1234567890123456789012345678901234' as `0x${string}`,
        amount: BigInt('1000000000000000000')
      });
      expect(mintTx).toBe('0xMintTxHash');

      const tokenBalance = await kit.token.getBalance({
        tokenAddress: tokenAddress as `0x${string}`
      });
      expect(tokenBalance).toBe(BigInt('1000000000000000000'));

      const contractData = await kit.chain.readContract({
        address: contractAddress as `0x${string}`,
        abi: [{ 
          type: 'function' as const, 
          name: 'name', 
          inputs: [], 
          outputs: [{ type: 'string' }],
          stateMutability: 'view' as const
        }],
        functionName: 'name'
      });
      expect(contractData).toBe('Token Name');
    });
  });
}); 