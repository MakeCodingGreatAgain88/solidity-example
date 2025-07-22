# 🚀 Solidity Examples | Solidity 示例项目集

### 🎯 本示例是学习B站视频[《Chainlink预言机：7小时最全Web3教程：ERC20，NFT，Hardhat，CCIP跨链》](https://www.bilibili.com/video/BV1RFsfe5Ek5?spm_id_from=333.788.videopod.episodes&vd_source=2898901877132a545a58a989514a76ee)的实践
**感谢frank老师的教学，非常棒  🫶**

----

这是一个包含多个 **Solidity 合约开发示例** 的项目集合，适合学习和实践智能合约开发。每个示例目录包含对应的 Solidity 合约文件及相关文档说明。

---

## 📁 示例目录结构

```text
.
├── 1-example-helloWorld/         // 示例：HelloWorld 智能合约（占位）
├── 2-example-fundMe/             // ✅ 当前实现的众筹 + ERC20 示例合约
│   ├── FundMe.sol                // 众筹合约
│   └── FundTokenERC20.sol       // 通证合约
├── 3-example-hardhat-erc20            // ✅ Hardhat 的示例
└── README.md                     // 项目说明文档

```
## 🧩 1-example-helloWorld
基础语法demo


## 🧩 2-example-fundMe：

1. **FundMe**：基于 ETH 的众筹合约
2. **FundTokenERC20**：根据资助金额铸造和燃烧 ERC20 代币的通证合约

---

### 📦 合约部署地址（Sepolia Testnet）

- 🧾 众筹合约 FundMe: [0x94DFc2B2802B30a2bCdCB3624d1735b573636ce3](https://sepolia.etherscan.io/address/0x94DFc2B2802B30a2bCdCB3624d1735b573636ce3)
- 🪙 通证合约 FundTokenERC20: [0xe950980260f2F1FAf170E6865FF8775883118cEF](https://sepolia.etherscan.io/address/0xe950980260f2F1FAf170E6865FF8775883118cEF)

---

### 🧾 FundMe 合约简介

这是一个带有锁定期的众筹合约，支持以 ETH 众筹，使用 Chainlink 预言机实时换算为 USD。

### ✨ 功能特色：

- ✅ 接收 ETH 捐款，自动换算为 USD 估值
- ✅ 要求最小入金：10 USD
- ✅ 筹款目标：1000 USD
- ✅ 设置锁定期，众筹结束后才能操作资金
- ✅ 众筹失败可退款，成功后合约拥有者可提款
- ✅ 为每位参与者记录捐款金额
- ✅ 支持与通证合约联动更新捐款状态

### ⛓️ 重要方法：

| 函数 | 说明 |
|------|------|
| `fund()` | 向合约发送 ETH 并记录支持金额 |
| `getFund()` | 众筹成功后，所有者提取全部 ETH |
| `refundMyFunds()` | 众筹失败后，用户申请退款 |
| `setErc20Address(address)` | 设置 ERC20 合约地址，用于授权 mint |
| `setFunderToAmount(address, uint256)` | ERC20 调用，更新用户的资助余额 |

---

### 🪙 FundTokenERC20 通证合约

该合约为一个标准的 ERC20 代币，用于根据用户在 FundMe 合约中的支持金额进行铸造。

### ✨ 功能特色：

- ✅ ERC20 标准接口，支持余额、转账、授权等操作
- ✅ 用户可根据众筹支持额度铸造等值通证
- ✅ 通证可被燃烧（兑换/销毁）
- ✅ 铸造前需确保众筹成功

### ⛓️ 重要方法：

| 函数 | 说明 |
|------|------|
| `mint(uint256)` | 铸造对应支持金额的通证 |
| `claim(uint256)` | 燃烧通证（销毁） |

---

## 🔄 合约交互流程图

```text
User        ──> FundMe.fund() ───> 记录捐款
                           ↓
                      [锁定期结束]
                           ↓
        众筹成功              |           众筹失败
        FundMe.getFund()     |       FundMe.refundMyFunds()
             ↓               |               ↓
     设置 getFundSuccess = true     退回用户 ETH
                           ↓
           用户调用 ERC20.mint()
                  ↓
         根据捐款金额铸造代币
```

## 🧩 3-example-hardhat-erc20
#### 1，通过部署脚本使用hardhat进行FundMe合约部署，verify合约，验证FundMe合约部署，逻辑交互

```bash
npx hardhat run scripts/deployFundMe.ts --network sepolia
```

#### 2，使用hardhat tasks进行FundMe合约部署，verify合约，验证FundMe合约部署，逻辑交互

```bash
npx hardhat deploy-fundme --locktime [locktime] --network sepolia
```
```bash
npx hardhat interact-fundme --address [fundme contract address] --network sepolia
```

#### 3，hardhat-deploy + mocha + chai 单元测试

```bash
npx hardhat test
```
