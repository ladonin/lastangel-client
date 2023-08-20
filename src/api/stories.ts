/**
  import { StoriesApi } from 'api/stories';
  Работа с историями
 */
import { AxiosResponse } from "axios";
import { TGetListOutput, TGetListRequest, TGetOutput, TCommonDataRequest } from "api/types/stories";
import { apiService } from "./axios";

// const paramsSerializer = (params: any): string => qs.stringify(params, { arrayFormat: "repeat" });

const prepareData = (data: TCommonDataRequest) => {
  const { another_images, ...params } = data;
  const files = { another_images };
  const json = JSON.stringify(params);
  const formData = new FormData();

  formData.append("data", json);

  if (files.another_images) {
    for (let i = 0; i < files.another_images.length; i++) {
      formData.append("another_images[]", files.another_images[i]);
    }
  }
  return formData;
};

export const StoriesApi = {
  getList: (params?: TGetListRequest) =>
    apiService.get(`get_stories_list`, { params }).then((response: AxiosResponse<TGetListOutput>) => response.data),
  get: (id: number) =>
    apiService.get(`get_story`, { params: { id } }).then((response: AxiosResponse<TGetOutput>) => response.data),
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
  remove: (id: number) => apiService.post(`remove_story?id=${id}`).then((response: AxiosResponse<boolean>) => response.data),
};
