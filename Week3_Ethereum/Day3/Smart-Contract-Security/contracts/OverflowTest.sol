// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract OverflowTest {
    uint8 public small = 255;

    function add() public {
        small += 1; // Reverts in Solidity >= 0.8.0
    }

    function subtract() public {
        small -= 2; // Underflow if below 0
    }
}
