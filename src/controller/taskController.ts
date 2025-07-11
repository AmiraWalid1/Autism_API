import { Request, Response } from 'express';
import { TaskService } from '../services/taskServices';
import { TaskInput } from '../models/task';

export class TaskController {
static async createTask(req: Request, res: Response): Promise<void> {
    try {
        const { tasklines, description, time, status }: TaskInput = req.body;
      // التحقق من البيانات المطلوبة
    if (!tasklines || !description || !time) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

      // التحقق من صحة التاريخ
    if (isNaN(new Date(time).getTime())) {
        res.status(400).json({ error: 'Invalid time format' });
        return;
    }

const newTask = await TaskService.createTask({
        tasklines,
        description,
        time: new Date(time),
        status: status || 'pending' // تعيين قيمة افتراضية
});

    res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
    });
    } catch (error) {
        res.status(500).json({
        success: false,
        error: 'Failed to create task',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

  static async getTask(req: Request, res: Response): Promise<void> {
    try {
        const taskId = req.params.id;
        const task = await TaskService.getTaskById(taskId);

if (!task) {
        res.status(404).json({ 
        success: false,
        error: 'Task not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: task
    });
    } catch (error) {
        res.status(500).json({ 
        success: false,
        error: 'Failed to get task',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

static async updateTask(req: Request, res: Response): Promise<void> {
    try {
        const taskId = req.params.id;
        const { tasklines, description, time, status } = req.body;

      // التحقق من صحة التاريخ إذا تم إرساله
    if (time && isNaN(new Date(time).getTime())) {
        res.status(400).json({ error: 'Invalid time format' });
        return;
    }

    const updatedTask = await TaskService.updateTask(taskId, {
        tasklines,
        description,
        time: time ? new Date(time) : undefined,
        status
    });

    if (!updatedTask) {
        res.status(404).json({ 
        success: false,
        error: 'Task not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
    });
    } catch (error) {
        res.status(500).json({ 
        success: false,
        error: 'Failed to update task',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
        const taskId = req.params.id;
        const result = await TaskService.deleteTask(taskId);

    res.status(200).json({
        success: true,
        data: result,
        message: 'Task deleted successfully'
    });
    } catch (error) {
        res.status(500).json({ 
        success: false,
        error: 'Failed to delete task',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}
}