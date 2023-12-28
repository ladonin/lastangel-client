/**
  import { StoriesApi } from 'api/stories';
  Работа с историями
 */
import { AxiosResponse } from "axios";
import { TGetListOutput, TGetListRequest, TGetOutput, TCommonDataRequest } from "api/types/stories";
import { saveFile } from "helpers/common";
import { apiService } from "./axios";

// const paramsSerializer = (params: any): string => qs.stringify(params,
// { arrayFormat: "repeat" });

const prepareData = (data: TCommonDataRequest) => {
  const { another_images, video1, video2, video3, ...params } = data;
  const json = JSON.stringify(params);
  const formData = new FormData();

  formData.append("data", json);

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

export const StoriesApi = {
  getList: (params?: TGetListRequest) =>
    apiService
      .get(`get_stories_list`, { params })
      .then((response: AxiosResponse<TGetListOutput>) => response.data),
  get: (id: number) =>
    apiService
      .get(`get_story`, { params: { id } })
      .then((response: AxiosResponse<TGetOutput>) => response.data),
  add: (data: TCommonDataRequest) =>
    apiService
      .post(`add_story`, prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),

  update: (id: number, data: TCommonDataRequest) =>
    apiService
      .post(`update_story?id=${id}`, prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),
  remove: (id: number) =>
    apiService
      .post(`remove_story?id=${id}`)
      .then((response: AxiosResponse<boolean>) => response.data),
  downloadData: (type: string) =>
    apiService.get(`download_stories`, { params: { type } }).then(saveFile),
};
