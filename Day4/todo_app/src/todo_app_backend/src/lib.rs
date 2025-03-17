use candid::CandidType;
use ic_cdk::{query, update};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct Todo {
    id: u64,
    title: String,
    completed: bool,
}

thread_local! {
    static TODOS: RefCell<HashMap<u64, Todo>> = RefCell::new(HashMap::new());
    static NEXT_ID: RefCell<u64> = RefCell::new(0);
}

#[update]
fn add_todo(title: String) -> u64 {
    let id = NEXT_ID.with(|next_id| {
        let id = *next_id.borrow();
        *next_id.borrow_mut() += 1;
        id
    });

    let todo = Todo {
        id,
        title,
        completed: false,
    };

    TODOS.with(|todos| {
        todos.borrow_mut().insert(id, todo);
    });

    id
}

#[query]
fn get_todos() -> Vec<Todo> {
    TODOS.with(|todos| todos.borrow().values().cloned().collect())
}

#[update]
fn toggle_todo(id: u64) -> bool {
    TODOS.with(|todos| {
        if let Some(todo) = todos.borrow_mut().get_mut(&id) {
            todo.completed = !todo.completed;
            true
        } else {
            false
        }
    })
}

#[update]
fn delete_todo(id: u64) -> bool {
    TODOS.with(|todos| todos.borrow_mut().remove(&id).is_some())
}
