use candid::CandidType;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize}; // ✅ Import CandidType

// Structure to store transaction details
#[derive(Clone, Serialize, Deserialize, CandidType)] // ✅ Fix: Added CandidType
struct Transaction {
    id: u64,
    gas_fee: f64,
}

// Storage for transactions
static mut TRANSACTIONS: Option<Vec<Transaction>> = None;

// Initialize storage
fn get_transactions() -> &'static mut Vec<Transaction> {
    unsafe {
        if TRANSACTIONS.is_none() {
            TRANSACTIONS = Some(Vec::new());
        }
        TRANSACTIONS.as_mut().unwrap()
    }
}

// Add a new transaction
#[update]
fn add_transaction(gas_fee: f64) -> u64 {
    let transactions = get_transactions();
    let id = transactions.len() as u64 + 1;
    transactions.push(Transaction { id, gas_fee });
    id
}

// Get all transactions
#[query]
fn get_all_transactions() -> Vec<Transaction> {
    get_transactions().clone()
}
