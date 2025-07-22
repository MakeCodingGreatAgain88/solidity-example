import { DECIMALS, DEVELOPMENT_CHAINS, INITIAL_ANSWER } from "../config/helper-hardhat-config"

const deployMock = async ({getNamedAccounts, deployments, network}) => {
    if (DEVELOPMENT_CHAINS.includes(network.name)) {
        const {deployerAccount} = await getNamedAccounts()
        await deployments.deploy("MockV3Aggregator", {
            from: deployerAccount,
            args: [ DECIMALS, INITIAL_ANSWER ],
            log: true,
            waitConfirmations: 1
        })
    }
    else {
        console.log("⚠️ environment is not local, mock contract deployed is skipped")
    }
}

deployMock.tags = [ "all", "mock" ]

export default deployMock