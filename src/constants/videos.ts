/*
  import { DIMENTIONS } from 'constants/videos';
  Видео и их параметры
 */

export const DIMENTIONS = {
  VIDEOS_UPLOAD_MAX_SIZE: Number(process.env.VIDEOS_UPLOAD_MAX_SIZE) || 99999,
  VIDEOS_UPLOAD_EXTENSIONS: process.env.VIDEOS_UPLOAD_EXTENSIONS || "mp4",
};
