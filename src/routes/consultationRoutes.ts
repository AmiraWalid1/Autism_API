import express from 'express';
import { ConsultationController } from '../controller/consultationController';

const router = express.Router();

// Middleware للتحقق من المدخلات
const validateConsultationInput = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void => {
const { parentId, doctorId, date } = req.body;

if (!parentId || typeof parentId !== 'string') {
    res.status(400).json({ error: 'Valid parentId is required' });
    return;
}

if (!doctorId || typeof doctorId !== 'string') {
    res.status(400).json({ error: 'Valid doctorId is required' });
    return;
}

if (!date || isNaN(new Date(date).getTime())) {
    res.status(400).json({ error: 'Valid date is required' });
    return;
}

next();
};

// POST /api/consultation    
router.post('/api/consultation', validateConsultationInput, (req, res) => ConsultationController.createConsultation(req, res));

// GET /api/consultation/:id    
router.get('/api/consultation', (req, res) => ConsultationController.getConsultation(req, res));

// GET /api/consultation/parent/:parentId 
router.get('/api/consultation/parent/:parentId ', (req, res) => ConsultationController.getParentConsultations(req, res));

// GET /api/consultation/doctor/:doctorId 
router.get('/api/consultation/doctor/:doctorId ', (req, res) => ConsultationController.getDoctorConsultations(req, res));

// PATCH /api/consultation/:id 
router.patch('/api/consultation/:id ', (req, res) => ConsultationController.updateConsultation(req, res));

// DELETE /api/consultation/:id  
router.delete('/api/consultation/:id', (req, res) => ConsultationController.deleteConsultation(req, res));

export const consultationRouter = router;