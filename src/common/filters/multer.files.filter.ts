import { HttpException, HttpStatus } from '@nestjs/common';

export const imageMulterilter = (req, file, cb) => {
    if (!/(jpeg|png)/g.test(file.mimetype)) {
        req.fileValidationError = 'No available format. Allowed: jpg, png';
        cb(new HttpException('No available format. Allowed: jpg, png', HttpStatus.BAD_REQUEST), false);
    } else {
        cb(null, true);
    }
};
