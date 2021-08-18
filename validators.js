const { check } = require('express-validator');

const getError = (errors, prop) => {
    try {
        return errors.mapped()[prop].msg;
    } catch(e) {
        return '';
    }
};

module.exports = {
    validateSenderEmail: check('sender_email').trim().normalizeEmail().isEmail().withMessage('Invalid email'),

    validateEmailSubject: check('email_subject').trim().not().isEmpty().isString().isLength({min: 2, max: 50}).withMessage('Subject must be 2 - 50 characters long'),

    validateEmailContent: check('email_content').trim().not().isEmpty().isString().isLength({min: 2, max: 250}).withMessage('Content length capped at 250 characters'),

    getError
};