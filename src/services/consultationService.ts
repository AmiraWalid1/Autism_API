import { ConsultationModel, ConsultationInput, IConsultation } from '../models/consultationModel';

export class ConsultationService {
  // حجز استشارة جديدة
    static async createConsultation(data: ConsultationInput): Promise<IConsultation> {
    const consultation = new ConsultationModel(data);
    return await consultation.save();
}

  // الحصول على استشارة بواسطة ID
static async getConsultationById(id: string): Promise<IConsultation | null> {
    return await ConsultationModel.findById(id)
    .populate('parentId', 'name email')
    .populate('doctorId', 'name specialization');
}

  // الحصول على استشارات ولي الأمر
static async getParentConsultations(parentId: string): Promise<IConsultation[]> {
    return await ConsultationModel.find({ parentId })
    .populate('doctorId', 'name specialization')
    .sort({ date: 1 });
}

  // الحصول على استشارات الطبيب
static async getDoctorConsultations(doctorId: string): Promise<IConsultation[]> {
    return await ConsultationModel.find({ doctorId })
    .populate('parentId', 'name')
    .sort({ date: 1 });
}

  // تحديث الاستشارة
static async updateConsultation(
    id: string, 
    updateData: Partial<ConsultationInput>
): Promise<IConsultation | null> {
    return await ConsultationModel.findByIdAndUpdate(
        id, { ...updateData, updatedAt: new Date() }, { new: true }
    );
}

  // حذف الاستشارة
static async deleteConsultation(id: string): Promise<{ message: string }> {
    await ConsultationModel.findByIdAndDelete(id);
    return { message: 'Consultation deleted successfully' };
}
}