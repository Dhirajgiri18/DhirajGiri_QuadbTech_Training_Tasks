// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleBank {
    mapping(address => uint256) private balances;
    address public owner;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    constructor(){
        owner= msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, " Deposit amount must be greater than 0 ");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(_amount > 0, " Withdrawal amount must be greater than 0");
        require(balances[msg.sender] >= _amount, " Insufficient Balance ");

        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdrawal(msg.sender, _amount);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}