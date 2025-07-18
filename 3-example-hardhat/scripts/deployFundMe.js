const {ethers} = require("hardhat")

async function main() {
    // crate factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploying...")

    const _lockTime = 60
    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(_lockTime)
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is: ${ fundMe.target }`)

    const address = fundMe.target
    console.log(`✅ Contract deployed at: ${ address }`)

    // ✅ 验证是否部署到 sepolia
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_KEY) {
        // ✅ 等待 5 个区块确认再验证
        console.log("⏳ Waiting for 5 confirmations...")
        await fundMe.deploymentTransaction().wait(5)

        // ✅ 验证
        await verifyFundMe(fundMe.target, [ _lockTime ])
    }
    else {
        console.log("⚠️ Not on sepolia, skipping ")
    }
}

async function verifyFundMe(fundMeAddress, args) {
    await hre.run("verify:verify", {
        address: fundMeAddress,
        constructorArguments: args
    })
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error)
    process.exit(1)
})