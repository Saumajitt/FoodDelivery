import nodemailer from 'nodemailer';
import 'dotenv/config';

const submitContactForm = async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Debug logs for environment variables
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
    console.log('RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL);

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: `Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Failed to send message' });
    }
};

export { submitContactForm };
