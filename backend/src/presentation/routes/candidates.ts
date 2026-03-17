import { Router } from 'express';
import { createCandidateHandler } from '../controllers/candidateController';

const router = Router();

router.post('/', createCandidateHandler);

export default router;
