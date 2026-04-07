import { Router } from "express";

import Task from "../models/Task.js";

const router = Router();

router.get("/", async (_request, response, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    response.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const task = await Task.findById(request.params.id);

    if (!task) {
      response.status(404).json({ message: "Task not found." });
      return;
    }

    response.json(task);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const task = await Task.create(request.body);
    response.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (request, response, next) => {
  try {
    const task = await Task.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      response.status(404).json({ message: "Task not found." });
      return;
    }

    response.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const task = await Task.findByIdAndDelete(request.params.id);

    if (!task) {
      response.status(404).json({ message: "Task not found." });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
