/**
 * Express router for /candidates routes.
 */
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { createCandidateHandler, uploadResumeHandler } from '../controllers/candidateController';

/** Router mounting candidate handlers. */
const router = Router();

/** Multer memory storage for resume upload (validated in controller). */
const upload = multer({ storage: multer.memoryStorage() });

/**
 * For multipart/form-data, parse the form and attach file to req; otherwise pass through.
 * Field name for the resume file is "resume".
 */
function multipartMiddleware(req: Request, res: Response, next: NextFunction): void {
  const contentType = req.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    upload.single('resume')(req, res, next);
    return;
  }
  next();
}

router.post('/', multipartMiddleware, createCandidateHandler);
router.post('/:id/resume', upload.single('resume'), uploadResumeHandler);

export default router;
