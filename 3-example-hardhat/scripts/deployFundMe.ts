import { ethers } from "hardhat"
import { LOCK_TIME } from "../config/helper-hardhat-config"

async function main() {
    // crate factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploying...")

    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(LOCK_TIME)
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
        await verifyFundMe(fundMe.target, [ LOCK_TIME, "0x694AA1769357215DE4FAC081bf1f309aDC325306" ])
    }
    else {
        console.log("⚠️ Not on sepolia, skipping ")
    }

    // init account
    const [ firstAccount, secondAccount ] = await ethers.getSigners()

    // fund 默认使用config配置的第一个地址进行操作
    const fundMeTx = await fundMe.fund({value: ethers.parseEther("0.1")})
    await fundMeTx.wait(1)

    // check balance
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`💰Balance of the contract is: ${ balanceOfContract }`)

    // fund contract with second account
    const secondAccountFundMeTx = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.1")})
    await secondAccountFundMeTx.wait(1)

    // check balance
    const balanceOfContractAfter = await ethers.provider.getBalance(fundMe.target)
    console.log(`💰Balance of the contract is: ${ balanceOfContractAfter }`)

    // fund mapping
    const firstAccountBalance = await fundMe.addressToAmountFunded(firstAccount.address)
    const secondAccountBalance = await fundMe.addressToAmountFunded(secondAccount.address)

    console.log(`💰firstAccount Balance is: ${ firstAccountBalance }`)
    console.log(`💰secondAccount Balance is: ${ secondAccountBalance }`)

    const withdrawTx = await fundMe.withdraw()
    await withdrawTx.wait(1)

    // check balance
    const balanceOfWithdrawal = await ethers.provider.getBalance(fundMe.target)
    console.log(`💰The contract balance after withdrawal is: ${ balanceOfWithdrawal }`)
}

async function verifyFundMe(fundMeAddress: string, args: any[]) {
    await hre.run("verify:verify", {
        address: fundMeAddress,
        constructorArguments: args
    })
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error)
    process.exit(1)
})