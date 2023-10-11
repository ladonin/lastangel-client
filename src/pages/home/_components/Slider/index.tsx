/*
  import Slider from 'pages/home/components/Slider'
 */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination, Lazy } from "swiper";
import { getAnotherImagesUrl } from "helpers/mainphotoalbum";
import { SIZES_ANOTHER } from "constants/photos";
import { TGetResponseItem } from "api/types/mainphotoalbum";
import { MainPhotoalbumApi } from "api/mainphotoalbum";
import albumImg1 from "./images/mainAlbum-1.jpg";
import albumImg2 from "./images/mainAlbum-2.jpg";
import albumImg15 from "./images/mainAlbum-15.jpg";
import "./style.scss";
import MediaOriginalLinks from "../../../../components/MediaOriginalLinks";

const Slider = () => {
  const [dataState, setDataState] = useState<(TGetResponseItem & { data: number[] }) | null>(null);

  useEffect(() => {
    MainPhotoalbumApi.get().then((res) => {
      res && setDataState({ ...res, data: JSON.parse(res.another_images) });
    });
  }, []);

  return (
    <div className="page-home_photoSlider">
      <div className="loc_wrapper">
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
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation
        modules={[Lazy, Autoplay, Pagination, Navigation]}
        className="loc_slider"
      >
        {dataState === null && (
          <SwiperSlide>
            <div className="loc_wait" />
          </SwiperSlide>
        )}
        {dataState &&
          !!dataState.data.length &&
          [...dataState.data]
            .reverse()
            .map((number, index) => (
              <SwiperSlide key={index}>
                {index < 3 ? (
                  <img
                    alt="."
                    src={getAnotherImagesUrl(dataState, number, SIZES_ANOTHER.SIZE_1200)}
                  />
                ) : (
                  <img
                    alt="."
                    data-src={getAnotherImagesUrl(dataState, number, SIZES_ANOTHER.SIZE_1200)}
                    className="swiper-lazy"
                    loading="lazy"
                  />
                )}
              </SwiperSlide>
            ))}
        {dataState && !dataState.data.length && (
          <>
            <SwiperSlide>
              <img alt="." src={albumImg2} />
            </SwiperSlide>
            <SwiperSlide>
              <img alt="." src={albumImg15} />
            </SwiperSlide>
            <SwiperSlide>
              <img alt="." src={albumImg1} />
            </SwiperSlide>
          </>
        )}
      </Swiper>
      </div>
      <MediaOriginalLinks type="mainphotoalbum" data={dataState as any} />
    </div>
  );
};
export default Slider;
