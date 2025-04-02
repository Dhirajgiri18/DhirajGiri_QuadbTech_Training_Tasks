// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GasFeeTracker {
    struct TransactionDetails {
        address sender;
        uint256 gasUsed;
        uint256 timestamp;
    }

    TransactionDetails[] private transactions;

    event TransactionRecorded(address indexed sender, uint256 gasUsed, uint256 timestamp);

    function recordTransaction() public returns (uint256) {
        uint256 gasStart = gasleft();
        
        transactions.push(TransactionDetails({
            sender: msg.sender,
            gasUsed: gasStart,
            timestamp: block.timestamp
        }));

        uint256 gasUsed = gasStart - gasleft();
        transactions[transactions.length - 1].gasUsed = gasUsed;

        emit TransactionRecorded(msg.sender, gasUsed, block.timestamp);
        
        return gasUsed; // Returning gas used for comparison
    }

    function getAllTransactions() public view returns (TransactionDetails[] memory) {
        return transactions;
    }
}
