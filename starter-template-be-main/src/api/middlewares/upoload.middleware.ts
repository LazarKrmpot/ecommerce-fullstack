import * as fs from 'fs';

import * as express from 'express';
import multer from 'multer';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class UploadMiddleware implements ExpressMiddlewareInterface {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = '/tmp/my-uploads'; // Directory for uploads
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it doesn't exist
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix); // Unique filename
    },
  });

  upload = multer({
    storage: this.storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // Set file size limit to 10 MB
    },
  });

  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    this.upload.single('file')(req, res, (err) => {
      next();
    });
  }
}
