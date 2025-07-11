import { Schema, model, Document, Types } from 'mongoose';

export interface IRoutine extends Document {
    rootTraining: string;
    description: string;
    tasks: Types.ObjectId[];
    childId: Types.ObjectId;
    parentId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type RoutineInput = {
    rootTraining: string;
    description: string;
    tasks: string[];
    childId: string;
    parentId: string;
};

const RoutineSchema = new Schema<IRoutine>({
    rootTraining: { type: String, required: true },
    description: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    childId: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const RoutineModel = model<IRoutine>('Routine', RoutineSchema);