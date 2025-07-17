// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {FundMe} from "./fundMe.sol";

// 1. 让FundMe的参与者，基于mapping来领取相应数量的通证
// 2. 让FundMe的参与者，transfer通证
// 3. 在使用完成以后，需要burn通证

// 创建一个ERC20代币合约
contract FundTokenERC20 is ERC20 {
    FundMe fundMe;
    constructor(address fundmeAddress) ERC20("FundTokenERC20", "ZC") {
        fundMe = FundMe(fundmeAddress);
    }

    // 铸造通证
    function mint(uint256 amountToMint) public {
        uint256 funderAmount = fundMe.addressToAmountFunded(msg.sender);

        // 是否众筹完成
        require(fundMe.getFundSuccess(), "the fundme is not success");

        // 铸造数量不能超过资助的金额
        require(funderAmount >= amountToMint, "You cannot mint more than what you have funded");
        // 调用ERC20 mint 铸造
        _mint(msg.sender, amountToMint);
        fundMe.setFunderToAmount(msg.sender, funderAmount - amountToMint);
    }

    // 兑换
    function claim(uint256 amountToClaim) public {
        require(balanceOf(msg.sender) >= amountToClaim, "You don't have enough balance");
        // 调用ERC20 burn 燃烧
        _burn(msg.sender, amountToClaim);
    }
}