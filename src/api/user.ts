/**
  import { logoutApi, refreshTokenApi } from 'api/user';
  Аутентификация
 */
import { AxiosResponse } from "axios";
import { UserTypes } from "types/user";
import { apiService } from "./axios";

export const UserApi = {
  signin: (data: UserTypes.Credentials) =>
    apiService
      .post(`signin`, data)
      .then((response: AxiosResponse<UserTypes.SignInResponse>) => response.data),
  checkToken: (type: string) =>
    apiService
      .post(`check_token`, { type })
      .then((response: AxiosResponse<UserTypes.AuthResponse>) => response.data),
};
