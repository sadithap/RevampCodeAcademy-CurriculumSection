import { Injectable } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';

@Injectable()
export class UploadMulter {
  static MulterOption(): MulterModuleOptions {
    return {
      dest: './uploads',
      fileFilter(req, file, callback) {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          callback(null, true);
        } else {
          return callback(
            new Error('Only .png, .jpg, and .jpeg format allowed'),
            false,
          );
        }
      },
      limits: { fileSize: 1 * 1024 * 1024 },
    };
  }
}
