import { RegistrationType, userStatuses, UserType } from "../types";

export interface UserCreateDTO {
    names: string;
    email: string;
    password: string;
    type: UserType;
    registrationType: RegistrationType;
    userStatus: userStatuses;
    profilePictureURL?: string; // Optional field for profile picture URL
}


