/*
  import PetsList from 'pages/home/components/PetsList'
 */

import React, { useEffect, useState, useMemo } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Lazy } from "swiper";
import { useNavigate } from "react-router-dom";
import { AnimalsApi } from "api/animals";
import { getMainImageUrl, prepareStatus, prepareStatusCode } from "helpers/animals";

import { ANIMALS_STATUS } from "constants/animals";
import { TGetListOutput, TItem } from "api/types/animals";
import PAGES from "routing/routes";

import "./style.scss";
import { SIZES_MAIN } from "constants/photos";

type TProps = { currentId?: number | null };
const PetsList = ({ currentId = null }: TProps) => {
  const [listState, setListState] = useState<TGetListOutput>([]);
  const [initialSlideState, setInitialSlideState] = useState<number | null>(null);
  const navigate = useNavigate();
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  const itemsNumber = useMemo(() => (isMobileState ? 3 : 7), [isMobileState]);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

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
        {/*        <div
          className={`loc_name ${data.sex === 1 ? "loc--male" : "loc--female"}`}
          onClick={() => {
            navigate(`${PAGES.PET}/${data.id}`);
          }}
        >
          {data.name}
        </div> */}
        <div className={`loc_status loc--status_${prepareStatusCode(data.status, data.need_medicine)}`}>
          {prepareStatus(data.status, data.need_medicine, data.sex)}
        </div>
        <img
          alt="nophoto"
          data-src={index < itemsNumber + 1 ? undefined : getMainImageUrl(data, SIZES_MAIN.SQUARE2)}
          src={index > itemsNumber ? undefined : getMainImageUrl(data, SIZES_MAIN.SQUARE2)}
          onClick={() => {
            navigate(`${PAGES.PET}/${data.id}`);
          }}
          className="swiper-lazy"
          loading="lazy"
        />
      </div>
    </div>
  );

  useEffect(() => {
    if (isMobileState === null) return;
    AnimalsApi.getList({
      statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED],
      offset: 0,
      limit: 999,

      order: "id",
      order_type: "DESC",
    }).then((res) => {
      setListState(res);
    });
  }, [isMobileState]);

  return (
    <div className={cn("page-pet_petsList", { "loc--isMobile": isMobileState })}>
      {isMobileState !== null && initialSlideState !== null && (
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
