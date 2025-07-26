import { WalletClient, PublicClient } from 'viem';
import { ERC721_ABI } from '../../constants/abis';
import { CreateCollectionParams, MintNftParams, TransferNftParams, BurnNftParams, GetOwnerParams } from '../../types';
import { erc721Bytecode } from '../../constants/bytecode';

export class NftModule {
    constructor(private client: WalletClient, private publicClient: PublicClient) {}

    async createCollection({ name, symbol }: CreateCollectionParams) {
        if (erc721Bytecode === "0x...") {
            throw new Error("ERC721 bytecode placeholder is not replaced. Please compile a standard ERC721 contract and add its bytecode to src/constants/bytecode.ts");
        }
        
        const hash = await this.client.deployContract({
            abi: ERC721_ABI,
            bytecode: erc721Bytecode as `0x${string}`,
            args: [name, symbol],
            account: this.client.account!,
            chain: this.client.chain,
        });
        
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
        if (!receipt.contractAddress) {
            throw new Error("Contract deployment failed: no contract address found in receipt.");
        }
        return receipt.contractAddress;
    }

    async mint({ collectionAddress, to, metadataUri }: MintNftParams) {
        const { request } = await this.publicClient.simulateContract({
            address: collectionAddress,
            abi: ERC721_ABI,
            functionName: 'safeMint',
            args: [to, metadataUri],
            account: this.client.account!,
        });
        return this.client.writeContract(request);
    }

    async transfer({ collectionAddress, to, tokenId }: TransferNftParams) {
        const from = this.client.account!.address;
        const { request } = await this.publicClient.simulateContract({
            address: collectionAddress,
            abi: ERC721_ABI,
            functionName: 'safeTransferFrom',
            args: [from, to, tokenId],
            account: this.client.account!,
        });
        return this.client.writeContract(request);
    }

    async burn({ collectionAddress, tokenId }: BurnNftParams) {
         const { request } = await this.publicClient.simulateContract({
            address: collectionAddress,
            abi: ERC721_ABI,
            functionName: 'burn',
            args: [tokenId],
            account: this.client.account!,
        });
        return this.client.writeContract(request);
    }

    async getOwner({ collectionAddress, tokenId }: GetOwnerParams) {
        return this.publicClient.readContract({
            address: collectionAddress,
            abi: ERC721_ABI,
            functionName: 'ownerOf',
            args: [tokenId],
        });
    }
} 