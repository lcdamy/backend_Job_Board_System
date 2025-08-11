export enum UserType {
    Admin = "admin",
    User = "job-seeker"
}
export enum RegistrationType {
    Manual = "manual",
    OAuth = "oauth"
}
export enum userStatuses {
    Active = "active",
    Inactive = "inactive",
    Pending = "pending"
};
export enum jobStatuses {
    Open = "open",
    Closed = "closed"
};

export enum jobTypes {
    FullTime = "full-time",
    PartTime = "part-time",
    Contract = "contract",
    Internship = "internship",
    Freelance = "freelance"
};

export enum applicationStatuses {
    UnderReview = "under-review",
    InterviewScheduled = "interview-scheduled",
    OfferMade = "offer-made",
    Rejected = "rejected",
    Accepted = "accepted",
    Pending = "pending"
};

export interface UserInterface {
    id?: number;
    names: string;
    email: string;
    password: string;
    type: UserType;
    registrationType: RegistrationType;
    userStatus?: userStatuses;
    profilePictureURL: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface AuditLogInterface {
    id?: string;
    timestamp: Date;
    method: string;
    url: string;
    statusCode: number;
    duration?: string;
    userAgent: string;
    doneBy?: string;
    ipAddress?: string;
    activity?: string;
    details?: string;
    status?: string;
    responseBody?: string;
    requestBody?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface JobInterface {
    id?: number;
    title: string;
    description: string;
    company: string;
    location: string;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
    status: jobStatuses;
    type: jobTypes;
}

export interface JobApplicationInterface {
    id?: number;
    jobId: number;
    coverLetter: string;
    resumeURL: string;
    status: applicationStatuses;
    phoneNumber?: string;
    email?: string;
    linkedInProfile?: string;
    appliedAt: Date;
    updatedAt: Date;
    jobTitle?: string;
    names?: string;
}