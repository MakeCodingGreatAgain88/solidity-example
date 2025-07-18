import { task } from "hardhat/config"

task("deploy-fundme",  "🔧 Deploys the FundMe contract. Usage: npx hardhat deploy-fundme --locktime 60 --network sepolia").addParam("locktime", "The lock time").setAction(async (taskArgs, hre) => {
    // crate factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploying...")

    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(taskArgs.locktime)
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
        await verifyFundMe(fundMe.target, [ taskArgs.locktime ], hre)
    }
    else {
        console.log("⚠️ Not on sepolia, skipping ")
    }
})

async function verifyFundMe(fundMeAddress: string, args: any[], hre) {
    await hre.run("verify:verify", {
        address: fundMeAddress,
        constructorArguments: args
    })
}
