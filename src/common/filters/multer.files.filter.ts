export const imageMulterilter = (req, file, cb) => {
    if (!/(jpeg|png)/g.test(file.mimetype)) {
        req.fileValidationError = 'No available format. Allowed: jpg, png';
        cb(null, false);
    } else {
        cb(null, true);
    }
};
