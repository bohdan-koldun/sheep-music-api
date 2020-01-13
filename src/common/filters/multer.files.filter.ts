import { HttpException, HttpStatus } from '@nestjs/common';

export const imageMulterFilter = (req, file, cb) => {
    if (!/(jpeg|png)/g.test(file.mimetype)) {
        req.fileValidationError = 'No available format. Allowed: jpg, png';
        cb(new HttpException('No available format. Allowed: jpg, png', HttpStatus.BAD_REQUEST), false);
    } else {
        cb(null, true);
    }
};

export const audioMulterFilter = (req, file, cb) => {
    if (!/audio/g.test(file.mimetype)) {
        req.fileValidationError = 'No audio format.';
        cb(new HttpException('No audio format.', HttpStatus.BAD_REQUEST), false);
    } else {
        cb(null, true);
    }
};
