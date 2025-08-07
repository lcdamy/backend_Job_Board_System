import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { UserCreateDTO } from "../dtos/userCreateDTO";
import { UserLoginDTO } from "../dtos/userLoginDTO";
import { UserForgotPasswordDTO } from "../dtos/userForgotPasswordDTO";
import { UserResetPasswordDTO } from "../dtos/userResetPasswordDTO";
import { UserSocialLoginDTO } from "../dtos/userSocialLoginDTO";
import { userLoginValidationSchema, userValidationSchema, userForgotPasswordDTO, userResetPasswordDTO, userSocialLoginValidationSchema } from "../utils/validate";
import { StatusCodes } from "http-status-codes";
import { formatResponse, verifyToken, generateToken } from "../utils/helper";
import { sendEmail } from "../utils/emailService";
import logger from '../config/logger';
import { RegistrationType, userStatuses } from "../types";



const authService = new AuthService();


export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userDTO: UserCreateDTO = req.body;
        const { error } = userValidationSchema.validate(userDTO);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }

        const existingUser = await authService.findUserByEmail(userDTO.email);
        if (existingUser) {
            logger.error(`Email already exists: ${userDTO.email}`);
            return res.status(StatusCodes.CONFLICT).json(formatResponse('error', 'Email already exists'));
        }


        const user = await authService.register(userDTO);
        if (Array.isArray(user)) {
            logger.info(`User registered successfully: ${user[0].email}`);
        } else {
            logger.info(`User registered successfully: ${user.email}`);
        }
        const userWithoutPassword = Array.isArray(user) ? user.map(({ password, ...rest }) => rest) : (({ password, ...rest }) => rest)(user);

        const userRole = Array.isArray(user) ? user[0].type : user.type;
        await sendWelcomeEmail(user, userRole, 'normal');

        return res.status(StatusCodes.CREATED).json(formatResponse('success', 'User registered successfully', { ...userWithoutPassword }));
    } catch (err) {
        const errorMessage = (err as Error).message;
        logger.error(`Error registering user: ${errorMessage}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', (err as Error).message, err));
    }
};

export const getTokenByEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const socialLoginDTO: UserSocialLoginDTO = req.body;
        // Validate the social login data
        const { error } = userSocialLoginValidationSchema.validate(socialLoginDTO);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }

        // Check if the user already exists
        let user = await authService.findUserByEmail(socialLoginDTO.email);

        if (!user) {
            logger.info(`User not found, creating new user: ${socialLoginDTO.email}`);
            const socialDTO: UserCreateDTO = {
                email: socialLoginDTO.email,
                names: socialLoginDTO.names,
                profilePictureURL: socialLoginDTO.profilePictureURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                type: socialLoginDTO.role,
                registrationType: RegistrationType.OAuth,
                password: Math.random().toString(36).slice(-8), // Generate a random password
                userStatus: userStatuses.Active
            };

            const result = await authService.register(socialDTO);
            user = Array.isArray(result) ? result[0] : result;

            if (user) {
                if (Array.isArray(result)) {
                    logger.info(`New user created: ${user.email}`);
                } else {
                    logger.info(`New user created: ${user.email}`);
                }
                await sendWelcomeEmail(user, socialLoginDTO.role, 'social');
            } else {
                logger.error('Failed to create new user: user is null');
            }
        }

        // Ensure user is not null before generating a token
        if (!user) {
            logger.error('User is null after registration or lookup.');
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', 'User not found after registration or lookup.'));
        }

        // Generate a token for the user
        const token = generateToken(
            {
                id: user.id,
                email: user.email,
                role: user.type,
                names: user.names,
                profilePictureURL: user.profilePictureURL
            },
            86400 // Token expiration time in seconds (1 day)
        );

        logger.info(`Token generated for user: ${socialLoginDTO.email}`);
        return res.status(StatusCodes.OK).json(formatResponse('success', 'Social Login successful', { token }));
    } catch (err) {
        const errorMessage = (err as Error).message;
        logger.error(`Error during social login: ${errorMessage}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', errorMessage));
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const loginDTO: UserLoginDTO = req.body;

        // Validate the login data
        const { error } = userLoginValidationSchema.validate(loginDTO);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }

        const { email, password } = loginDTO;

        // Check if the user exists
        const user = await authService.findUserByEmail(email);
        if (!user) {
            logger.error(`User not found: ${email}`);
            return res.status(StatusCodes.UNAUTHORIZED).json(formatResponse('error', 'Account not found'));
        }

        // Check if the user is allowed to log in
        if (!['active'].includes(user.userStatus ?? '')) {
            let message = "You can't login at this time.";
            switch (user.userStatus) {
                case 'pending':
                    message = "Your account is pending verification. Please check your email to verify your account.";
                    break;
                default:
                    message = "Your account cannot be accessed at this time. Please contact support for assistance.";
            }
            logger.error(`User not allowed to login: ${email} (status: ${user.userStatus})`);
            return res.status(StatusCodes.FORBIDDEN).json(formatResponse("error", message));
        }

        // Verify the user's credentials
        await authService.login(email, password);


        // Generate a token for the user
        const token = generateToken(
            {
                id: user.id,
                email: user.email,
                role: user.type,
                names: user.names,
                profilePictureURL: user.profilePictureURL
            },
            86400 // Token expiration time in seconds (1 day)
        );

        logger.info(`Login successful for user: ${email}`);
        return res.status(StatusCodes.OK).json(formatResponse('success', 'Login successful', { token }));
    } catch (err) {
        const errorMessage = (err as Error).message;
        logger.error(`Login error for user ${req.body.email || 'unknown'}: ${errorMessage}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', errorMessage));
    }
};

export const activateAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { token } = req.params;
        if (!token) {
            logger.error("Account activation failed: Token is required");
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', 'Token is required'));
        }

        const decoded = verifyToken(token);

        if (typeof decoded === 'string') {
            logger.error("Account activation failed: Invalid token");
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', 'Invalid token'));
        }

        await authService.activateAccount(decoded.email);
        logger.info(`Account activated successfully for email: ${decoded.email}`);
        return res.status(StatusCodes.OK).json(formatResponse('success', 'Account activated successfully'));
    } catch (err) {
        const errorMessage = (err as Error).message;
        logger.error(`Failed to activate account: ${errorMessage}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', (err as Error).message, err));
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const forgotPasswordDTO: UserForgotPasswordDTO = req.body;
        const { error } = userForgotPasswordDTO.validate(forgotPasswordDTO);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }
        const { email } = forgotPasswordDTO;
        // Check if the user exists and is active
        const user = await authService.findUserByEmail(email);
        if (!user || !['active', 'operational'].includes(user.userStatus ?? '')) {
            const errorMessage = !user ? 'Account not found' : 'User account is not allowed to reset password';
            logger.error(`${errorMessage}: ${email}`);
            return res.status(StatusCodes.NOT_FOUND).json(formatResponse('error', errorMessage));
        }
        // Generate a password reset token and send it to the user's email
        await authService.forgotPassword(email);
        logger.info(`Password reset link sent to: ${email}`);
        return res.status(StatusCodes.OK).json(formatResponse('success', 'Password reset link sent'));
    } catch (err) {
        const errorMessage = (err as Error).message;
        logger.error(`Error sending password reset link: ${errorMessage}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', (err as Error).message, err));
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const resetPasswordDTO: UserResetPasswordDTO = req.body;
        const { error } = userResetPasswordDTO.validate(resetPasswordDTO);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }
        const { token, newPassword } = resetPasswordDTO;
        await authService.resetPassword(token, newPassword);
        logger.info(`Password reset successful for token: ${token}`);
        return res.status(StatusCodes.OK).json(formatResponse('success', 'Password reset successful'));
    } catch (err) {
        const errorMessage = (err as Error).message;
        logger.error(`Error resetting password: ${errorMessage}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', (err as Error).message, err));
    }
};

const sendWelcomeEmail = async (user: any, role: string, type: string) => {
    const frontend_host = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3000';
    const context = {
        year: new Date().getFullYear(),
        logo_url: process.env.LOGO_URL,
        subject: 'Welcome to Isco Job board',
        name: user.firstname,
        message: '',
        link: '',
        link_label: 'Verify your account'
    };

    const sendEmailWithContext = async (message: string, linkLabel: string) => {
        const token = generateToken({ email: user.email }, 86400);
        context.message = message;

        context.link_label = linkLabel;
        context.link = `${frontend_host}/login?token=${token}`;
        sendEmail('email_template', 'Welcome to Isco Job board', user.email, context);
    };

    await sendEmailWithContext(
        `Welcome to the Isco Job board! An admin account has been created for you. To get started, please verify your account by clicking the link below.`,
        'Verify your account'
    );
};

