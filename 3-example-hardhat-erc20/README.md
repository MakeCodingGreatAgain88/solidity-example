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

## 项目配置

### 1. env-enc 加密环境变量
#### 🧾 文档地址：[https://www.npmjs.com/package/@chainlink/env-enc](https://www.npmjs.com/package/@chainlink/env-enc)

#### 🎯 RPC接口资源: [https://www.alchemy.com](https://www.alchemy.com)， [https://www.infura.io](https://www.infura.io)， [https://quicknode.com](https://quicknode.com)

⚠️ **Tips1**: 首次运行项目根据以下步骤，设置密码，设置环境变量。设置完成根目录生成`.env-enc`文件，代表成功。环境变量名称参考根目录的`hardhat.config`文件所使用名称。

⚠️ **Tips2**: 部署合约之前需要在同一个终端窗口中先运行```npx env-enc set-pw```密码进行解密，解密成功后再运行```hardhat run scripts/deployFundMe.ts --network sepolia```部署合约，**两个命令必须在同一个终端窗口中**，因为解密后的环境变量存在于进程当中，不同的终端窗口属于不同的进程，无法共享环境变量

**step1. 设置密码**
```shell
npx env-enc set-pw
```
**step2. 设置环境变量**
```shell
npx env-enc set
```
**step3. 编译合约**
```shell
npx hardhat compile
```

---

### 2. etherscan verify
#### 🧾 API创建地址：[https://etherscan.io/apidashboard](https://etherscan.io/apidashboard)
创建成功按照 env-enc 加密环境变量步骤进行变量设置


### 通过部署脚本使用hardhat进行FundMe合约部署，verify合约，验证FundMe合约部署，逻辑交互

```bash
npx hardhat run scripts/deployFundMe.ts --network sepolia
```

### 使用hardhat tasks进行FundMe合约部署，verify合约，验证FundMe合约部署，逻辑交互

```bash
npx hardhat deploy-fundme --locktime [locktime] --network sepolia
```
```bash
npx hardhat interact-fundme --address [fundme contract address] --network sepolia
```

### hardhat-deploy + mocha + chai 单元测试

```bash
npx hardhat test
```