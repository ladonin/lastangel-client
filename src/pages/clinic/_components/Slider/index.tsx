/*
  import Slider from 'pages/clinic/_components/Slider'
  Слайдер для страницы "Клиника"
 */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination, Lazy } from "swiper";
import { getAnotherImagesUrl } from "helpers/clinicPhotos";
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/clinicPhotos";
import { ClinicPhotosApi } from "api/clinicPhotos";
import "./style.scss";

const Slider = () => {
  const [dataState, setDataState] = useState<(TGetResponseItem & { data: number[] }) | null>(null);

  useEffect(() => {
    ClinicPhotosApi.get().then((res) => {
      setDataState({ ...res, data: JSON.parse(res.another_images) });
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
      className="page-clinic_photoSlider"
    >
      {dataState === null && (
        <SwiperSlide>
          <div className="loc_wait" />
        </SwiperSlide>
      )}
      {dataState &&
        !!dataState.data.length &&
        [...dataState.data].reverse().map((number, index) => (
          <SwiperSlide key={index}>
            {index < 3 ? (
              <>
                <img
                  alt="nophoto"
                  src={getAnotherImagesUrl(dataState, number, SIZES_ANOTHER.SIZE_1200)}
                />
              </>
            ) : (
              <>
                <img
                  alt="nophoto"
                  data-src={getAnotherImagesUrl(dataState, number, SIZES_ANOTHER.SIZE_1200)}
                  className="swiper-lazy"
                  loading="lazy"
                />
              </>
            )}
          </SwiperSlide>
        ))}
    </Swiper>
  );
};
export default Slider;
