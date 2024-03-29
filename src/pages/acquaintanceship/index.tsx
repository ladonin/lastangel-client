/*
  import Acquaintanceship from 'pages/acquaintanceship'
  Страница знакомства с приютом
 */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Helmet } from "react-helmet";

import PAGES from "routing/routes";
import { TItem } from "api/types/acquaintanceship";
import { AcquaintanceshipApi } from "api/acquaintanceship";
import { getVideoUrl, getAnotherImagesUrl } from "helpers/acquaintanceship";
import { getVideoType } from "helpers/common";
import { isAdmin } from "utils/user";
import { loadItem } from "utils/localStorage";
import { SIZES_ANOTHER } from "constants/photos";
import { ACQUAINTANCESHIP_STATUS } from "constants/acquaintanceship";
import BreadCrumbs from "components/BreadCrumbs";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import CopyLinkToPage from "components/CopyLinkToPage";
import MediaOriginalLinks from "components/MediaOriginalLinks";
import "./style.scss";

const Acquaintanceship: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const { getMetatags } = useOutletContext<any>();
  const [dataState, setDataState] = useState<TItem | null>(null);
  const [anotherImagesState, setAnotherImagesState] = useState<false | number[]>(false);

  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.acquaintanceship_title || "",
      description: data.acquaintanceship_description || "",
    };
  }, []);

  useEffect(() => {
    AcquaintanceshipApi.get().then((res) => {
      setDataState(res);
    });
  }, []);

  useEffect(() => {
    if (dataState && dataState.another_images) {
      setAnotherImagesState(JSON.parse(dataState.another_images));
    }
  }, [dataState]);

  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-acquaintanceship">
        <BreadCrumbs title="О приюте" />
        {dataState && dataState.status === ACQUAINTANCESHIP_STATUS.NON_PUBLISHED && (
          <div className="loc_inredact">Текст находится в редактировании ((</div>
        )}

        {dataState && dataState.status === ACQUAINTANCESHIP_STATUS.PUBLISHED && (
          <div className={cn("loc_item")}>
            {isAdmin() && (
              <Button
                className="loc_redactButton"
                theme={ButtonThemes.PRIMARY}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
                onClick={() => {
                  navigate(`${PAGES.ADMINISTRATION_ACQUAINTANCESHIP_UPDATE}`);
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
            <MediaOriginalLinks type="acquaintanceship" data={dataState} />
            <CopyLinkToPage
              targetText="на историю"
              text="Поделиться этой историей с друзьями"
              url={`${window.location.origin + PAGES.ACQUAINTANCESHIP}/${dataState.id}`}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Acquaintanceship;
