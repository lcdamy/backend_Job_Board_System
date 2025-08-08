import Joi from "joi";
import { jobTypes, jobStatuses } from "../types";

// Constants for repeated messages
const requiredFieldMessage = (field: string) => `${field} is a required field`;
const stringBaseMessage = (field: string) => `${field} should be a type of text`;
const stringMinMessage = (field: string, minLength: number) => `${field} should have a minimum length of ${minLength}`;
const arrayBaseMessage = (field: string) => `${field} should be an array of objects`;

// Helper functions to create fields
const createStringField = (minLength: number, field: string) => Joi.string().min(minLength).required().messages({
    'string.base': stringBaseMessage(field),
    'string.empty': `${field} cannot be an empty field`,
    'string.min': stringMinMessage(field, minLength),
    'any.required': requiredFieldMessage(field)
});

const emailField = Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email',
    'any.required': requiredFieldMessage('Email')
});

const uriField = (field: string) => Joi.string().pattern(/^(https?:\/\/)?[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/).required().messages({
    'string.pattern.base': `${field} must be a valid URL`,
    'any.required': requiredFieldMessage(field)
});

const genderField = Joi.string().valid('male', 'female').required().messages({
    'any.only': 'Gender must be either male or female',
    'any.required': requiredFieldMessage('Gender')
});

const passwordField = createStringField(6, 'Password');

const numberField = (field: string) => Joi.number().required().messages({
    'number.base': `${field} must be a number`,
    'any.required': requiredFieldMessage(field)
});

const phoneNumberField = Joi.string().pattern(/^\+\d{1,3}\d{4,14}$/).required().messages({
    'string.pattern.base': 'Phone number must start with a country code (e.g., +250) and be between 5 to 15 digits long',
    'any.required': requiredFieldMessage('Phone number')
});

const arrayField = (itemSchema: Joi.Schema, field: string) => Joi.array().items(itemSchema).required().messages({
    'array.base': arrayBaseMessage(field),
    'any.required': requiredFieldMessage(field)
});

export const userLoginValidationSchema = Joi.object({
    email: emailField,
    password: passwordField
});
export const userValidationSchema = Joi.object({
    names: createStringField(3, 'Names'),
    email: emailField,
    password: passwordField,
    type: Joi.string().valid('admin', 'job-seeker').required().messages({
        'any.only': 'User type must be either admin or job-seeker',
        'any.required': requiredFieldMessage('User type')
    }),
    registrationType: Joi.string().valid('manual', 'oauth').required().messages({
        'any.only': 'Registration type must be either manual or oauth',
        'any.required': requiredFieldMessage('Registration type')
    }),
    profilePictureURL: uriField('Profile picture URL')
});
export const userForgotPasswordDTO = Joi.object({
    email: emailField
});
export const userResetPasswordDTO = Joi.object({
    token: Joi.string().required().messages({
        'any.required': requiredFieldMessage('Token')
    }),
    newPassword: passwordField
});
export const userSocialLoginValidationSchema = Joi.object({
    names: createStringField(3, 'Names'),
    email: emailField,
    role: Joi.string().valid('admin', 'job-seeker').required().messages({
        'any.only': 'Role must be either admin or job-seeker',
        'any.required': requiredFieldMessage('Role')
    }),
    profilePictureURL: uriField('Profile picture URL')
});

export const jobValidationSchema = Joi.object({
    title: createStringField(3, 'Job title'),
    description: createStringField(10, 'Job description'),
    company: createStringField(3, 'Company name'),
    location: createStringField(3, 'Job location'),
    deadline: Joi.date().greater('now').required().messages({
        'date.greater': 'Deadline must be a future date',
        'any.required': requiredFieldMessage('Deadline')
    }),
    type: Joi.string()
        .valid(
            jobTypes.FullTime,
            jobTypes.PartTime,
            jobTypes.Contract,
            jobTypes.Internship,
            jobTypes.Freelance
        )
        .required()
        .messages({
            'any.only': `Job type must be one of: ${Object.values(jobTypes).join(', ')}`,
            'any.required': requiredFieldMessage('Job type')
        }),
    status: Joi.string()
        .valid(
            jobStatuses.Open,
            jobStatuses.Closed
        )
        .required()
        .messages({
            'any.only': `Job status must be one of: ${Object.values(jobStatuses).join(', ')}`,
            'any.required': requiredFieldMessage('Job status')
        }),
});

export const applicationValidationSchema = Joi.object({
    jobId: numberField('Job ID'),
    userId: numberField('User ID'),
    coverLetter: createStringField(10, 'Cover letter'),
    resumeURL: uriField('Resume URL'),
    jobTitle: Joi.string().optional(),
    userName: Joi.string().optional(),
    userEmail: Joi.string().email().optional(),
    phoneNumber: phoneNumberField.optional(),
    email: Joi.string().email().optional(),
    linkedInProfile: uriField('LinkedIn Profile').optional()
});
