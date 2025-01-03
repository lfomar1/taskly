import { PrismaClient } from "@prisma/client";
import express, { json } from "express";
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

//Make a new Task

app.post("/api/task", async (req, res) => {
  const body = req.body;

  const newTask = await prisma.task.create({
    data: { title: body.title, description: body.description },
  });

  res.json(newTask);
});

app.get("/api/tasks", async (req, res) => {
  res.send("Hello people");
});

app.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});
