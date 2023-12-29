/*
  import { SIZES_ANOTHER, SIZES_MAIN, DIMENTIONS } from 'constants/photos';
  Фото и их параметры
 */

export const SIZES_ANOTHER = {
  SIZE_1200: 1,
  SIZE_450: 2,
} as const;

export const SIZES_MAIN = {
  SQUARE: "square",
  SQUARE2: "square2",
  SIZE_1200: 1,
} as const;

export const DIMENTIONS = {
  IMAGES_UPLOAD_MIN_WIDTH: Number(process.env.IMAGES_UPLOAD_MIN_WIDTH) || 600,
  IMAGES_UPLOAD_MIN_HEIGHT: Number(process.env.IMAGES_UPLOAD_MIN_HEIGHT) || 600,
  IMAGES_UPLOAD_MAX_WIDTH: Number(process.env.IMAGES_UPLOAD_MAX_WIDTH) || 20000,
  IMAGES_UPLOAD_MAX_HEIGHT: Number(process.env.IMAGES_UPLOAD_MAX_HEIGHT) || 20000,
  IMAGES_UPLOAD_EXTENSIONS: process.env.IMAGES_UPLOAD_EXTENSIONS || "jpeg|gif|png|bmp",
};
