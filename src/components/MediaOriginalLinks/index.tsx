/*
  import MediaOriginalLinks from 'components/MediaOriginalLinks'
 
  Ссылки на оригиналы медиа-файлов
 */

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getAnotherImagesUrl as getAnotherImagesUrlAnimals,
  getMainImageUrl as getMainImageUrlAnimals,
  getVideoUrl as getVideoUrlAnimals,
} from "helpers/animals";
import {
  getAnotherImagesUrl as getAnotherImagesUrlCollections,
  getMainImageUrl as getMainImageUrlCollections,
  getVideoUrl as getVideoUrlCollections,
} from "helpers/collections";
import { getAnotherImagesUrl as getAnotherImagesUrlDocuments } from "helpers/documents";
import {
  getAnotherImagesUrl as getAnotherImagesUrlNews,
  getVideoUrl as getVideoUrlNews,
} from "helpers/news";
import {
  getAnotherImagesUrl as getAnotherImagesUrlStories,
  getVideoUrl as getVideoUrlStories,
} from "helpers/stories";
import { getAnotherImagesUrl as getAnotherImagesUrlMainphotoalbum } from "helpers/mainphotoalbum";
import {
  getAnotherImagesUrl as getAnotherImagesUrlAcquaintanceship,
  getVideoUrl as getVideoUrlAcquaintanceship,
} from "helpers/acquaintanceship";

import { isAdmin } from "utils/user";

import "./style.scss";

type TData = {
  id: number;
  main_image?: number;
  another_images: string;
  video1?: string;
  video2?: string;
  video3?: string;
};

type Props = {
  data: TData;
  type: string;
};

const MediaOriginalLinks: React.FC<Props> = ({ data, type }) => {
  const [dataState, setDataState] = useState<null | TData>(null);
  const [typeState, setTypeState] = useState<null | string>(null);
  const [anotherImagesState, setAnotherImagesState] = useState<null | number[]>(null);

  const getMainImageUrl = () => {
    if (typeState === "animals") return getMainImageUrlAnimals;
    if (typeState === "collections") return getMainImageUrlCollections;
    if (typeState === "documents") return () => undefined;
    if (typeState === "news") return () => undefined;
    if (typeState === "stories") return () => undefined;
    if (typeState === "mainphotoalbum") return () => undefined;
    if (typeState === "acquaintanceship") return () => undefined;
    return () => undefined;
  };

  const getAnotherImagesUrl = () => {
    if (typeState === "animals") return getAnotherImagesUrlAnimals;
    if (typeState === "collections") return getAnotherImagesUrlCollections;
    if (typeState === "documents") return getAnotherImagesUrlDocuments;
    if (typeState === "news") return getAnotherImagesUrlNews;
    if (typeState === "stories") return getAnotherImagesUrlStories;
    if (typeState === "mainphotoalbum") return getAnotherImagesUrlMainphotoalbum;
    if (typeState === "acquaintanceship") return getAnotherImagesUrlAcquaintanceship;
    return () => undefined;
  };

  const getVideoUrl = () => {
    if (typeState === "animals") return getVideoUrlAnimals;
    if (typeState === "collections") return getVideoUrlCollections;
    if (typeState === "documents") return () => undefined;
    if (typeState === "news") return getVideoUrlNews;
    if (typeState === "stories") return getVideoUrlStories;
    if (typeState === "mainphotoalbum") return () => undefined;
    if (typeState === "mainphotoalbum") return getVideoUrlAcquaintanceship;
    return () => undefined;
  };

  useEffect(() => {
    if (data && type) {
      setDataState(data);
      setTypeState(type);
      setAnotherImagesState(JSON.parse(data.another_images).reverse());
    }
  }, [data]);

  return !!dataState &&
    typeState &&
    isAdmin() &&
    (!!dataState.main_image ||
      !!anotherImagesState?.length ||
      !!dataState.video1 ||
      !!dataState.video2 ||
      !!dataState.video3) ? (
    <div className="component-mediaOriginalLinks">
      <b>Ссылки на исходники</b>
      {!!dataState.main_image && (
        <div className="loc_block">
          Главное фото:{" "}
          <Link target="_blank" to={getMainImageUrl()(dataState as any) || "/"} className="link_3">
            Скачать
          </Link>
        </div>
      )}
      {!!anotherImagesState && !!anotherImagesState.length && (
        <div className="loc_block">
          {typeState !== "mainphotoalbum" ? "Прочие фото: " : ""}
          {anotherImagesState?.map((item, index) => (
            <Link
              key={index}
              target="_blank"
              to={getAnotherImagesUrl()(dataState as any, item) || "/"}
              className="link_3"
            >
              {index + 1}
            </Link>
          ))}
        </div>
      )}
      {!!dataState.video1 && (
        <div className="loc_block">
          Видео 1:{" "}
          <Link
            target="_blank"
            to={getVideoUrl()(dataState as any, dataState.video1) || "/"}
            className="link_3"
          >
            Скачать
          </Link>
        </div>
      )}
      {!!dataState.video2 && (
        <div className="loc_block">
          Видео 2:{" "}
          <Link
            target="_blank"
            to={getVideoUrl()(dataState as any, dataState.video2) || "/"}
            className="link_3"
          >
            Скачать
          </Link>
        </div>
      )}
      {!!dataState.video3 && (
        <div className="loc_block">
          Видео 3:{" "}
          <Link
            target="_blank"
            to={getVideoUrl()(dataState as any, dataState.video3) || "/"}
            className="link_3"
          >
            Скачать
          </Link>
        </div>
      )}
    </div>
  ) : null;
};

export default MediaOriginalLinks;
