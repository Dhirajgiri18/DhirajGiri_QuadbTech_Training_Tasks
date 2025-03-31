use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

#[derive(Serialize, Deserialize)]
struct Data {
    key: String,
    value: String,
}

thread_local! {
    static STORAGE: RefCell<Vec<Data>> = RefCell::new(Vec::new());
}

#[update]
fn store_data(key: String, value: String) {
    STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        storage.push(Data { key, value });
    });
}

#[query]
fn retrieve_data(key: String) -> Option<String> {
    STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .iter()
            .find(|data| data.key == key)
            .map(|data| data.value.clone())
    })
}
