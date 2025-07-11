import express from 'express';
import { TaskController } from '../controller/taskController';

const router = express.Router();

const validateTaskInput = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void => {
    const { tasklines, description, time } = req.body;

    if (!tasklines || !Array.isArray(tasklines) || tasklines.length === 0) {
        res.status(400).json({ 
            success: false,
            error: 'Tasklines must be a non-empty array' 
        });
        return;
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        res.status(400).json({ 
            success: false,
            error: 'Description is required and must be a valid string' 
        });
        return;
    }

    if (!time || isNaN(new Date(time).getTime())) {
        res.status(400).json({ error: 'Valid time is required' });
        return;
    }

    next();
};

router.post('/task', validateTaskInput, (req, res) => TaskController.createTask(req, res));
router.get('/task/:id', (req, res) => TaskController.getTask(req, res));
router.put('/task/:id', validateTaskInput, (req, res) => TaskController.updateTask(req, res));
router.delete('/task/:id', (req, res) => TaskController.deleteTask(req, res));

export const taskRouter = router;