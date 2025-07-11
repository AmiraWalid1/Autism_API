import { Schema, model, Document, Types } from 'mongoose';

export type ConsultationState = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IConsultation extends Document {
    parentId: Types.ObjectId;
    doctorId: Types.ObjectId;
    date: Date;
    state: ConsultationState;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ConsultationInput = {
    parentId: string;
    doctorId: string;
    date: Date;
    state?: ConsultationState;
    notes?: string;
};

const ConsultationSchema = new Schema<IConsultation>({

    parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    state: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
},
notes: { type: String },
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
});

export const ConsultationModel = model<IConsultation>('Consultation', ConsultationSchema);