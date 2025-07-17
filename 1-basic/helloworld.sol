// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

/* 函数可见性修饰符（Visibility）
public      任何人都可以调用（包括合约外和合约内）
external    只能从合约外部调用（this.func()、用户/合约外部交互）
internal    只能从合约内部或继承的合约中调用（默认）
private     仅当前合约内部可调用（继承合约不可访问）
*/

/* 函数修饰符（Function Mutability）
pure    不读取、不修改状态变量
view    只读取状态变量，不修改
没有修饰符  可读可写状态
payable 可收取以太并读写状态
*/

/*
1. storage 永久性存储，触非被改变，否则任何时候访问都是同一个数据，简单数据类型如byte32，init。合约里面的变量默认storage，不要显示的声明，函数里面默认memory。注意string不是简单数据结构，而是复杂数据结构，其实是array，需要显示的告诉编译器是memory还是calldata
2. memory 临时变量，一般用在函数入参数，代表可以修改
3. calldata 临时常量，一般用在函数入参数，代表不可修改
4. stack
5. codes
6. logs
*/

/*
1. struct 结构图类似interface
2. array 数组
3. mapping 对象结构
*/

/*
方法          Gas 限制          返回值                 错误处理                    推荐使用
transfer     固定 2300         无返回值               自动回滚异常                  ❌ 旧方法，不再推荐
send         固定 2300         无返回值               不会自动回滚，需要手动判断      ❌ 更不安全，不推荐
call         自定义 Gas        (bool, data) 返回      最灵活，推荐搭配 require      ✅ 推荐使用（现代标准）
*/

contract HelloWorld {
    // struct声明结构体
    struct Info {
        string phrase;
        uint256 id;
        address owner;
    }

    string strVal = 'hello world';

    Info[] infos;
    mapping(uint256 id => Info info) infoMapping;

    function setHello(string memory newStr, uint256 _id) public {
        // 这里仅仅作为演示数组，对象的用法
        Info memory info = Info(newStr, _id, msg.sender);
        infos.push(info);

        // mapping 实现
        infoMapping[_id] = info;
    }

    function sayHello(uint256 _ud) public view returns (string memory){
        // uint256 l = infos.length;
        // for(uint256 i = 0; i < l; i++){
        //     if(infos[i].id == _ud){
        //         return addinfo(infos[i].phrase);
        //     }
        // }

        // return addinfo(strVal);

        // mapping 实现
        string memory phrase = infoMapping[_ud].owner == address(0) ? strVal : infoMapping[_ud].phrase;
        return addinfo(phrase);
    }

    function addinfo(string memory newInfo) internal pure returns (string memory){
        return string.concat(newInfo, ' is added');
    }


    // 1️⃣ transfer (推荐 ❌ 不推荐)
    function transferTo(address payable to) external payable {
        to.transfer(msg.value);
    }

    // 2️⃣ send (更不推荐)
    function sendTo(address payable to) external payable {
        bool sent = to.send(msg.value);
        require(sent, "Send failed");
    }

    // 3️⃣ call (推荐 ✅ 推荐)
    function callTo(address payable to) external payable {
        (bool success, ) = to.call{value: msg.value}("");
        require(success, "Call failed");
    }
}

abstract contract Parent {
    uint256 public a = 1;

    function addOne() public {
        a = a + 1;
    }

    // 标识了virtual为虚函数，必须使用abstract进行修饰，abstract代表为抽象合约。
    function addTwo() public virtual {
        a = a + 2;
    }

    // 标识了virtual为虚函数, 但是没有函数体，子类必须重写虚函数，否则会报错
    function addThree() public virtual;
}

contract Child is Parent {
    // 如果继承了抽象合约，子类不想变成抽象合约，必须重写父类所有的虚函数
    // 重写虚函数，必须使用override
    function addTwo() public override {
        a = a + 2;
    }

    function addThree() public override {
        a = a + 3;
    }

    function addFour() public {
        a = a + 4;
    }
}