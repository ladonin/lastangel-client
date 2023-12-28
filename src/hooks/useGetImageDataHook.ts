/*
  import { useGetImageDataHook, TData } from 'hooks/useGetImageDataHook';
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { DIMENTIONS } from "../constants/photos";

export type TData = { file: File; width: string; height: string };

const DEFAULT_COUNTER = { all: 0, current: 0 };
const AVAILABLE_EXTENSIONS = DIMENTIONS.IMAGES_UPLOAD_EXTENSIONS.split("|");

export const useGetImageDataHook = () => {
  const [resultState, setResultState] = useState<TData[] | null>(null);
  const [srcsState, setSrcsState] = useState<{ file: File; url: string }[] | null>(null);
  const imagesCounterRef = useRef({ ...DEFAULT_COUNTER });
  const sizesRef = useRef<TData[]>([]);

  useEffect(() => {
    if (srcsState) {
      imagesCounterRef.current.all = srcsState.length;

      srcsState.map(({ file, url }: { file: File; url: string }) => {
        const extension = file.type.split("/")[1];

        if (!AVAILABLE_EXTENSIONS.includes(extension)) {
          // Если это не картинка
          imagesCounterRef.current.current++;
          sizesRef.current = [...sizesRef.current, { file, width: "", height: "" }];
          if (imagesCounterRef.current.all && imagesCounterRef.current.all === imagesCounterRef.current.current) {
            // Все картинки проверены
            setResultState(sizesRef.current);
          }
        } else {
          const img = new Image();

          img.src = url;
          img.onload = function (this: any) {
            imagesCounterRef.current.current++;

            sizesRef.current = [...sizesRef.current, { file, width: this.width, height: this.height }];

            if (imagesCounterRef.current.all && imagesCounterRef.current.all === imagesCounterRef.current.current) {
              // Все картинки проверены
              setResultState(sizesRef.current);
            }
          };
        }
      });
    }
  }, [srcsState]);

  const reset = () => {
    imagesCounterRef.current = { ...DEFAULT_COUNTER };
    sizesRef.current = [];
  };

  const loadImgs = (imgs: File[]) => {
    reset();
    setSrcsState(
      imgs.map((img) => ({
        file: img,
        url: URL.createObjectURL(img),
      }))
    );
  };

  return {
    loadImgs,
    imgsResult: resultState,
  };
};
