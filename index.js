const express = require('express');
const path = require('path');
const { validationResult } = require('express-validator');
const sendEmail = require('./email');
const keys = require('./config/keys');

const { validateEmailContent, validateEmailSubject, validateSenderEmail, getError} = require('./validators');

const app = express();

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
        }

        const { sender_email, email_subject, email_content } = req.body;

        sendEmail(sender_email, email_subject, email_content, (error, data) => {
            if (error) {
                res.status(500).render('failure.ejs',{ msg: 'Error sending email'});
            } else {
                res.status(200).render('success.ejs',{ msg: 'Email sent successfully'});
            }
        });
        
});

app.listen(keys.PORT, () => {
    console.log('Listening');
})
