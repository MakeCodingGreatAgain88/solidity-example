// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

// 可以想像js中的import
// import "./helloworld.sol";
// import "在线地址";
// import "npm包名";
import {HelloWorld} from "./helloworld.sol";

// 工厂模式
contract HelloWorldFactory {
    HelloWorld hw;

    // 创建多个
    HelloWorld [] hws;

    // 创建合约
    function createHelloWorld() public {
        hw = new HelloWorld();
        hws.push(hw);
    }

    // 获取合约
    function getHelloWorld(uint256 _index) public view returns (HelloWorld) {
        return hws[_index];
    }

    // 获取sayHello
    function callSayHelloFormFactory(uint256 _index, uint256 _id) public view returns (string memory) {
        return hws[_index].sayHello(_id);
    }

    // 设置setHello
    function callSetHelloFormFactory(uint256 _index, uint256 _id, string memory _setHello) public {
        hws[_index].setHello(_setHello, _id);
    }
}