/**
  import { MetatagsApi } from 'api/metatags';
  Работа с метатегами
 */
import { AxiosResponse } from "axios";
import { saveFile } from "../helpers/common";
import { apiService } from "./axios";

export const MetatagsApi = {
  get: () =>
    apiService.get(`get_metatags`).then((response: AxiosResponse<string>) => response.data),
  update: (data: string) =>
    apiService
      .post(`update_metatags`, data)
      .then((response: AxiosResponse<boolean>) => response.data),
  downloadData: (type: string) =>
    apiService.get(`download_metatags`, { params: { type } }).then(saveFile),
};
