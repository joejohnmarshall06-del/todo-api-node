const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

let todos = [
  { id: 1, title: "Create first GitHub project", completed: true },
  { id: 2, title: "Add API documentation", completed: false }
];

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ name: "Todo API", endpoints: ["/todos"] });
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const title = String(req.body.title || "").trim();

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  const todo = {
    id: Date.now(),
    title,
    completed: false
  };

  todos.push(todo);
  return res.status(201).json(todo);
});

app.patch("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found." });
  }

  if (typeof req.body.title === "string") {
    todo.title = req.body.title.trim() || todo.title;
  }

  if (typeof req.body.completed === "boolean") {
    todo.completed = req.body.completed;
  }

  return res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const originalLength = todos.length;
  todos = todos.filter((item) => item.id !== id);

  if (todos.length === originalLength) {
    return res.status(404).json({ error: "Todo not found." });
  }

  return res.status(204).send();
});

app.listen(port, () => {
  console.log(`Todo API listening on http://localhost:${port}`);
});

