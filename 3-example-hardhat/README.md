# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
---

### env-enc 加密环境变量
文档地址：[https://www.npmjs.com/package/@chainlink/env-enc](https://www.npmjs.com/package/@chainlink/env-enc)

Tips1: 首次运行项目根据以下步骤，设置密码，设置环境变量。环境变量名称参考根目录的`hardhat.config`文件所使用名称，RPC接口可以在: [alchemy](https://www.alchemy.com)， [infura](https://www.infura.io)，[QuickNode](https://quicknode.com) 获取

Tips2: 部署合约之前需要在同一个终端窗口中先运行```npx env-enc set-pw```密码进行解密，解密成功后再运行```hardhat run scripts/deployFundMe.ts --network sepolia```部署合约，**两个命令必须在同一个终端窗口中**，因为解密后的环境变量存在于进程当中，不同的终端窗口属于不同的进程，无法共享环境变量

**1.设置密码**
```shell
npx env-enc set-pw
```
**2.设置环境变量**
```shell
npx env-enc set
```