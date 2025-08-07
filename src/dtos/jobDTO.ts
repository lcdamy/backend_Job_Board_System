import { jobStatuses, jobTypes } from "../types";

export interface JobDTO {
    title: string;
    description: string;
    company: string;
    location: string;
    deadline: Date;
    status: jobStatuses;
    type: jobTypes;
}