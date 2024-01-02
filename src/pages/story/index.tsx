/*
  import Story from 'pages/story'
  Страница просмотра истории
 */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Helmet } from "react-helmet";

import PAGES from "routing/routes";
import List from "pages/stories/_components/List";
import { TItem } from "api/types/stories";
import { StoriesApi } from "api/stories";
import { getDateString, getVideoType } from "helpers/common";
import { getVideoUrl, getAnotherImagesUrl } from "helpers/stories";
import { STORIES_STATUS } from "constants/stories";
import { SIZES_ANOTHER } from "constants/photos";
import { isAdmin } from "utils/user";
import { loadItem } from "utils/localStorage";
import CopyLinkToPage from "components/CopyLinkToPage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import BreadCrumbs from "components/BreadCrumbs";
import MediaOriginalLinks from "components/MediaOriginalLinks";
import "./style.scss";

const Story: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const { id } = useParams();
  const { getMetatags } = useOutletContext<any>();

  const [idState, setIdState] = useState<number | null>(null);
  const [dataState, setDataState] = useState<TItem | null>(null);

  const metatags = useMemo(() => {
    if (!dataState) return false;
    const data = getMetatags();
    return {
      title: data.story_title ? `${data.story_title}. ${dataState.name}` : dataState.name,
      description: data.story_description || "",
    };
  }, [dataState]);
  const [anotherImagesState, setAnotherImagesState] = useState<false | number[]>(false);

  useEffect(() => {
    if (dataState && dataState.another_images) {
      setAnotherImagesState(JSON.parse(dataState.another_images));
    }
  }, [dataState]);

  useEffect(() => {
    id && setIdState(Number(id));
  }, [id]);

  useEffect(() => {
    idState &&
      StoriesApi.get(idState).then((res) => {
        if (res === null) {
          navigate(PAGES.PAGE_404);
        }
        setDataState(res);
      });
  }, [idState]);

  return idState ? (
    <>
      {metatags && (
        <Helmet>
          <title>{metatags.title}</title>
          <meta name="description" content={metatags.description} />
        </Helmet>
      )}
      <div className="page-story">
        <BreadCrumbs title="Истории" />

        {dataState && (
          <div
            className={cn("loc_item", {
              "loc--non_published": dataState.status === STORIES_STATUS.NON_PUBLISHED,
            })}
          >
            {dataState.status === STORIES_STATUS.NON_PUBLISHED && (
              <div className="loc_nonpublished">Не опубликован</div>
            )}
            <div className="loc_created">{getDateString(dataState.created)}</div>
            <div className="loc_name">{dataState.name}</div>
            {isAdmin() && (
              <Button
                className="loc_redactButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
                onClick={() => {
                  navigate(`${PAGES.ADMINISTRATION_STORY_UPDATE}/${dataState.id}`);
                }}
              >
                Редактировать
              </Button>
            )}
            <div className="loc_description">
              <div
                className="loc_content wysiwyg_description"
                dangerouslySetInnerHTML={{
                  __html:
                    isMobile && !!dataState.use_mobile_description
                      ? dataState.mobile_description
                      : dataState.description,
                }}
              />

              {!dataState.hide_album && !!anotherImagesState && !!anotherImagesState.length && (
                <Swiper
                  slidesPerView={1}
                  navigation
                  modules={[Autoplay, Pagination, Navigation]}
                  className="loc_slider"
                >
                  {anotherImagesState.map((item, index) => (
                    <SwiperSlide key={index}>
                      <img
                        alt="_"
                        className="loc_image"
                        src={getAnotherImagesUrl(dataState, item, SIZES_ANOTHER.SIZE_1200)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
            {dataState.video1 && (
              <video className="loc_video" controls>
                <source
                  src={getVideoUrl(dataState, dataState.video1)}
                  type={getVideoType(dataState.video1)}
                />
              </video>
            )}
            {dataState.video2 && (
              <video className="loc_video" controls>
                <source
                  src={getVideoUrl(dataState, dataState.video2)}
                  type={getVideoType(dataState.video2)}
                />
              </video>
            )}
            {dataState.video3 && (
              <video className="loc_video" controls>
                <source
                  src={getVideoUrl(dataState, dataState.video3)}
                  type={getVideoType(dataState.video3)}
                />
              </video>
            )}
            <MediaOriginalLinks type="stories" data={dataState} />
            <CopyLinkToPage
              targetText="на историю"
              text="Поделиться этой историей с друзьями"
              url={`${window.location.origin + PAGES.STORY}/${dataState.id}`}
            />
          </div>
        )}
        <div className="loc_anotherTitle">Другие истории:</div>
        <div className="loc_list">
          <List excludeId={idState} />
        </div>
      </div>
    </>
  ) : null;
};

export default Story;
