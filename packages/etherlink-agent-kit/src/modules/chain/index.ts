import { WalletClient, PublicClient } from 'viem';
import { ContractInteractionParams, ExecuteContractParams } from '../../types';

export class ChainModule {
    constructor(private client: WalletClient, private publicClient: PublicClient) {}

    async readContract({ address, abi, functionName, args = [] }: ContractInteractionParams) {
        return this.publicClient.readContract({
            address,
            abi,
            functionName,
            args,
        });
    }

    async executeContract({ address, abi, functionName, args = [], value }: ExecuteContractParams) {
        const { request } = await this.publicClient.simulateContract({
            address,
            abi,
            functionName,
            args,
            value,
            account: this.client.account!,
        });
        return this.client.writeContract(request);
    }

    async simulateContract({ address, abi, functionName, args = [], value }: ExecuteContractParams) {
        return this.publicClient.simulateContract({
            address,
            abi,
            functionName,
            args,
            value,
            account: this.client.account!,
        });
    }
    
    async monitorEvents() {
        console.warn("Event monitoring requires a WebSocket RPC connection, which is not implemented in this version.");
        return Promise.resolve();
    }
} 