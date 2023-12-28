/*
  import PetsList from 'pages/home/components/PetsList'
 */

import React, { useEffect, useState, useMemo } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Lazy } from "swiper";
import { Link } from "react-router-dom";
import { AnimalsApi } from "api/animals";
import { getMainImageUrl, prepareStatus, prepareStatusCode } from "helpers/animals";
import { ANIMALS_STATUS } from "constants/animals";
import { TGetListOutput, TItem } from "api/types/animals";
import PAGES from "routing/routes";
import { loadItem } from "utils/localStorage";
import { SIZES_MAIN } from "constants/photos";
import "./style.scss";

type TProps = { currentId?: number | null };
const PetsList = ({ currentId = null }: TProps) => {
  const [listState, setListState] = useState<TGetListOutput>([]);
  const [initialSlideState, setInitialSlideState] = useState<number | null>(null);
  const isMobile = useMemo(() => loadItem("isMobile"), []);

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
          to={`${PAGES.PET}/${data.id}`}
          className={cn("loc_name", "link_text", { "loc--selected": data.id === currentId })}
        >
          {data.name}
        </Link>
        <div
          className={`loc_status loc--status_${prepareStatusCode(data.status, data.need_medicine)}`}
        >
          {prepareStatus(data.status, data.need_medicine, data.sex)}
        </div>

        {index <= itemsNumber ? (
          <Link to={`${PAGES.PET}/${data.id}`} className="link_img">
            <img alt="загружаю" src={getMainImageUrl(data, SIZES_MAIN.SQUARE2)} />
          </Link>
        ) : (
          <Link to={`${PAGES.PET}/${data.id}`} className="link_img">
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
    AnimalsApi.getList({
      statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED],
      offset: 0,
      limit: 999,
      orderComplex: "ismajor desc, id desc",
    }).then((res) => {
      setListState(res);
    });
  }, []);

  return (
    <div className={cn("page-pet_petsList", { "loc--isMobile": isMobile })}>
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

export default PetsList;
