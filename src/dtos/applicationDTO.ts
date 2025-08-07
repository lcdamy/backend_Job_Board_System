export interface ApplicationDTO {
    jobId: number;
    userId: number;
    coverLetter: string;
    resumeURL: string;
    status: string;
    appliedAt: Date;
    updatedAt: Date;
    jobTitle?: string;
    userName?: string;
    userEmail?: string;
}