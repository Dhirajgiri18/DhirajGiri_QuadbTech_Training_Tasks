use candid::{CandidType, Deserialize};
use ic_cdk::{query, storage, update};
use serde::Serialize;
use std::cell::RefCell;

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct TodoItem {
    id: u64,
    title: String,
    completed: bool,
}

thread_local! {
    static TODOS: RefCell<Vec<TodoItem>> = RefCell::new(Vec::new());
    static NEXT_ID: RefCell<u64> = RefCell::new(0);
}

#[update]
fn add_todo(title: String) -> u64 {
    TODOS.with(|todos| {
        let id = NEXT_ID.with(|next_id| {
            let id = *next_id.borrow();
            *next_id.borrow_mut() += 1;
            id
        });
        todos.borrow_mut().push(TodoItem {
            id,
            title,
            completed: false,
        });
        id
    })
}

// Toggle the completion status of a To-Do item
#[update]
fn toggle_todo(id: u64) -> bool {
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        if let Some(todo) = todos.iter_mut().find(|t| t.id == id) {
            todo.completed = !todo.completed;
            true
        } else {
            false
        }
    })
}

// Get all To-Do items
#[query]
fn get_todos() -> Vec<TodoItem> {
    TODOS.with(|todos| todos.borrow().clone())
}

// Delete a To-Do item
#[update]
fn delete_todo(id: u64) -> bool {
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        let len_before = todos.len();
        todos.retain(|t| t.id != id);
        todos.len() != len_before
    })
}
