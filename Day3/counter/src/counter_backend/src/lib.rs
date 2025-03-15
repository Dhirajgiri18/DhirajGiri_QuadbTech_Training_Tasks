use ic_cdk::api::{call, time};
use ic_cdk::export::Principal;
use ic_cdk::storage;

#[derive(Default)]
struct Counter {
    count: i32,
}

#[storage]
static mut COUNTER: Counter = Counter { count: 0 };

#[ic_cdk::update]
fn increment() -> i32 {
    unsafe {
        COUNTER.count += 1;
        COUNTER.count
    }
}

#[ic_cdk::update]
fn decrement() -> i32 {
    unsafe {
        COUNTER.count -= 1;
        COUNTER.count
    }
}

#[ic_cdk::query]
fn get() -> i32 {
    unsafe { COUNTER.count }
}
