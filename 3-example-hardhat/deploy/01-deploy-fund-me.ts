const deployFundMe = async ({getNamedAccounts, deployments}) => {
    const {deployerAccount} = await getNamedAccounts()
    await deployments.deploy("FundMe", {
        from: deployerAccount,
        args: [ 180 ],
        log: true,
        waitConfirmations: 1
    })
}

deployFundMe.tags = [ "all", "fundme" ]

export default deployFundMe