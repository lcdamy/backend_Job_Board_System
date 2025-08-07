import { UserType } from "../types";

export interface UserSocialLoginDTO {
  names: string;
  email: string;
  role: UserType;
  profilePictureURL: string;
}