import { todo_app_backend } from "../../declarations/todo_app_backend";

document.getElementById("add-todo").onclick = async () => {
    const title = document.getElementById("todo-title").value;
    await todo_app_backend.add_todo(title);
    await fetchTodos();
};

async function fetchTodos() {
    const todos = await todo_app_backend.get_todos();
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.title;
        if (todo.completed) {
            li.style.textDecoration = "line-through";
        }
        li.onclick = async () => {
            await todo_app_backend.toggle_todo(todo.id);
            await fetchTodos();
        };
        todoList.appendChild(li);
    });
}

document.getElementById("delete-todos").onclick = async () => {
    const todos = await todo_app_backend.get_todos();
    for (const todo of todos) {
        await todo_app_backend.delete_todo(todo.id);
    }
    await fetchTodos();
};

fetchTodos();