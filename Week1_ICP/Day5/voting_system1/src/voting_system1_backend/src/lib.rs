use candid::{CandidType, Deserialize, Nat};
use std::cell::RefCell;

#[derive(CandidType, Deserialize, Clone)]
struct Candidate {
    name: String,
    party: String,
    votes: u32,
}

thread_local! {
    static CANDIDATES: RefCell<Vec<Candidate>> = RefCell::new(vec![
        Candidate { name: "Virat Kohli".to_string(), party: "RCB".to_string(), votes: 0 },
        Candidate { name: "Rohit Sharma".to_string(), party: "MI".to_string(), votes: 0 },
        Candidate { name: "M S Dhoni".to_string(), party: "CSK".to_string(), votes: 0 },
    ]);
}

#[ic_cdk::update]
fn vote(candidate_index: u32) -> String {
    CANDIDATES.with(|candidates| {
        let mut candidates = candidates.borrow_mut();
        if let Some(candidate) = candidates.get_mut(candidate_index as usize) {
            candidate.votes += 1;
            return format!("You voted for: {} from {}", candidate.name, candidate.party);
        }
        "Invalid candidate".to_string()
    })
}

#[ic_cdk::query]
fn get_results() -> Vec<Candidate> {
    CANDIDATES.with(|candidates| candidates.borrow().clone())
}
