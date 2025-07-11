import express from 'express';
import { RoutineController } from '../controller/routine.controller';

const router = express.Router();

const validateRoutineInput = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void => {
    const { rootTraining, description, tasks, childId, parentId } = req.body;

if (!rootTraining || typeof rootTraining !== 'string') {
    res.status(400).json({ error: 'Valid rootTraining is required' });
    return;
}

if (!description || typeof description !== 'string') {
    res.status(400).json({ error: 'Valid description is required' });
    return;
}

if (!tasks || !Array.isArray(tasks)) {
    res.status(400).json({ error: 'Tasks must be an array' });
    return;
}

if (!childId || typeof childId !== 'string') {
    res.status(400).json({ error: 'Valid childId is required' });
    return;
}

if (!parentId || typeof parentId !== 'string') {
    res.status(400).json({ error: 'Valid parentId is required' });
    return;
}

next();
};

// POST /api/routine-
router.post('/api/routine', validateRoutineInput, (req, res) => RoutineController.createRoutine(req, res));

// GET /api/routine/:id   
router.get('/api/routine/:id', (req, res) => RoutineController.getRoutine(req, res));

// GET /api/routine/child/:childId 
router.get('/api/routine/child/:childId', (req, res) => RoutineController.getChildRoutines(req, res));

// PUT /api/routine/:id 
router.put('/api/routine/:id', validateRoutineInput, (req, res) => RoutineController.updateRoutine(req, res));

// DELETE /api/routine/:id 
router.delete('/api/routine/:id', (req, res) => RoutineController.deleteRoutine(req, res));

export const routineRouter = router;