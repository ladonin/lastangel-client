import React, { useEffect, useMemo, useState } from "react";

import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Helmet } from "react-helmet";
import List from "pages/newses/_components/List";
import { TItem } from "api/types/news";
import PAGES from "routing/routes";
import { NewsApi } from "api/news";
import { getVideoUrl, getAnotherImagesUrl } from "helpers/news";
import BreadCrumbs from "components/BreadCrumbs";
import { NEWS_STATUS } from "constants/news";
import { isAdmin } from "utils/user";
import { getDateString, getVideoType } from "helpers/common";
import { SIZES_ANOTHER } from "constants/photos";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
// const OtherComponent = React.lazy(() => import('components/header'));
import { loadItem } from "utils/localStorage";
import CopyLinkToPage from "components/CopyLinkToPage";
import MediaOriginalLinks from "../../components/MediaOriginalLinks";
import "./style.scss";

const News: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMemo(() => loadItem("isMobile"), []);
  const [idState, setIdState] = useState<number | null>(null);
  const [dataState, setDataState] = useState<TItem | null>(null);
  const { id } = useParams();
  const { getMetatags } = useOutletContext<any>();
  const metatags = useMemo(() => {
    if (!dataState) return false;
    const data = getMetatags();
    return {
      title: data.news_title ? `${data.news_title}. ${dataState.name}` : dataState.name,
      description: data.news_description || "",
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
      NewsApi.get(idState).then((res) => {
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
      <div className="page-news">
        <BreadCrumbs title="Новости" />

        {dataState && (
          <div
            className={cn("loc_item", {
              "loc--non_published": dataState.status === NEWS_STATUS.NON_PUBLISHED,
            })}
          >
            {dataState.status === NEWS_STATUS.NON_PUBLISHED && (
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
                  navigate(`${PAGES.ADMINISTRATION_NEWS_UPDATE}/${dataState.id}`);
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
            <MediaOriginalLinks type="news" data={dataState} />
            <CopyLinkToPage
              targetText="на новость"
              text="Поделиться этой новостью с друзьями"
              url={`${window.location.origin + PAGES.NEWS}/${dataState.id}`}
            />
          </div>
        )}
        <div className="loc_anotherTitle">Другие новости:</div>
        <div className="loc_list">
          <List excludeId={idState} />
        </div>
      </div>
    </>
  ) : null;
};

export default News;
