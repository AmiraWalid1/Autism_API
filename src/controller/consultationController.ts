import { Request, Response } from 'express';
import { ConsultationService } from '../services/consultationService';
import { ConsultationInput } from '../models/consultationModel';

export class ConsultationController {
  // حجز استشارة جديدة
static async createConsultation(req: Request, res: Response): Promise<void> {
    try {
        const { parentId, doctorId, date, state }: ConsultationInput = req.body;

    if (!parentId || !doctorId || !date) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const newConsultation = await ConsultationService.createConsultation({
        parentId,
        doctorId,
        date: new Date(date),
        state
    });

    res.status(201).json({
        success: true,
        data: newConsultation,
        message: 'Consultation booked successfully'
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        error: 'Failed to book consultation',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

  // الحصول على تفاصيل استشارة
static async getConsultation(req: Request, res: Response): Promise<void> {
    try {
        const consultation = await ConsultationService.getConsultationById(req.params.id);

    if (!consultation) {
        res.status(404).json({ error: 'Consultation not found' });
        return;
    }

    res.status(200).json({
        success: true,
        data: consultation
    });
    } catch (error) {
        res.status(500).json({ 
        error: 'Failed to get consultation',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

  // الحصول على استشارات ولي الأمر
static async getParentConsultations(req: Request, res: Response): Promise<void> {
    try {
        const consultations = await ConsultationService.getParentConsultations(req.params.parentId);
        res.status(200).json({
        success: true,
        data: consultations,
        count: consultations.length
    });
    } catch (error) {
        res.status(500).json({ 
        error: 'Failed to get consultations',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

  // الحصول على استشارات الطبيب
static async getDoctorConsultations(req: Request, res: Response): Promise<void> {
    try {
        const consultations = await ConsultationService.getDoctorConsultations(req.params.doctorId);
        res.status(200).json({
        success: true,
        data: consultations,
        count: consultations.length
    });
    } catch (error) {
        res.status(500).json({ 
        error: 'Failed to get consultations',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

  // تحديث الاستشارة
static async updateConsultation(req: Request, res: Response): Promise<void> {
    try {
        const { notes, state } = req.body;
        const updatedConsultation = await ConsultationService.updateConsultation(req.params.id, { notes, state });

    if (!updatedConsultation) {
        res.status(404).json({ error: 'Consultation not found' });
        return;
    }

    res.status(200).json({
        success: true,
        data: updatedConsultation,
        message: 'Consultation updated successfully'
    });
    } catch (error) {
        res.status(500).json({ 
        error: 'Failed to update consultation',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}

  // إلغاء الاستشارة
static async deleteConsultation(req: Request, res: Response): Promise<void> {
    try {
        const result = await ConsultationService.deleteConsultation(req.params.id);
        res.status(200).json({
        success: true,
        data: result,
        message: 'Consultation cancelled successfully'
    });
    } catch (error) {
        res.status(500).json({ 
        error: 'Failed to cancel consultation',
        details: error instanceof Error ? error.message : 'Unknown error'
    });
    }
}
}