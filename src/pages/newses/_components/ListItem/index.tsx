import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import PAGES from "routing/routes";
import { TItem } from "api/types/news";
import { getAnotherImagesUrl, getVideoUrl } from "helpers/news";
import { getDateString, getVideoType } from "helpers/common";
import { SIZES_ANOTHER } from "constants/photos";
import { NEWS_STATUS } from "constants/news";
import { isAdmin } from "utils/user";
import { loadItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import CopyLinkToPage from "components/CopyLinkToPage";
import MediaOriginalLinks from "components/MediaOriginalLinks";
import Tooltip from "components/Tooltip";
import PinIcon from "icons/pin.png";
import "./style.scss";

type TProps = {
  data: TItem;
};

const ListItem = ({ data }: TProps) => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const [isShowedState, setIsShowedState] = useState(false);
  const [anotherImagesState, setAnotherImagesState] = useState<false | number[]>(false);

  useEffect(() => {
    if (data && data.another_images) {
      setAnotherImagesState(JSON.parse(data.another_images));
    }
  }, [data]);

  return (
    <div
      className={cn("page-news_listItem", {
        "loc--isShowed": isShowedState,
        "loc--non_published": data.status === NEWS_STATUS.NON_PUBLISHED,
      })}
      onClick={() => !isShowedState && setIsShowedState(true)}
    >
      {data.status === NEWS_STATUS.NON_PUBLISHED && (
        <div className="loc_nonpublished">Не опубликован</div>
      )}
      {!!data.ismajor && (
        <div className="loc_pin">
          {" "}
          <Tooltip text="Закреплено" content={<img alt="загружаю" src={PinIcon} />} />
        </div>
      )}
      <div className="loc_created" onClick={() => isShowedState && setIsShowedState(false)}>
        {getDateString(data.created)}
      </div>
      <div className="loc_name" onClick={() => isShowedState && setIsShowedState(false)}>
        {data.name}
      </div>
      {isAdmin() && (
        <Button
          className="loc_redactButton"
          theme={ButtonThemes.PRIMARY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.ADMINISTRATION_NEWS_UPDATE}/${data.id}`);
          }}
        >
          Редактировать
        </Button>
      )}
      {isShowedState === true && (
        <div className="loc_description">
          <div
            className="loc_content wysiwyg_description"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          {!data.hide_album && !!anotherImagesState && !!anotherImagesState.length && (
            <Swiper
              slidesPerView={1}
              navigation
              modules={[Autoplay, Pagination, Navigation]}
              className="loc_slider"
            >
              {[...anotherImagesState].reverse().map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    alt="загружаю"
                    className="loc_image"
                    src={getAnotherImagesUrl(data, item, SIZES_ANOTHER.SIZE_1200)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {data.video1 && (
            <video className="loc_video" controls>
              <source src={getVideoUrl(data, data.video1)} type={getVideoType(data.video1)} />
            </video>
          )}
          {data.video2 && (
            <video className="loc_video" controls>
              <source src={getVideoUrl(data, data.video2)} type={getVideoType(data.video2)} />
            </video>
          )}
          {data.video3 && (
            <video className="loc_video" controls>
              <source src={getVideoUrl(data, data.video3)} type={getVideoType(data.video3)} />
            </video>
          )}
          <MediaOriginalLinks type="news" data={data} />
          <CopyLinkToPage
            targetText="на новость"
            text="Поделиться этой новостью с друзьями"
            url={`${window.location.origin + PAGES.NEWS}/${data.id}`}
          />
        </div>
      )}

      {isShowedState === false && (
        <>
          <div className="loc_short_description" onClick={() => setIsShowedState(true)}>
            {data.short_description}
          </div>
          <Button
            className="loc_moreButton"
            theme={ButtonThemes.GHOST}
            size={isMobile ? ButtonSizes.LARGE : ButtonSizes.SMALL}
            onClick={() => setIsShowedState(true)}
          >
            Подробнее
          </Button>
        </>
      )}
    </div>
  );
};

export default ListItem;
