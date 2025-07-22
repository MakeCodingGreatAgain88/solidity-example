import { ethers, deployments, getNamedAccounts, network } from "hardhat"
import { expect } from "chai"
import { LOCK_TIME, DEVELOPMENT_CHAINS } from "../../config/helper-hardhat-config"

!DEVELOPMENT_CHAINS.includes(network.name) ?
    // 通过真实chainLink, 集成测试链上行为
    describe("FundMe", async function () {
        let fundMe: any
        let firstAccount: string

        beforeEach(async function () {
            await deployments.fixture([ "all" ])
            firstAccount = (await getNamedAccounts()).deployerAccount
            const fundMeDeploy = await deployments.get("FundMe")
            fundMe = await ethers.getContractAt("FundMe", fundMeDeploy.address)
        })

        it("测试fund成功，并且getFund返回正确", async function () {
            const ethAmount = ethers.parseEther("0.5") // 0.01 ETH ≈ 37 USD < 100 USD
            await fundMe.fund({value: ethAmount}) // 充值
            await new Promise(resolve => setTimeout(resolve, (LOCK_TIME + 1) * 1000)) // 超过锁定期
            const getFundTx = await fundMe.getFund()
            const getFundReceipt = await getFundTx.wait(1)
            await expect(getFundReceipt).to.emit(fundMe, "fundWithdrawalByOwner").withArgs(ethAmount, firstAccount)
        })

        it("测试fund成功, 并且refund返回正确", async function () {
            const ethAmount = ethers.parseEther("0.01") // 0.01 ETH ≈ 37 USD < 100 USD
            await fundMe.fund({value: ethAmount}) // 充值
            await new Promise(resolve => setTimeout(resolve, (LOCK_TIME + 1) * 1000)) // 超过锁定期
            const getFundTx = await fundMe.refundMyFunds()
            const getFundReceipt = await getFundTx.wait(1)
            await expect(getFundReceipt).to.emit(fundMe, "refundWithdrawalByFunder").withArgs(ethAmount, firstAccount)
        })
    }) :
    describe.skip