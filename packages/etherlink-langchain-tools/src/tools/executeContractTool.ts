import { DynamicTool } from "@langchain/core/tools";
import { EtherlinkKit } from "etherlink-agent-kit";

export const createExecuteContractTool = (kit: EtherlinkKit) => {
    return new DynamicTool({
        name: "executeSmartContract",
        description: "Executes a write function on any smart contract on the Etherlink testnet that requires a transaction. Use this for any action that changes blockchain state, like voting, staking, or claiming rewards. Requires the contract's address, its JSON ABI, the function name, and any arguments.",
        func: async (input) => {
            try {
                // Parse input as JSON
                const { address, abi, functionName, args } = JSON.parse(input);
                
                const txHash = await kit.chain.executeContract({
                    address: address as `0x${string}`,
                    abi,
                    functionName,
                    args,
                });
                return `Successfully executed contract function. Transaction hash: ${txHash}`;
            } catch (error: any) {
                return `Error executing contract: ${error.message}`;
            }
        },
    });
}; 