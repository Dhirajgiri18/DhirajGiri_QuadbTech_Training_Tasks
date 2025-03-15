use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::{api, query};

#[derive(CandidType, Deserialize)]
pub struct HelloWorldResponse {
    pub message: String,
}

#[query]
fn greet() -> HelloWorldResponse {
    HelloWorldResponse {
        message: "Hello, World from Internet Computer!".to_string(),
    }
}
