import { EtherlinkKit } from 'etherlink-agent-kit';
import { Tool } from '@langchain/core/tools';
import { createAccountTool } from './tools/createAccountTool';
import { createTransferTokenTool } from './tools/transferTokenTool';
import { createMintNftTool } from './tools/mintNftTool';
import { createExecuteContractTool } from './tools/executeContractTool';

/**
 * Creates a comprehensive suite of LangChain tools from an initialized EtherlinkKit instance.
 * @param kit An instance of EtherlinkKit, configured with a private key and RPC URL.
 * @returns An array of Tool instances ready to be used by a LangChain agent.
 */
export function createEtherlinkTools(kit: EtherlinkKit): Tool[] {
    return [
        createAccountTool(kit),
        createTransferTokenTool(kit),
        createMintNftTool(kit),
        createExecuteContractTool(kit),
    ];
} 