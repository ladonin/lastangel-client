/**
 import { UserTypes } from 'src/types/user';
 */
import { ROLES } from "constants/user";

export namespace UserTypes {
  export interface Credentials {
    login: string;
    password: string;
  }

  export interface User {
    id: string;
    displayName: string;
    authToken: string;
    role: keyof typeof ROLES;
  }

  export interface SignInResponse {
    status: string;
    data: string;
  }

  export type AuthResponse = boolean;
}
