import { WalletClient, PublicClient } from 'viem';
import { ERC20_ABI } from '../../constants/abis';
import { TransferParams, MintParams, BurnParams, BalanceParams } from '../../types';

export class TokenModule {
    constructor(private client: WalletClient, private publicClient: PublicClient) {}

    async transfer({ tokenAddress, to, amount }: TransferParams) {
        const { request } = await this.publicClient.simulateContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [to, amount],
            account: this.client.account!,
        });
        return this.client.writeContract(request);
    }

    async mint({ tokenAddress, to, amount }: MintParams) {
        const { request } = await this.publicClient.simulateContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'mint',
            args: [to, amount],
            account: this.client.account!,
        });
        return this.client.writeContract(request);
    }

    async burn({ tokenAddress, amount }: BurnParams) {
        const { request } = await this.publicClient.simulateContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'burn',
            args: [amount],
            account: this.client.account!,
        });
        return this.client.writeContract(request);
    }

    async getBalance({ tokenAddress, ownerAddress }: BalanceParams) {
        const addressToQuery = ownerAddress || this.client.account!.address;
        return this.publicClient.readContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [addressToQuery],
        });
    }
} 