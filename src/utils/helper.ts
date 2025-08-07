import jwt from "jsonwebtoken"

export const formatResponse = (status: 'success' | 'error', message: string, data?: any) => ({ status, message, data });


export const generateToken = (payload: object, expiresIn: number) => {
    if (!process.env.TOKEN_SECRET) {
        throw new Error("TOKEN_SECRET is not defined");
    }
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
    if (!process.env.TOKEN_SECRET) {
        throw new Error("TOKEN_SECRET is not defined");
    }
    try {
        return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export const generateRandomPassword = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isStringStartswithUnderscore = (str: string): boolean => {
    return str.startsWith("_");
}

export const timeAgo = (timestamp: Date): string => {
    const now = new Date().getTime();
    const secondsPast = Math.floor((now - timestamp.getTime()) / 1000);

    if (secondsPast < 60) {
        return `${secondsPast} seconds ago`;
    } else if (secondsPast < 3600) {
        const minutes = Math.floor(secondsPast / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (secondsPast < 86400) {
        const hours = Math.floor(secondsPast / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(secondsPast / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
};