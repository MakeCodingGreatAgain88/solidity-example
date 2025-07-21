import { ethers, deployments, getNamedAccounts } from "hardhat"
import { time, mine, reset } from "@nomicfoundation/hardhat-network-helpers"
import { assert, expect } from "chai"
import { LOCK_TIME, INITIAL_ANSWER } from "../config/helper-hardhat-config"

describe("FundMe", async function () {
    let fundMe: any
    let fundMeSecondAccount: any
    let firstAccount: string
    let secondAccount: string
    let mockV3Aggregator: any
    let MINIMUM_USD: bigint
    const ETH_PRICE = BigInt(INITIAL_ANSWER) // 3700 USD per ETH, 8 decimals

    before(async function () {
        await deployments.fixture([ "all" ])
        const fundMeDeploy = await deployments.get("FundMe")
        firstAccount = (await getNamedAccounts()).deployerAccount
        secondAccount = (await getNamedAccounts()).testUserAccount
        fundMe = await ethers.getContractAt("FundMe", fundMeDeploy.address)
        fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount)
        MINIMUM_USD = await fundMe.MINIMUN_VALUE()
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
    })

    beforeEach(async function () {
        await reset()
        await deployments.fixture([ "all" ])
        const fundMeDeploy = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeploy.address)
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
    })

    it("测试owner是否为合约创建者", async function () {
        const owner = await fundMe.owner()
        assert.equal(owner, firstAccount, "Owner should be deployer")
    })

    it("测试datafeed address是否为指定值", async function () {
        const dataFeed = await fundMe.dataFeed()
        assert.equal(dataFeed, mockV3Aggregator.address, "DataFeed address should match MockV3Aggregator")
    })

    it("测试窗口期内可以充值", async function () {
        await time.increase(100) // 100 秒 < LOCK_TIME (180)
        await mine()
        const ethAmount = ethers.parseEther("1") // 1 ETH = 3700 USD > 10 USD
        await expect(fundMe.fund({value: ethAmount})).to.not.be.reverted
        const fundedAmount = await fundMe.addressToAmountFunded(firstAccount)
        assert.equal(fundedAmount.toString(), ethAmount.toString(), "Funded amount should match")
    })

    it(`测试窗口期之后不能充值, 窗口期为${ LOCK_TIME }, 当前增加时间为${ LOCK_TIME + 1 }, 预期失败`, async function () {
        await time.increase(LOCK_TIME + 1) // 181 秒 > LOCK_TIME (180)
        await mine()
        await expect(fundMe.fund({value: ethers.parseEther("1")})).to.be.revertedWith("lock time is over")
    })

    it("测试低于最低金额不能充值", async function () {
        const minEth = (MINIMUM_USD * 10n ** 8n) / ETH_PRICE // ≈ 0.0027027 ETH
        const belowMinEth = minEth / 2n // 低于 10 USD
        await time.increase(100) // 仍在锁定期内
        await mine()
        await expect(fundMe.fund({value: belowMinEth})).to.be.revertedWith("send more ETH")
    })

    it("测试锁定期后余额不足可退款", async function () {
        const ethAmount = ethers.parseEther("0.01") // 0.01 ETH ≈ 37 USD < 100 USD
        await fundMe.fund({value: ethAmount}) // 充值
        await time.increase(LOCK_TIME + 1) // 超过锁定期
        await mine()
        await expect(fundMe.refundMyFunds()).to.emit(fundMe, "refundWithdrawalByFunder").withArgs(ethAmount, firstAccount)
    })

    it("测试锁定期后余额足够不可退款", async function () {
        const ethAmount = ethers.parseEther("0.1") // 0.1 ETH ≈ 370 USD > 100 USD
        await fundMe.fund({value: ethAmount}) // 充值
        await time.increase(LOCK_TIME + 1) // 超过锁定期
        await mine()
        await expect(fundMe.refundMyFunds()).to.be.revertedWith("Target is reached")
    })

    it("测试锁定期内不可退款", async function () {
        const ethAmount = ethers.parseEther("0.01") // 0.01 ETH ≈ 37 USD
        await fundMe.fund({value: ethAmount}) // 充值
        await time.increase(100) // 仍在锁定期内
        await mine()
        await expect(fundMe.refundMyFunds()).to.be.revertedWith("lock time is not over")
    })

    it("测试无投资记录不可退款", async function () {
        await time.increase(LOCK_TIME + 1) // 超过锁定期
        await mine()

        await expect(fundMeSecondAccount.refundMyFunds()).to.be.revertedWith("No funds to refund")
    })

    it("测试锁定期后余额足够owner可提款", async function () {
        const ethAmount = ethers.parseEther("0.1") // 0.1 ETH ≈ 370 USD > 100 USD
        await fundMe.fund({value: ethAmount}) // 充值
        await time.increase(LOCK_TIME + 1) // 超过锁定期
        await mine()
        // 比对提取余额和提取地址是否一致
        await expect(fundMe.getFund()).to.emit(fundMe, "fundWithdrawalByOwner").withArgs(ethAmount, firstAccount)
    })

    it("测试锁定期后余额不足owner不可提款", async function () {
        const ethAmount = ethers.parseEther("0.01") // 0.01 ETH ≈ 37 USD < 100 USD
        await fundMe.fund({value: ethAmount}) // 充值
        await time.increase(LOCK_TIME + 1) // 超过锁定期
        await mine()
        await expect(fundMe.getFund()).to.be.revertedWith("Target is not reached")
    })

    it("测试锁定期内owner不可提款", async function () {
        const ethAmount = ethers.parseEther("0.1") // 0.1 ETH ≈ 370 USD
        await fundMe.fund({value: ethAmount}) // 充值
        await time.increase(100) // 仍在锁定期内
        await mine()
        await expect(fundMe.getFund()).to.be.revertedWith("lock time is not over")
    })

    it("测试非owner不可提款", async function () {
        const ethAmount = ethers.parseEther("0.1") // 0.1 ETH ≈ 370 USD
        await fundMe.fund({value: ethAmount}) // 充值
        await time.increase(LOCK_TIME + 1) // 超过锁定期
        await mine()

        await expect(fundMeSecondAccount.getFund()).to.be.revertedWith("Not owner.....")
    })

    it("测试owner可转移所有权", async function () {
        await fundMe.transferOwnership(secondAccount)
        const newOwner = await fundMe.owner()
        assert.equal(newOwner, secondAccount, "Owner should be updated to secondAccount")
    })

    it("测试非owner不可转移所有权", async function () {

        await expect(fundMeSecondAccount.transferOwnership(secondAccount)).to.be.revertedWith("Not owner.....")
    })

    it("测试owner可设置erc20Address", async function () {
        const newErc20Address = secondAccount // 模拟 ERC20 地址
        await fundMe.setErc20Address(newErc20Address)
        const erc20Address = await fundMe.erc20Address()
        assert.equal(erc20Address, newErc20Address, "erc20Address should be updated")
    })

    it("测试非owner不可设置erc20Address", async function () {

        await expect(fundMeSecondAccount.setErc20Address(secondAccount)).to.be.revertedWith("Not owner.....")
    })

    it("测试erc20Address可更新投资金额", async function () {
        await fundMe.setErc20Address(secondAccount) // 设置 secondAccount 为 erc20Address
        const fundMeWithErc20 = fundMe.connect(await ethers.getSigner(secondAccount))
        const newAmount = ethers.parseEther("2")
        await fundMeWithErc20.setFunderToAmount(firstAccount, newAmount)
        const fundedAmount = await fundMe.addressToAmountFunded(firstAccount)
        assert.equal(fundedAmount.toString(), newAmount.toString(), "Funded amount should be updated")
    })

    it("测试非erc20Address不可更新投资金额", async function () {

        await expect(fundMeSecondAccount.setFunderToAmount(firstAccount, ethers.parseEther("2"))).to.be.revertedWith("You don't have permission")
    })

    it("测试owner可通过withdraw提款", async function () {
        const ethAmount = ethers.parseEther("0.1")

        await fundMe.fund({value: ethAmount})
        const fundMeDeploy = await deployments.get("FundMe")

        const initialBalance = await ethers.provider.getBalance(firstAccount)
        const tx = await fundMe.withdraw() // 默认 deployer 是 owner
        const receipt = await tx.wait()

        const gasPrice = receipt.effectiveGasPrice ?? tx.gasPrice ?? ethers.parseUnits("1", "gwei")
        const gasUsed = receipt.gasUsed
        // @ts-ignore
        const gasCost: bigint = gasUsed * gasPrice

        const finalBalance = await ethers.provider.getBalance(firstAccount)
        const contractBalance = await ethers.provider.getBalance(fundMeDeploy.address)

        assert.equal(contractBalance.toString(), "0", "Contract balance should be 0")
        assert(
            finalBalance >= initialBalance + ethAmount - gasCost,
            "Balance should increase by contract balance"
        )
    })

    it("测试非owner不可通过withdraw提款", async function () {
        const ethAmount = ethers.parseEther("0.1") // 0.1 ETH
        await fundMe.fund({value: ethAmount}) // 充值

        await expect(fundMeSecondAccount.withdraw()).to.be.revertedWith("Not owner.....")
    })
})