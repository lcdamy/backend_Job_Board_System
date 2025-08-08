import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/helper";
import { sendEmail } from "../utils/emailService";
import logger from '../config/logger';
import { userStatuses } from "../types";

export class AuthService {
    private frontend_host = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3000';

    // Register a new user
    async register(userDTO: any) {
        const { email, password, registrationType, ...otherData } = userDTO;
        const userStatus: userStatuses = registrationType === "oauth" ? userStatuses.Active : userStatuses.Pending;

        // Check if user exists
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            if (registrationType !== 'google') {
                logger.error(`User registration failed: User with email ${email} already exists`);
                throw new Error("User already exists, please login or reset your password");
            }
            return existingUser;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User(
            otherData.names,
            email,
            hashedPassword,
            otherData.type,
            registrationType,
            otherData.profilePictureURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            new Date(),
            new Date(),
            undefined, // id will be set by the database
            userStatus
        );
        const savedUser = await User.save(user);
        logger.info(`User registered successfully with email ${email}`);
        return savedUser;
    }

    // Login user
    async login(email: string, password: string): Promise<string> {
        const user = await User.findByEmail(email);

        if (!user) {
            logger.error(`Login failed: Invalid credentials for email ${email}`);
            throw new Error("Invalid credentials");
        }

        if (!user.password) {
            logger.error(`Login failed: User password is undefined for email ${email}`);
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password as string);
        if (!isPasswordValid) {
            logger.error(`Login failed: Invalid credentials for email ${email}`);
            throw new Error("Invalid credentials");
        }

        if (!process.env.TOKEN_SECRET) {
            logger.error("Login failed: TOKEN_SECRET is not defined");
            throw new Error("Server configuration error");
        }

        const tokenPayload = {
            id: user.id,
            email: user.email,
            type: user.type,
            names: user.names,
            profilePictureURL: user.profilePictureURL,
        };

        const token = generateToken(tokenPayload, parseInt(process.env.TOKEN_VALIDATION_TIME || '86400'));
        logger.info(`User logged in successfully with email ${email}`);
        return token;
    }

    // Find user by email
    async findUserByEmail(email: string): Promise<Partial<User> | null> {
        const user = await User.findByEmail(email);

        if (!user) {
            logger.warn(`User not found with email ${email}`);
            return null;
        }

        logger.info(`User found with email ${email}`);
        const { password, registrationType, ...userWithoutSensitiveInfo } = user;
        return { ...userWithoutSensitiveInfo, type: user.type };
    }

    // Find user by id
    async findUserById(id: number): Promise<Partial<User> | null> {
        const user = await User.findOne(id);
        if (user) {
            logger.info(`User found with id ${id}`);
            const { password, registrationType, ...userWithoutSensitiveInfo } = user;
            return userWithoutSensitiveInfo;
        } else {
            logger.warn(`User not found with id ${id}`);
            return null;
        }
    }

    // Activate account
    async activateAccount(email: string): Promise<User> {
        const user = await User.findByEmail(email);

        if (!user) {
            logger.error(`Account activation failed: User not found with email ${email}`);
            throw new Error("User not found");
        }
        const updatedUser = await User.update(user.id!, { userStatus: userStatuses.Active });
        logger.info(`Account activated successfully for email ${email}`);
        return updatedUser!;
    }

    // Forgot password
    async forgotPassword(email: string): Promise<void> {
        const user = await User.findByEmail(email);

        const context = {
            year: new Date().getFullYear(),
            logo_url: process.env.LOGO_URL,
            subject: '',
            name: '',
            message: '',
            link: '',
            link_label: ''
        };

        if (!user) {
            logger.error(`Forgot password failed: User not found with email ${email}`);
            throw new Error("User not found");
        }

        await User.update(user.id!, { userStatus: userStatuses.Inactive });

        const token = generateToken({ email: user.email }, parseInt(process.env.TOKEN_VALIDATION_TIME || '86400'));
        const resetLink = `${this.frontend_host}/reset-password?token=${token}`;
        logger.info(`Password reset link generated for email ${email}: ${resetLink}`);
        context.subject = 'iSCO Job board system challenge Password Reset';
        context.name = user.names ?? '';
        context.message = 'We received a request to reset your password. This link is valid for 1 hour. Please click the button below to reset your password:';
        context.link = resetLink;
        context.link_label = 'Reset your password';
        try {
            if (!user.email) {
                logger.error(`Password reset failed: User email is undefined for user with id ${user.id}`);
                throw new Error("User email is undefined");
            }
            sendEmail('email_template', 'Password reset', user.email, context);
            logger.info(`Password reset email sent to ${email}`);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error sending password reset email to ${email}: ${error.message}`);
            } else {
                logger.error(`Error sending password reset email to ${email}`);
            }
        }
    }

    // Reset password
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const decoded = verifyToken(token);

        if (typeof decoded === 'string' || !decoded.email) {
            logger.error("Password reset failed: Invalid token");
            throw new Error("Invalid token");
        }

        const user = await User.findByEmail(decoded.email);

        if (!user) {
            logger.error(`Password reset failed: User not found with email ${decoded.email}`);
            throw new Error("User not found");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update(user.id!, { password: hashedPassword, userStatus: userStatuses.Active });
        logger.info(`Password reset successfully for email ${decoded.email}`);
    }
}