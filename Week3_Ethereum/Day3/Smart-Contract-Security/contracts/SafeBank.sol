// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeBank is ReentrancyGuard {
    mapping(address => uint) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external nonReentrant {
    uint amount = balances[msg.sender];
    require(amount > 0, "Nothing to withdraw");

    // ✅ Set balance to zero before sending Ether (important!)
    balances[msg.sender] = 0;

    // ✅ Sending Ether
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to send Ether");
}


    function getBalance(address user) public view returns (uint) {
        return balances[user];
    }
}
