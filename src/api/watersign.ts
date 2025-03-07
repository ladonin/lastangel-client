/**
  import { WatersignApi } from 'api/watersign';
  Работа с водяными знаками
 */
import { saveFile } from "helpers/common";
import { apiService } from "./axios";

const prepareData = (img: File, transparent: number = 10) => {
  const formData = new FormData();
  formData.append("img", img);
  formData.append("transparent", String(transparent));
  return formData;
};

export const WatersignApi = {
  create: (img: File, transparent: number) =>
    apiService
      .post(`create_watersign`, prepareData(img, transparent), {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(saveFile),
};
