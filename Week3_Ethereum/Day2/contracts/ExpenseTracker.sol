// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ExpenseTracker {
    struct Expense {
        uint256 id;
        string category;
        uint256 amount;
        string description;
        uint256 date;
    }

    mapping(address => Expense[]) private userExpenses;
    mapping(address => uint256) private totalExpenses;

    event ExpenseAdded(address indexed user, uint256 id, uint256 amount, string category);
    event ExpenseDeleted(address indexed user, uint256 id);

    function addExpense(string memory _category, uint256 _amount, string memory _description, uint256 _date) public {
        uint256 id = userExpenses[msg.sender].length;
        userExpenses[msg.sender].push(Expense(id, _category, _amount, _description, _date));
        totalExpenses[msg.sender] += _amount;
        
        emit ExpenseAdded(msg.sender, id, _amount, _category);
    }

    function getExpenses() public view returns (Expense[] memory) {
        return userExpenses[msg.sender];
    }

    function getTotalExpense() public view returns (uint256) {
        return totalExpenses[msg.sender];
    }
}
