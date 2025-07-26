import { Address, Hex, Abi } from 'viem';

export type Network = 'mainnet' | 'testnet';

export interface KitConfig {
  rpcUrl: string;
  privateKey: Hex;
  network?: Network; // Optional, defaults to 'testnet' for backward compatibility
}

export interface TransferParams {
  tokenAddress: Address;
  to: Address;
  amount: bigint;
}

export interface MintParams {
    tokenAddress: Address;
    to: Address;
    amount: bigint;
}

export interface BurnParams {
    tokenAddress: Address;
    amount: bigint;
}

export interface BalanceParams {
    tokenAddress: Address;
    ownerAddress?: Address;
}

export interface CreateCollectionParams {
    name: string;
    symbol: string;
}

export interface MintNftParams {
    collectionAddress: Address;
    to: Address;
    metadataUri: string;
}

export interface TransferNftParams {
    collectionAddress: Address;
    to: Address;
    tokenId: bigint;
}

export interface BurnNftParams {
    collectionAddress: Address;
    tokenId: bigint;
}

export interface GetOwnerParams {
    collectionAddress: Address;
    tokenId: bigint;
}

export interface ContractInteractionParams {
    address: Address;
    abi: Abi;
    functionName: string;
    args?: any[];
}

export interface ExecuteContractParams extends ContractInteractionParams {
    value?: bigint;
} 