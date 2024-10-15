const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { emailConfig } = require('../configs/email.config');

class EmailService {

    constructor(userEmail, subject, content) {
        this.userEmail = userEmail;
        this.subject = subject;
        this.content = content;
        this.transporter = nodemailer.createTransport(emailConfig);
    }

    // Helper function to load the HTML template and replace placeholders
    loadTemplate(templateName, replacements) {
        const templatePath = path.join(__dirname, '../templates', templateName);
        let template = fs.readFileSync(templatePath, 'utf8');

        // Replace placeholders with actual values
        for (const [key, value] of Object.entries(replacements)) {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        return template;
    }

    // Send verification email with HTML template
    async sendVerificationEmail(verificationLink) {
        // Load the email template and replace placeholders
        const htmlContent = this.loadTemplate('verify-email-template.html', { verificationLink });

        const mailOptions = {
            from: emailConfig.auth.user,
            to: this.userEmail,
            subject: this.subject,
            html: htmlContent,
        };

        return await this.transporter.sendMail(mailOptions);
    }
}

module.exports = EmailService;
