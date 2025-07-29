import { DynamicTool } from "@langchain/core/tools";
import { EtherlinkKit } from "etherlink-agent-kit";

export const createTransferTokenTool = (kit: EtherlinkKit) => {
    return new DynamicTool({
        name: "transferFungibleToken",
        description: "Transfers a specific amount of a fungible token (like an ERC-20) from the agent's wallet to another address on the Etherlink testnet. Requires the token's contract address, the recipient's address, and the amount to send in its smallest unit (e.g., '1000000000000000000' for 1 token with 18 decimals).",
        func: async (input) => {
            try {
                // Parse input as JSON
                const { tokenAddress, to, amount } = JSON.parse(input);
                
                const txHash = await kit.token.transfer({ 
                    tokenAddress: tokenAddress as `0x${string}`, 
                    to: to as `0x${string}`, 
                    amount: BigInt(amount) 
                });
                return `Successfully initiated transfer. Transaction hash: ${txHash}`;
            } catch (error: any) {
                return `Error during transfer: ${error.message}`;
            }
        },
    });
}; 