import { applicationStatuses } from "../types";

export interface ApplicationDTO {
    jobId: number;
    coverLetter: string;
    resumeURL: string;
    status: applicationStatuses;
    phoneNumber?: string;
    email: string;
    linkedInProfile?: string;
    appliedAt: Date;
    updatedAt: Date;
    jobTitle?: string;
    names?: string;
}