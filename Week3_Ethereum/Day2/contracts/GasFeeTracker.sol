// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GasFeeTracker {
    struct TransactionDetails {
        address sender;
        uint256 gasUsed;
        uint256 timestamp;
    }

    TransactionDetails[] private storageTransactions;
    TransactionDetails[] private memoryTransactions;

    event StorageTransactionRecorded(address indexed sender, uint256 gasUsed, uint256 timestamp);
    event MemoryTransactionRecorded(address indexed sender, uint256 gasUsed, uint256 timestamp);

    function recordStorageTransaction() public returns (uint256) {
        uint256 gasStart = gasleft();
        
        storageTransactions.push(TransactionDetails({
            sender: msg.sender,
            gasUsed: gasStart,
            timestamp: block.timestamp
        }));

        uint256 gasUsed = gasStart - gasleft();
        storageTransactions[storageTransactions.length - 1].gasUsed = gasUsed;

        emit StorageTransactionRecorded(msg.sender, gasUsed, block.timestamp);
        
        return gasUsed;
    }

    function recordMemoryTransaction() public returns (uint256) {
        uint256 gasStart = gasleft();

        TransactionDetails memory tempTransaction = TransactionDetails({
            sender: msg.sender,
            gasUsed: 0, // Temporary, updated after calculation
            timestamp: block.timestamp
        });

        uint256 gasUsed = gasStart - gasleft();
        tempTransaction.gasUsed = gasUsed;

        memoryTransactions.push(tempTransaction);

        emit MemoryTransactionRecorded(msg.sender, gasUsed, block.timestamp);

        return gasUsed;
    }

    function getStorageTransactions() public view returns (TransactionDetails[] memory) {
        return storageTransactions;
    }

    function getMemoryTransactions() public view returns (TransactionDetails[] memory) {
        return memoryTransactions;
    }
}
