-- Database setup script for Job Board System

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   
    names TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    type TEXT NOT NULL,
    registrationType TEXT NOT NULL,
    userStatus TEXT NOT NULL,
    profilePictureURL TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    deadline DATETIME NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    postedBy INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postedBy) REFERENCES users(id)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    coverLetter TEXT NOT NULL,
    resumeURL TEXT NOT NULL,
    status TEXT NOT NULL,
    appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobId) REFERENCES jobs(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME NOT NULL,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    statusCode INTEGER NOT NULL,
    userAgent TEXT NOT NULL,
    duration TEXT,
    doneBy TEXT,
    ipAddress TEXT,
    activity TEXT,
    details TEXT,
    status TEXT,
    responseBody TEXT,
    requestBody TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_method ON audit_logs(method);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status_code ON audit_logs(statusCode);
CREATE INDEX IF NOT EXISTS idx_audit_logs_done_by ON audit_logs(doneBy);
