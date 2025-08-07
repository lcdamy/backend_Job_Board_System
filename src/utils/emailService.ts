import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import logger from '../config/logger';



const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;

if (!GMAIL_EMAIL || !GMAIL_PASSWORD) {
  throw new Error('Missing required environment variables');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD
  }
});

const loadTemplate = (templateName: string, context: any) => {
  const filePath = path.resolve(process.cwd(), 'src/templates', `${templateName}.html`);
  logger.info(`Loading email template from: ${filePath}`);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  return template(context);
};

export const sendEmail = async (templateName: string, subject: string, email: string, context: any) => {
  try {
    // Check if the user is eligible for email
    logger.info(`Checking if user is eligible for email: ${email}`);

    // Load and compile the email template
    const html = loadTemplate(templateName, context);

    // Define email options
    const mailOptions = {
      from: GMAIL_EMAIL,
      to: email,
      subject,
      text: context.message || '', // Fallback to empty string if no message
      html,
      attachments: context.attachments || [] // Include attachments if provided
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to: ${email}`);
    return result;
  } catch (error) {
    logger.error(`Error sending email to ${email}:`, error);
    throw error;
  }
};