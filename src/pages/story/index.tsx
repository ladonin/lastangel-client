import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { detect as detectBrowser } from "detect-browser";

import List from "pages/stories/_components/List";
import { TItem } from "api/types/stories";
import PAGES from "routing/routes";
import { StoriesApi } from "api/stories";
import { getVideoUrl, getAnotherImagesUrl } from "helpers/stories";
import BreadCrumbs from "components/BreadCrumbs";
import { STORIES_STATUS } from "constants/stories";
import { isAdmin } from "utils/user";
import { getDateString } from "helpers/common";
import { SIZES_ANOTHER } from "constants/photos";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const Story: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);
  const [idState, setIdState] = useState<number | null>(null);
  const [dataState, setDataState] = useState<TItem | null>(null);
  const { id } = useParams();
  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  const [anotherImagesState, setAnotherImagesState] = useState<false | number[]>(false);

  useEffect(() => {
    if (dataState && dataState.another_images) {
      setAnotherImagesState(JSON.parse(dataState.another_images));
    }
  }, [dataState]);
  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  useEffect(() => {
    id && setIdState(Number(id));
  }, [id]);

  useEffect(() => {
    idState &&
      StoriesApi.get(idState).then((res) => {
        setDataState(res);
      });
  }, [idState]);

  return idState ? (
    <div className="page-story">
      <BreadCrumbs title="Истории" />

      {dataState && (
        <div className={cn("loc_item", { "loc--non_published": dataState.status === STORIES_STATUS.NON_PUBLISHED })}>
          {dataState.status === STORIES_STATUS.NON_PUBLISHED && <div className="loc_nonpublished">Не опубликован</div>}
          <div className="loc_created">{getDateString(dataState.created)}</div>
          <div className="loc_name">{dataState.name}</div>
          {isAdmin() && (
            <Button
              className="loc_redactButton"
              theme={ButtonThemes.PRIMARY}
              size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => {
                navigate(`${PAGES.ADMINISTRATION_STORY_UPDATE}/${dataState.id}`);
              }}
            >
              Редактировать
            </Button>
          )}
          <div className="loc_description">
            <div dangerouslySetInnerHTML={{ __html: dataState.description }} />

            {!dataState.hide_album && !!anotherImagesState && !!anotherImagesState.length && (
              <Swiper slidesPerView={1} navigation modules={[Autoplay, Pagination, Navigation]} className="loc_slider">
                {anotherImagesState.map((item, index) => (
                  <SwiperSlide key={index}>
                    <img alt="_" className="loc_image" src={getAnotherImagesUrl(dataState, item, SIZES_ANOTHER.SIZE_1200)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          {dataState.video1 && (
            <video className="loc_video" controls>
              <source src={getVideoUrl(dataState, dataState.video1)} type="video/mp4" />
            </video>
          )}
          {dataState.video2 && (
            <video className="loc_video" controls>
              <source src={getVideoUrl(dataState, dataState.video2)} type="video/mp4" />
            </video>
          )}
          {dataState.video3 && (
            <video className="loc_video" controls>
              <source src={getVideoUrl(dataState, dataState.video3)} type="video/mp4" />
            </video>
          )}
        </div>
      )}
      <div className="loc_anotherTitle">Другие истории:</div>
      <div className="loc_list">
        <List excludeId={idState} />
      </div>
    </div>
  ) : null;
};

export default Story;
