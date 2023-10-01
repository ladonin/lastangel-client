/**
  import { DonationsApi } from 'api/donations';
  Работа с донатами
 */
import { AxiosResponse } from "axios";
import { TGetListOutput, TGetListRequest, TGetOutput, TCommonDataRequest, TGetTargetListRequest } from "api/types/donations";
import { apiService } from "./axios";
import { saveFile } from "../helpers/common";

// const paramsSerializer = (params: any): string => qs.stringify(params, { arrayFormat: "repeat" });

export const DonationsApi = {
  getList: (params?: TGetListRequest) =>
    apiService.get(`get_donations_list`, { params }).then((response: AxiosResponse<TGetListOutput>) => response.data),
  getTargetList: (params?: TGetTargetListRequest) =>
    apiService.get(`get_target_donations`, { params }).then((response: AxiosResponse<TGetListOutput>) => response.data),
  get: (id: number) =>
    apiService.get(`get_donation`, { params: { id } }).then((response: AxiosResponse<TGetOutput>) => response.data),
  add: (data: TCommonDataRequest) =>
    apiService.post(`add_donation`, data).then((response: AxiosResponse<boolean>) => response.data),
  update: (id: number, data: TCommonDataRequest) =>
    apiService.post(`update_donation?id=${id}`, data).then((response: AxiosResponse<boolean>) => response.data),
  remove: (id: number) => apiService.post(`remove_donation?id=${id}`).then((response: AxiosResponse<boolean>) => response.data),
  downloadData: (type: string) =>
    apiService.get(`download_donations`, { params: { type } }).then(saveFile),
};
