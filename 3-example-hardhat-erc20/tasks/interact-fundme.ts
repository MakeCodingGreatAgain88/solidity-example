import { task } from "hardhat/config"

// npx hardhat interact-fundme --address [FundMe contract] --network sepolia
task("interact-fundme",   "🔁 Interact with an existing FundMe contract: fund it from two accounts and withdraw").addParam("address", "fundme contract address").setAction(async (taskArgs, hre) => {
    // crate factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = await fundMeFactory.attach(taskArgs.address)

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
})
