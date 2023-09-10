/*
  import Slider from 'pages/documents/components/Slider'
 */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination, Lazy } from "swiper";
import { isMobile } from "react-device-detect";
import { getAnotherImagesUrl } from "helpers/documents";
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/documents";
import { DocumentsApi } from "api/documents";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import "./style.scss";

const Slider = () => {
  const [dataState, setDataState] = useState<(TGetResponseItem & { data: number[] }) | null>(null);

  useEffect(() => {
    DocumentsApi.get().then((res) => {
      setDataState({ ...res, data: JSON.parse(res.another_images) });
    });
  }, []);
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);
  const renderButton = (link: string) => (
    <Button
      className="loc_openButton"
      theme={ButtonThemes.SUCCESS}
      size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
      onClick={() => {
        window.open(link, "_blank");
      }}
    >
      Открыть
    </Button>
  );

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
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
                <img alt="nophoto" src={getAnotherImagesUrl(dataState, number, SIZES_ANOTHER.SIZE_1200)} />
                {renderButton(getAnotherImagesUrl(dataState, number))}
              </>
            ) : (
              <>
                <img
                  alt="nophoto"
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
