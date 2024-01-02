/*
  import Slider from 'pages/documents/_components/Slider'
  Слайдер для страницы "Документы"
 */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination, Lazy } from "swiper";
import { loadItem } from "utils/localStorage";
import { getAnotherImagesUrl } from "helpers/documents";
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/documents";
import { DocumentsApi } from "api/documents";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import "./style.scss";

const Slider = () => {
  const isMobile = loadItem("isMobile");
  const [dataState, setDataState] = useState<(TGetResponseItem & { data: number[] }) | null>(null);

  const renderButton = (link: string) => (
    <Button
      className="loc_openButton"
      theme={ButtonThemes.SUCCESS}
      size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
      onClick={() => {
        window.open(link, "_blank");
      }}
    >
      Открыть
    </Button>
  );

  useEffect(() => {
    DocumentsApi.get().then((res) => {
      res && setDataState({ ...res, data: JSON.parse(res.another_images) });
    });
  }, []);

  return (
    <Swiper
      spaceBetween={30}
      loop
      centeredSlides
      initialSlide={0}
      lazy={{
        enabled: true,
        loadPrevNext: true,
      }}
      autoplay={{
        delay: 122500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation
      modules={[Lazy, Autoplay, Pagination, Navigation]}
      className="page-documents_photoSlider"
    >
      {dataState === null && (
        <SwiperSlide>
          <div className="loc_wait" />
        </SwiperSlide>
      )}
      {dataState &&
        !!dataState.data.length &&
        [...dataState.data].reverse().map((number, index) => (
          <SwiperSlide>
            {index < 3 ? (
              <>
                <img
                  alt="загружаю"
                  src={getAnotherImagesUrl(dataState, number, SIZES_ANOTHER.SIZE_1200)}
                />
                {renderButton(getAnotherImagesUrl(dataState, number))}
              </>
            ) : (
              <>
                <img
                  alt="загружаю"
                  data-src={getAnotherImagesUrl(dataState, number, SIZES_ANOTHER.SIZE_1200)}
                  className="swiper-lazy"
                  loading="lazy"
                />
                {renderButton(getAnotherImagesUrl(dataState, number))}
              </>
            )}
          </SwiperSlide>
        ))}
    </Swiper>
  );
};
export default Slider;
