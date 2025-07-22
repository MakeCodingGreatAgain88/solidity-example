import { HardhatUserConfig } from "hardhat/config"
import 'hardhat-deploy'
import 'hardhat-deploy-ethers';
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-verify";
import '@nomicfoundation/hardhat-ethers';

// import * as dotenv from "dotenv"
import * as dotenv from "@chainlink/env-enc"
dotenv.config()

// task
import "./tasks"


// QuickNode
const SEPOLIA_RPC_URL_QUICKNODE = process.env.SEPOLIA_RPC_URL_QUICKNODE

// 部署合约账户
const SEPOLIA_OWNER_PRIVATE_KEY = process.env.SEPOLIA_OWNER_PRIVATE_KEY
// 测试合约账户
const SEPOLIA_TESTER_PRIVATE_KEY = process.env.SEPOLIA_TESTER_PRIVATE_KEY

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY

const config: HardhatUserConfig = {
    solidity: "0.8.30",
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL_QUICKNODE,
            accounts: [ SEPOLIA_OWNER_PRIVATE_KEY as string, SEPOLIA_TESTER_PRIVATE_KEY as string],
            chainId: 11155111
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_KEY
    },
    namedAccounts: {
        deployerAccount: {
            default: 0
        },
        testUserAccount: {
            default: 1
        }
    },
    mocha:{
        timeout: 300 * 1000
    }
}

export default config
