/**
  import { AcquaintanceshipApi } from 'api/acquaintanceship';
  Работа со страницей знакомства с приютом
 */
import { AxiosResponse } from "axios";
import {
  TGetOutput,
  TCommonDataRequest,
} from "api/types/acquaintanceship";
import { saveFile } from "../helpers/common";
import { apiService } from "./axios";

// const paramsSerializer = (params: any): string => qs.stringify(params, { arrayFormat: "repeat" });

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

export const AcquaintanceshipApi = {
  get: () =>
    apiService
      .get("get_acquaintanceship")
      .then((response: AxiosResponse<TGetOutput>) => response.data),
  update: (data: TCommonDataRequest) =>
    apiService
      .post("update_acquaintanceship", prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),
  downloadData: (type: string) =>
    apiService.get("download_acquaintanceship", { params: { type } }).then(saveFile),
};
