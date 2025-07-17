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

### [env-enc](https://www.npmjs.com/package/@chainlink/env-enc)
加密环境变量

Tips: 部署合约之前需要先输入env-enc密码进行解密，并且后续部署合约命令必须在同一个终端窗口中，因为解密后的环境变量存在于进程当中，不同的终端窗口属于不同的进程，无法共享环境变量

**1.设置密码**
```shell
npx env-enc set-pw
```
**2.设置环境变量**
```shell
npx env-enc set
```