import { Request, Response } from 'express';
import { RoutineService } from '../services/routine.sevice';
import { RoutineInput } from '../models/routine';

export class RoutineController {
    static async createRoutine(req: Request, res: Response): Promise<void> {
    try {
        const { rootTraining, description, tasks, childId, parentId }: RoutineInput = req.body;
        if (!rootTraining || !description || !tasks || !childId || !parentId) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const newRoutine = await RoutineService.createRoutine({
        rootTraining,
        description,
        tasks,
        childId,
        parentId
    });

    res.status(201).json({
        success: true,
        data: newRoutine,
        message: 'Routine created successfully'
    });
    } catch (error) {
        res.status(500).json({
        success: false,
        error: 'Failed to create routine',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

static async getRoutine(req: Request, res: Response): Promise<void> {
    try {
        const routineId = req.params.id;
        const routine = await RoutineService.getRoutineById(routineId);

    if (!routine) {
        res.status(404).json({ 
        success: false,
        error: 'Routine not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: routine
    });
    } catch (error) {
        res.status(500).json({ 
        success: false,
        error: 'Failed to get routine',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

static async getChildRoutines(req: Request, res: Response): Promise<void> {
    try {
        const childId = req.params.childId;
        const routines = await RoutineService.getRoutinesByChildId(childId);

    res.status(200).json({
        success: true,
        data: routines,
        count: routines.length
    });
    } catch (error) {
        res.status(500).json({ 
        success: false,
        error: 'Failed to get routines',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

static async updateRoutine(req: Request, res: Response): Promise<void> {
    try {
        const routineId = req.params.id;
        const updateData = req.body;
        const updatedRoutine = await RoutineService.updateRoutine(routineId, updateData);

    if (!updatedRoutine) {
        res.status(404).json({ 
        success: false,
        error: 'Routine not found'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: updatedRoutine,
        message: 'Routine updated successfully'
    });
    } catch (error) {
        res.status(500).json({ 
        success: false,
        error: 'Failed to update routine',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

static async deleteRoutine(req: Request, res: Response): Promise<void> {
    try {
        const routineId = req.params.id;
        const result = await RoutineService.deleteRoutine(routineId);

    res.status(200).json({
        success: true,
        data: result,
        message: 'Routine deleted successfully'
    });
    } catch (error) {
        res.status(500).json({ 
        success: false,
        error: 'Failed to delete routine',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}
}