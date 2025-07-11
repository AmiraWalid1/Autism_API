import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
  tasklines: string[];
  description: string;
  time: Date;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export type TaskInput = {
  tasklines: string[];
  description: string;
  time: Date;
  status?: 'pending' | 'in-progress' | 'completed'; // جعلها اختيارية هنا
};

const TaskSchema = new Schema<ITask>({
  tasklines: { type: [String], required: true },
  description: { type: String, required: true },
  time: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending' // قيمة افتراضية في السكيما
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const TaskModel = model<ITask>('Task', TaskSchema);