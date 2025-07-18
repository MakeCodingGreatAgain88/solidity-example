import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-verify";
// import * as dotenv from "dotenv"
import * as dotenv from "@chainlink/env-enc"

dotenv.config()

// QuickNode
const SEPOLIA_RPC_URL_QUICKNODE = process.env.SEPOLIA_RPC_URL_QUICKNODE
const SEPOLIA_KEY_QUICKNODE = process.env.SEPOLIA_KEY_QUICKNODE

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY

const config: HardhatUserConfig = {
    solidity: "0.8.30",
    // defaultNetwork: "hardhat", sepolia
    // alchemy, infura，QuickNode
    networks: {
        hardhat: {},
        sepolia: {
            url: SEPOLIA_RPC_URL_QUICKNODE,
            accounts: [ SEPOLIA_KEY_QUICKNODE as string ],
            chainId: 11155111
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_KEY
    },
}

export default config
