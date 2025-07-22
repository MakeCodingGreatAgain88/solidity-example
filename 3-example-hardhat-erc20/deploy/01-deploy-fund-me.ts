import { ethers } from "hardhat";
import { DEVELOPMENT_CHAINS, LOCK_TIME, NETWORK_CONFIG } from "../config/helper-hardhat-config"

const deployFundMe = async ({getNamedAccounts, deployments, network, run}) => {
    const {deployerAccount} = await getNamedAccounts()

    // get dataFeedAddress
    let dataFeedAddress

    // local
    if (DEVELOPMENT_CHAINS.includes(network.name)) {
        const mockDataFeed = await deployments.get("MockV3Aggregator")
        dataFeedAddress = mockDataFeed.address
    }
    // sepolia
    else {
        dataFeedAddress = NETWORK_CONFIG[network.config.chainId].ethUsdPriceFeed
    }

    // ✅ 验证是否部署到 sepolia
    const isDeploySepolia = network.config.chainId === 11155111 && process.env.ETHERSCAN_KEY

    // ✅ 部署合约
    const args = [ LOCK_TIME, dataFeedAddress ]
    const fundMe = await deployments.deploy("FundMe", {
        from: deployerAccount,
        args,
        log: true,
        waitConfirmations: isDeploySepolia ? 5 : 0
    })

    // ✅ 验证
    if (isDeploySepolia) {
        await run("verify:verify", {
            address: fundMe.address,
            constructorArguments: args
        })
    }
    /*else {
        console.log("⚠️ Not on sepolia, skipping ")
    }*/
}

deployFundMe.tags = [ "all", "fundme" ]

export default deployFundMe