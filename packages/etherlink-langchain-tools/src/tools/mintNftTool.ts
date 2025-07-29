import { DynamicTool } from "@langchain/core/tools";
import { EtherlinkKit } from "etherlink-agent-kit";

export const createMintNftTool = (kit: EtherlinkKit) => {
    return new DynamicTool({
        name: "mintNFT",
        description: "Mints a new, unique Non-Fungible Token (NFT) within a given collection on the Etherlink testnet. Requires the collection's contract address, the recipient's address, and a URL pointing to the NFT's JSON metadata.",
        func: async (input) => {
            try {
                // Parse input as JSON
                const { collectionAddress, to, metadataUri } = JSON.parse(input);
                
                const txHash = await kit.nft.mint({
                    collectionAddress: collectionAddress as `0x${string}`,
                    to: to as `0x${string}`,
                    metadataUri,
                });
                return `Successfully initiated NFT mint. Transaction hash: ${txHash}`;
            } catch (error: any) {
                return `Error minting NFT: ${error.message}`;
            }
        },
    });
}; 