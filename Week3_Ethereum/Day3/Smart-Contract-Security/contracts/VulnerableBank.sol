// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0; // Unsafe order
    }

    function getBalance(address user) public view returns (uint) {
    return balances[user];
}

}
