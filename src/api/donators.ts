/**
  import { DonatorsApi } from 'api/donators';
  Работа с донаторами
 */
import { AxiosResponse } from "axios";
import { TGetListOutput, TGetListRequest, TGetOutput, TCommonDataRequest } from "api/types/donators";
import { apiService } from "./axios";
import { saveFile } from "../helpers/common";

// const paramsSerializer = (params: any): string => qs.stringify(params, { arrayFormat: "repeat" });

export const DonatorsApi = {
  getList: (params?: TGetListRequest) =>
    apiService.get(`get_donators_list`, { params }).then((response: AxiosResponse<TGetListOutput>) => response.data),
  get: (id: number) =>
    apiService.get(`get_donator`, { params: { id } }).then((response: AxiosResponse<TGetOutput>) => response.data),
  add: (data: TCommonDataRequest) =>
    apiService.post(`add_donator`, data).then((response: AxiosResponse<boolean>) => response.data),
  update: (id: number, data: TCommonDataRequest) =>
    apiService.post(`update_donator?id=${id}`, data).then((response: AxiosResponse<boolean>) => response.data),
  remove: (id: number) => apiService.post(`remove_donator?id=${id}`).then((response: AxiosResponse<boolean>) => response.data),
  downloadData: (type: string) =>
    apiService.get(`download_donators`, { params: { type } }).then(saveFile),
};
