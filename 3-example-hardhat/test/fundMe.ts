import { ethers, deployments,getNamedAccounts } from "hardhat"
import { assert } from "chai"

describe("FundMe", async function () {
    let fundMe
    let firstAccount
    before(async function () {
        await deployments.fixture([ "all" ])
        const fundMeAddress = await deployments.get("FundMe")
        firstAccount = (await getNamedAccounts()).deployerAccount
        fundMe = await ethers.getContractAt("FundMe", fundMeAddress.address)
    })

    it("测试owner是否为合约创建者", async function () {
        await fundMe.waitForDeployment()
        const owner = await fundMe.owner()
        assert.equal(owner, firstAccount)
    })

    it("测试datafeed是否为指定值", async function () {
        await fundMe.waitForDeployment()
        const dataFeed = await fundMe.dataFeed()
        assert.equal(dataFeed, "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })
})