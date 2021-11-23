const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //1. CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
        // host: "smtp.mailtrap.io",
        // port: 2525,
        // auth: {
        //     user: "64c194d8e5886e",
        //     pass: "f67140d7ae2425"
        // }

        service: 'gmail',
        auth: {
            user: "jmlkhon17@gmail.com",
            pass: 'jamol1796,'
        }

        //ACTIVATE IN GMAIL "LESS SECURE APP" OPTION
    });

    //2. DEFINE THE EMAIL OPTIONS
    const mailOptions = {
        from: 'Jamol Umarov <jmlkhon@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    
    //3.Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;