/**
  import { ClinicPhotosApi } from 'api/clinicPhotos';
  Работа с фотографиями клиники
 */
import { AxiosResponse } from "axios";
import { TGetOutput, TCommonDataRequest } from "api/types/clinicPhotos";
import { apiService } from "./axios";

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

export const ClinicPhotosApi = {
  get: () => apiService.get(`get_clinic_photos`).then((response: AxiosResponse<TGetOutput>) => response.data),

  update: (data: TCommonDataRequest) =>
    apiService
      .post(`update_clinic_photos`, prepareData(data), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse<boolean>) => response.data),
};
