/**
  import { FeedbacksApi } from 'api/feedbacks';
  Работа с обратной связью
 */
import { AxiosResponse } from "axios";
import {
  TGetListOutput,
  TGetListRequest,
  TCommonDataRequest,
  TGetNewCountOutput,
} from "api/types/feedbacks";
import { apiService } from "./axios";

export const FeedbacksApi = {
  getList: (params?: TGetListRequest) =>
    apiService
      .get(`get_feedbacks_list`, { params })
      .then((response: AxiosResponse<TGetListOutput>) => response.data),
  add: (data: TCommonDataRequest) =>
    apiService.post(`add_feedback`, data).then((response: AxiosResponse<boolean>) => response.data),
  getNewCount: () =>
    apiService
      .get(`get_feedbacks_new_count`)
      .then((response: AxiosResponse<TGetNewCountOutput>) => response.data),
  setIsViewed: (id: number) => apiService.get(`update_feedback_set_is_viewed?id=${id}`),
  setIsNew: (id: number) => apiService.get(`update_feedback_set_is_new?id=${id}`),
  remove: (id: number) => apiService.get(`remove_feedback?id=${id}`),
};
