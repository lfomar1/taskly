import prisma from "./prisma/client";
import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 3000;

//Make a new Task
app.post("/api/task", async (req, res) => {
  const body = req.body;

  const newTask = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      dueTime: body.dueTime,
      userId: body.userId,
    },
  });

  res.json(newTask);
});

app.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});
