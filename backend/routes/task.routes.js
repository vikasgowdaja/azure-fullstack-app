import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { validateTask } from '../middleware/validation.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(validateTask, updateTask)
  .delete(deleteTask);

export default router;
