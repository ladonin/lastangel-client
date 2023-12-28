/**
 import { AnimalsApi } from 'api/animals';
 Работа с базой животных
 */
import { AxiosResponse } from "axios";
// import qs from "qs";
import {
  TGetListOutput,
  TGetListRequest,
  TGetOutput,
  TCommonDataRequest,
} from "api/types/volunteers";
import { saveFile } from "helpers/common";
import { apiService } from "./axios";

// const paramsSerializer = (params: any): string => qs.stringify(params, { arrayFormat: "repeat" });

const prepareData = (data: TCommonDataRequest) => {
  const { main_image, another_images, video1, video2, video3, ...params } = data;
  const json = JSON.stringify(params);
  const formData = new FormData();

  formData.append("data", json);

  if (main_image) {
    formData.append("main_image_cropped", main_image.cropped);
    formData.append("main_image_original", main_image.original);
  }

  if (Array.isArray(another_images)) {
    for (let i = 0; i < another_images.length; i++) {
      formData.append("another_images[]", another_images[i]);
    }
  }
  formData.append("video1", video1 || "");
  formData.append("video2", video2 || "");
  formData.append("video3", video3 || "");
  return formData;
};

export const VolunteersApi = {
  getList: (params?: TGetListRequest) =>
    apiService
      .get(`get_volunteers_list`, { params })
      .then((response: AxiosResponse<TGetListOutput>) => response.data),
  get: (id: number) =>
    apiService
      .get(`get_volunteer`, { params: { id } })
      .then((response: AxiosResponse<TGetOutput>) => response.data),
  add: (data: TCommonDataRequest) =>
    apiService
      .post(`add_volunteer`, prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),

  update: (id: number, data: TCommonDataRequest) =>
    apiService
      .post(`update_volunteer?id=${id}`, prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),
  remove: (id: number) =>
    apiService
      .post(`remove_volunteer?id=${id}`)
      .then((response: AxiosResponse<boolean>) => response.data),
  downloadData: (type: string) =>
    apiService.get(`download_volunteers`, { params: { type } }).then(saveFile),
};
