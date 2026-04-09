import { Router } from 'express';
import { 
  getContent, updateContent,
  updateLocale, updateMFA, updateUpdates, updateEvents,
  updateOfficers, updateGroups, updateActivities, updateMinistries 
} from '../controllers/contentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getContent);
router.put('/', authenticateToken, updateContent); // Fallback monolith 
router.put('/locale', authenticateToken, updateLocale);
router.put('/mfa', authenticateToken, updateMFA);
router.put('/updates', authenticateToken, updateUpdates);
router.put('/events', authenticateToken, updateEvents);
router.put('/officers', authenticateToken, updateOfficers);
router.put('/groups', authenticateToken, updateGroups);
router.put('/activities', authenticateToken, updateActivities);
router.put('/ministries', authenticateToken, updateMinistries);

export default router;
