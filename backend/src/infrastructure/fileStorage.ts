/**
 * Local file storage for resume/CV uploads. Uses UPLOAD_DIR or ./uploads by default.
 */
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

/** Default directory name for uploaded files when UPLOAD_DIR is not set. */
const DEFAULT_UPLOAD_DIR = 'uploads';
/** Bytes per megabyte for size limits. */
const BYTES_PER_MB = 1024 * 1024;

/** Maximum allowed resume file size in bytes (5MB). */
export const MAX_RESUME_SIZE_BYTES = 5 * BYTES_PER_MB;

/** Allowed MIME types for resume upload. */
export const ALLOWED_RESUME_CONTENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/** File extension by MIME type for saved resume files. */
const EXT_BY_MIME: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

/**
 * Returns the configured upload directory (absolute path). Creates it if it does not exist.
 * @returns Absolute path to the upload directory
 */
async function getUploadDir(): Promise<string> {
  const dir = process.env.UPLOAD_DIR ?? DEFAULT_UPLOAD_DIR;
  const absolute = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
  await fs.mkdir(absolute, { recursive: true });
  return absolute;
}

/**
 * Saves a resume file to disk. Caller must validate buffer size and contentType before calling.
 * @param buffer - File buffer
 * @param contentType - MIME type (must be in ALLOWED_RESUME_CONTENT_TYPES)
 * @param originalFileName - Original name for extension fallback
 * @returns Relative path suitable for storing in DB (e.g. uploads/uuid.pdf)
 */
export async function saveResume(
  buffer: Buffer,
  contentType: string,
  originalFileName: string
): Promise<string> {
  const ext = EXT_BY_MIME[contentType] ?? (path.extname(originalFileName).slice(1) || 'bin');
  const baseDir = await getUploadDir();
  const fileName = `${randomUUID()}.${ext}`;
  const filePath = path.join(baseDir, fileName);
  await fs.writeFile(filePath, buffer);
  return path.relative(process.cwd(), filePath);
}

/**
 * Ensures the resolved path is inside the upload directory. Throws if not.
 * @param resolvedPath - Absolute path to the file
 * @param uploadDir - Absolute path to the upload directory
 */
function ensurePathInsideUploadDir(resolvedPath: string, uploadDir: string): void {
  const relativeToUpload = path.relative(uploadDir, resolvedPath);
  if (relativeToUpload.startsWith('..') || path.isAbsolute(relativeToUpload)) {
    throw new Error('Resume path is outside upload directory');
  }
}

/**
 * Deletes a file by path (relative as stored in DB). No-op if file does not exist.
 * Rejects absolute or path-traversal input and ensures the resolved path stays inside the upload directory.
 * @param relativePath - Path relative to cwd (e.g. uploads/uuid.pdf)
 */
export async function deleteResumeFile(relativePath: string): Promise<void> {
  if (path.isAbsolute(relativePath)) {
    throw new Error('Resume path must be relative');
  }
  const uploadDir = await getUploadDir();
  const resolvedPath = path.resolve(process.cwd(), relativePath);
  ensurePathInsideUploadDir(resolvedPath, uploadDir);
  try {
    await fs.unlink(resolvedPath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
      throw err;
    }
  }
}
