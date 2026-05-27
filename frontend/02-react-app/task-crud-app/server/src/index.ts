import express from "express";
import { title } from "node:process";
const app = express();
const PORT = 5000;

app.use(express.json());

interface Task {
  id: number;
  title: string;
}

let tasks: Task[] = [
  { id: 1, title: " Learn ReactJS" },
  {
    id: 2,
    title: "Lean NodeJS",
  },
  {
    id: 3,
    title: "Lean TypeScript",
  },
  {
    id: 4,
    title: "Lean Tailwindcss",
  },
];

//GET

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

//CREATE

app.post("/tasks", (req, res) => {
  const newTask: Task = {
    id: Date.now(),
    title: req.body.title,
  };
  tasks.push(newTask);
  res.json(newTask);
});

//UPDATE

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id); //Lấy id từ URL
  const { title } = req.body; //Lấy title mới từ body

  tasks = tasks.map((t) => {
    if (t.id === id) {
      return {
        ...t,
        title,
      };
    }
    return t;
  });
  const updated = tasks.find((t) => t.id === id);
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.status(200).json({ message: "Task is created", updated });
});

//DELETE
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks = tasks.filter((t) => t.id !== id);

  res.status(200).json({
    message: "Task deleted",
    tasks,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running port: ${PORT}`);
});
