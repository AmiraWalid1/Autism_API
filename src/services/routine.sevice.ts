import { RoutineModel, RoutineInput, IRoutine } from '../models/routine';
import { TaskModel } from '../models/task';

export class RoutineService {
    static async createRoutine(routineData: RoutineInput): Promise<IRoutine> {
    // تحويل IDs إلى ObjectId
    const tasks = await TaskModel.find({ _id: { $in: routineData.tasks } });
    
    const routine = new RoutineModel({...routineData,tasks: tasks.map(task => task._id)});
    
    const savedRoutine = await routine.save();
    
    // إرسال إشعار للأب (يمكن تنفيذه لاحقًا)
    // notifyParent(routineData.parentId, 'Routine created');
    
    return savedRoutine;
}

static async getRoutineById(id: string): Promise<IRoutine | null> {
    return await RoutineModel.findById(id).populate('tasks');
}

static async getRoutinesByChildId(childId: string): Promise<IRoutine[]> {
    return await RoutineModel.find({ childId }).populate('tasks');
}

static async updateRoutine(
    id: string, 
    updateData: Partial<RoutineInput>
): Promise<IRoutine | null> {
    const updatedRoutine = await RoutineModel.findByIdAndUpdate(id,{ ...updateData, updatedAt: new Date() },{ new: true }).populate('tasks');
    
    if (updatedRoutine && updateData.parentId) {
      // notifyParent(updateData.parentId, 'Routine updated');
    }
    
    return updatedRoutine;
}

static async deleteRoutine(id: string): Promise<{ message: string }> {
    const routine = await RoutineModel.findByIdAndDelete(id);
    
    if (routine) {
      // notifyParent(routine.parentId.toString(), 'Routine deleted');
    }
    
    return { message: 'Routine deleted successfully' };
}
}