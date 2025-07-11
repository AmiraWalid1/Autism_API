import { TaskModel, TaskInput, ITask } from '../models/task';

export class TaskService {
  static async createTask(taskData: TaskInput): Promise<ITask> {
    const task = new TaskModel({
      ...taskData,
      status: taskData.status || 'pending' // ضمان وجود قيمة
    });
    return await task.save();
  }

  static async getTaskById(id: string): Promise<ITask | null> {
    return await TaskModel.findById(id);
  }

  static async updateTask(
    id: string, 
    updateData: Partial<TaskInput>
  ): Promise<ITask | null> {
    return await TaskModel.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: new Date() }, 
      { new: true }
    );
  }

  static async deleteTask(id: string): Promise<{ message: string }> {
    await TaskModel.findByIdAndDelete(id);
    return { message: 'Task deleted successfully' };
  }
}