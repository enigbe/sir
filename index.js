const express = require('express');
const path = require('path');
const { validationResult } = require('express-validator');
const sendEmail = require('./email');

const { validateEmailContent, validateEmailSubject, validateSenderEmail} = require('./validators');

const PORT = 4000;
const app = express();

const getError = (errors, prop) => {
    try {
        return errors.mapped()[prop].msg;
    } catch(e) {
        return '';
    }

};

app.set('views', path.join(__dirname, 'views'));
app.set('view_engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).render('index.ejs');
});

app.post(
    '/email', 
    [validateSenderEmail, validateEmailSubject, validateEmailContent], 
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('error.ejs', {errors, getError});
            console.log(errors);
        }

        console.log(errors);
        const { sender_email, email_subject, email_content } = req.body;

        sendEmail(sender_email, email_subject, email_content, (error, data) => {
            if (error) {
                console.log(error);
                // res.status(500).json({ msg: 'Internal server error'});
            } else {
                console.log(data);
                // res.status(200).json({ msg: 'Email sent'})
            }
        });
        
});

app.listen(PORT, () => {
    console.log('Listening');
})
