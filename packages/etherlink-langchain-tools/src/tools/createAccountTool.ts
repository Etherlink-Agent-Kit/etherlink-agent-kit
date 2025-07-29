import { DynamicTool } from "@langchain/core/tools";
import { EtherlinkKit } from "etherlink-agent-kit";

export const createAccountTool = (kit: EtherlinkKit) => {
    return new DynamicTool({
        name: "createEtherlinkAccount",
        description: "Generates a new, empty Etherlink wallet. Returns the new wallet's address and private key. Use this when a user needs a fresh wallet to start with.",
        func: async () => {
            try {
                const newAccount = kit.account.create();
                return `New account created. Address: ${newAccount.address}, Private Key: ${newAccount.privateKey}. IMPORTANT: Store this private key securely and do not share it.`;
            } catch (error: any) {
                return `Error creating account: ${error.message}`;
            }
        },
    });
}; 