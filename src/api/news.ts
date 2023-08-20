/**
  import { NewsApi } from 'api/news';
  Работа с новостями
 */
import { AxiosResponse } from "axios";
import { TGetListOutput, TGetListRequest, TGetOutput, TCommonDataRequest } from "api/types/news";
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

export const NewsApi = {
  getList: (params?: TGetListRequest) =>
    apiService.get(`get_news_list`, { params }).then((response: AxiosResponse<TGetListOutput>) => response.data),
  get: (id: number) =>
    apiService.get(`get_news`, { params: { id } }).then((response: AxiosResponse<TGetOutput>) => response.data),
  add: (data: TCommonDataRequest) =>
    apiService
      .post(`add_news`, prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),

  update: (id: number, data: TCommonDataRequest) =>
    apiService
      .post(`update_news?id=${id}`, prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),
  remove: (id: number) => apiService.post(`remove_news?id=${id}`).then((response: AxiosResponse<boolean>) => response.data),
};
