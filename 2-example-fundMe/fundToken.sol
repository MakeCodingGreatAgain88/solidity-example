// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract FundToken{
    // 通证名字
    string public tokenName;
    // 通证简称
    string public tokenSymbol;
    // 通证总量
    uint256 public totalSupply;
    // 通证持有者
    address public owner;
    // 通证持有者地址和余额
    mapping(address => uint256) public balances;

    constructor(string memory _tokenName, string memory _tokenSymbol){
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        owner = msg.sender;
    }

    // 获取通证
    function mint (uint256 _amount) public {
        require(msg.sender == owner, "Only owner can mint");
        totalSupply += _amount;
        balances[msg.sender] += _amount;
    }

    // 转移通证
    function transfer(address _to, uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Balance is not enough");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    // 查看某个用户的余额
    function balanceOf(address _owner) public view returns (uint256){
        return balances[_owner];
    }
}