use candid::CandidType;
use ic_cdk::{query, storage, update};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

#[derive(Serialize, Deserialize, CandidType, Clone)]
struct CounterState {
    count: i32,
}

thread_local! {
    static COUNTER: RefCell<CounterState> = RefCell::new(CounterState { count: 0 });
}

#[init]
fn init() {
    COUNTER.with(|counter| {
        *counter.borrow_mut() = CounterState { count: 0 };
    });
}

#[pre_upgrade]
fn pre_upgrade() {
    COUNTER.with(|counter| {
        let counter_state = counter.borrow().clone(); // Clone the inner CounterState
        storage::stable_save((counter_state,))
            .expect("Failed to save counter state to stable memory");
    });
}

#[post_upgrade]
fn post_upgrade() {
    let (counter_state,): (CounterState,) =
        storage::stable_restore().expect("Failed to restore counter state from stable memory");
    COUNTER.with(|counter| {
        *counter.borrow_mut() = counter_state;
    });
}

#[update]
fn increment() -> i32 {
    COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        counter.count += 1;
        counter.count
    })
}

#[update]
fn decrement() -> i32 {
    COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        counter.count -= 1;
        counter.count
    })
}

#[query]
fn get() -> i32 {
    COUNTER.with(|counter| counter.borrow().count)
}
