/*
  import VolunteersList from 'pages/home/components/VolunteersList'
 */
import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Lazy } from "swiper";
import { Link } from "react-router-dom";
import { VolunteersApi } from "api/volunteers";
import { getMainImageUrl } from "helpers/volunteers";
import { TGetListOutput, TItem } from "api/types/volunteers";
import PAGES from "routing/routes";
import { loadItem } from "utils/localStorage";
import { SIZES_MAIN } from "constants/photos";
import "./style.scss";

type TProps = { currentId?: number | null };
const VolunteersList = ({ currentId = null }: TProps) => {
  const isMobile = loadItem("isMobile");
  const [listState, setListState] = useState<TGetListOutput>([]);
  const [initialSlideState, setInitialSlideState] = useState<number | null>(null);

  const itemsNumber = isMobile ? 3 : 7;

  useEffect(() => {
    let initialSlide = 0;
    let i = 0;
    if (listState.length && currentId !== null) {
      listState.map(({ id }) => {
        if (id === currentId) {
          initialSlide = i;
        }
        i++;
      });
      setInitialSlideState(initialSlide);
    }
  }, [listState]);

  const renderContent = (data: TItem, index: number) => (
    <div className="loc_wrapper">
      <div className="loc_image">
        <Link
          to={`${PAGES.VOLUNTEER}/${data.id}`}
          className={cn("loc_fio", "link_text", { "loc--selected": data.id === currentId })}
        >
          {data.fio}
        </Link>
        {index <= itemsNumber ? (
          <Link to={`${PAGES.VOLUNTEER}/${data.id}`} className="link_img">
            <img alt="загружаю" src={getMainImageUrl(data, SIZES_MAIN.SQUARE2)} />
          </Link>
        ) : (
          <Link to={`${PAGES.VOLUNTEER}/${data.id}`} className="link_img">
            <img
              alt="загружаю"
              data-src={getMainImageUrl(data, SIZES_MAIN.SQUARE2)}
              className="swiper-lazy"
              loading="lazy"
            />
          </Link>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    VolunteersApi.getList({
      offset: 0,
      limit: 999,
      orderComplex: "id desc",
    }).then((res) => {
      setListState(res);
    });
  }, []);

  return (
    <div className={cn("page-volunteer_volunteersList", { "loc--isMobile": isMobile })}>
      {isMobile !== null && initialSlideState !== null && (
        <Swiper
          spaceBetween={12}
          initialSlide={initialSlideState}
          lazy={{
            enabled: true,
            loadPrevNext: true,
          }}
          loop={listState.length > itemsNumber}
          threshold={10}
          slidesPerView={itemsNumber}
          navigation
          modules={[Lazy, Pagination, Navigation]}
          className="loc_slider"
        >
          {listState.map((item, index) => (
            <SwiperSlide key={index}>{renderContent(item, index)}</SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default VolunteersList;
