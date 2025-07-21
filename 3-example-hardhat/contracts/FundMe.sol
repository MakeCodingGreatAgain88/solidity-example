// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/** 众筹合约
 * 1，收款函数
 * 2，记录投资人，记录投资金额，记录投资时间
 * 3，在锁定期内达到筹款目标，生产商可以提款
 * 4，在锁定期内没有达到筹款目标，可以解锁，投资人在锁定期后可以退款
 */

contract FundMe {
    AggregatorV3Interface public dataFeed;

    // 众筹列表
    mapping(address => uint256) public addressToAmountFunded;

    // 最小入金10usd
    uint256 public constant MINIMUN_VALUE = 10 * 10 ** 18;

    // 筹款目标金额100usd
    uint256 constant TARGET = 100 * 10 ** 18;

    // 合约部署人
    address public owner;

    // 部署时间 锁定期开始时间
    uint256 public deployTimestamp;

    // 锁定时间
    uint256 public lockTime;

    // 铸造通证地址
    address public erc20Address;

    // 众筹成功
    bool public getFundSuccess = false;

    constructor(uint256 _lockTime, address _dataFeedAddress) {
        // sepolia testnet
        dataFeed = AggregatorV3Interface(_dataFeedAddress);
        // 合约部署人
        owner = msg.sender;
        // 记录锁定期开始时间
        deployTimestamp = block.timestamp;
        // 设置锁定期
        lockTime = _lockTime;
    }

    // 如果合约需要收取区块链的原生token，就需要使用payable
    function fund() external payable {
        // 判断是否小于最小众筹金额
        require(conversionEthToUsd(msg.value) >= MINIMUN_VALUE, "send more ETH");
        // 众筹时间必须小于锁定时间
        require(block.timestamp < deployTimestamp + lockTime, "lock time is over");

        // 记录投资人信息
        addressToAmountFunded[msg.sender] += msg.value;
    }

    /**
    * 获取eth对于usd价格
    */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
        /* uint80 roundId */,
            int256 answer,
        /*uint256 startedAt*/,
        /*uint256 updatedAt*/,
        /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    // 币对汇率转换
    function conversionEthToUsd(uint256 ethAmount) public view returns (uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    // 用户退款
    function refundMyFunds() external windowClose {
        uint256 fundedAmount = addressToAmountFunded[msg.sender];
        // 众筹总金额小于目标金额
        require(conversionEthToUsd(address(this).balance) < TARGET, "Target is reached");
        // 用户必须有过投资支持
        require(fundedAmount != 0, "No funds to refund");

        // 退回投资金额
        (bool success,) = payable(msg.sender).call{value: fundedAmount}("");
        require(success, "transfer tx failed");

        // 清空记录，防止重入攻击或重复提款
        addressToAmountFunded[msg.sender] = 0;
    }

    // 余额提款
    function getFund() external onlyOwner windowClose {
        // 众筹金额必须大于目标金额
        require(conversionEthToUsd(address(this).balance) >= TARGET, "Target is not reached");

        // 提款
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "transfer tx failed");

        // 清空记录，防止重入攻击或重复提款
        addressToAmountFunded[msg.sender] = 0;

        getFundSuccess = true;
    }

    // 转移所有权
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    // ⚠️ 任何用户提款全部余额 仅测试使用
    function withdraw() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    // 修改众筹者资助金额（用于铸造合约，铸造通证成功后调用）
    function setFunderToAmount(address funder, uint256 amountUpdate) external {
        require(msg.sender == erc20Address, "You don't have permission");
        addressToAmountFunded[funder] = amountUpdate;
    }

    // 更新 erc20Address 铸造合约部署后更新为铸造合约地址
    function setErc20Address(address newErc20Address) external onlyOwner {
        erc20Address = newErc20Address;
    }

    modifier windowClose(){
        // 提款时间必须大于众筹锁定时间
        require(block.timestamp > deployTimestamp + lockTime, "lock time is not over");
        // _代表执行的函数逻辑，可以放在require之前或之后，之前为函数执行之前先执行modifier，之后则先执行modifier
        _;
    }

    modifier onlyOwner(){
        // 必须是众筹合约发起人
        require(msg.sender == owner, "Not owner.....");
        _;
    }
}