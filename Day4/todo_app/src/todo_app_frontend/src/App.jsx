import { HttpAgent } from "@dfinity/agent";
import { useState } from "react";
import { idlFactory } from "../../.dfx/local/canisters/todo_app_backend/todo_app_backend.did.js";

const agent = new HttpAgent({ host: "http://localhost:8000" });
const canisterId = "ajuq4-ruaaa-aaaaa-qaaga-cai"; // Replace with your backend canister ID
const todoBackend = idlFactory.createActor(canisterId, { agent });

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [showTodos, setShowTodos] = useState(false);

  const fetchTodos = async () => {
    const todos = await todoBackend.get_todos();
    setTodos(todos);
  };

  const addTodo = async () => {
    await todoBackend.add_todo(newTodo);
    setNewTodo("");
    if (showTodos) {
      fetchTodos(); // Refresh the list if it's already shown
    }
  };

  const toggleTodo = async (id) => {
    await todoBackend.toggle_todo(id);
    if (showTodos) {
      fetchTodos(); // Refresh the list if it's already shown
    }
  };

  const deleteTodo = async (id) => {
    await todoBackend.delete_todo(id);
    if (showTodos) {
      fetchTodos(); // Refresh the list if it's already shown
    }
  };

  const handleShowTodos = async () => {
    if (!showTodos) {
      await fetchTodos(); // Fetch todos only when showing for the first time
    }
    setShowTodos(!showTodos); // Toggle the visibility of the to-do list
  };

  return (
    <div className="App">
      <h1>Web3 To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <button onClick={handleShowTodos}>
        {showTodos ? "Hide Todos" : "Show Todos"}
      </button>
      {showTodos && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.title}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;