const {ethers} = require("hardhat");

async function main() {
    // crate factory
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("contract deploying...");

    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(60);
    await fundMe.waitForDeployment();
    console.log(`contract has been deployed successfully, contract address is: ${fundMe.target}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });