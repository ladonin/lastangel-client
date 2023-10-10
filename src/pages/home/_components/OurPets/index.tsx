/*
  import OurPets from 'pages/home/components/OurPets'
 */

import React, { useEffect, useState, ReactElement, useMemo } from "react";

import "react-tabs/style/react-tabs.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Lazy, Navigation, Pagination } from "swiper";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import {
  getMainImageUrl,
  prepareSex,
  prepareStatus,
  prepareStatusCode,
  prepareAge,
  getCategoryCode,
} from "helpers/animals";
import { AnimalsApi } from "api/animals";

import { ANIMALS_CATEGORY, ANIMALS_STATUS } from "constants/animals";
import { TItem } from "api/types/animals";
import PAGES from "routing/routes";
import ArrowRight from "icons/arrowRight.svg";
import { capitalizeFirtsLetter, numberFriendly } from "helpers/common";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Tabs, { TTabs } from "components/Tabs";
import PuppyImg from "./images/puppy.jpg";
import KittenImg from "./images/kitten.jpg";
import DogImg from "./images/dog.jpg";
import CatImg from "./images/cat.jpg";
import OldDogImg from "./images/old_dog.jpg";
import OldCatImg from "./images/old_cat.jpg";

import "./style.scss";
import { SIZES_MAIN } from "../../../../constants/photos";

const OurPets = () => {
  const [tabsListState, setTabsListState] = useState<TTabs[]>([]);
  const [panelsListState, setPanelsListState] = useState<ReactElement[]>([]);
  const navigate = useNavigate();
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  const itemsNumber = useMemo(() => (isMobileState ? 2 : 4), [isMobileState]);
  const renderContent = (data: TItem, index: number) => (
    <div className="loc_wrapper">
      <div className="loc_image">
        <Link
          to={`${PAGES.PET}/${data.id}`}
          className={`loc_name link_text ${data.sex === 1 ? "loc--male" : "loc--female"}`}
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
            <img src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
          </Link>
        ) : (
          <Link to={`${PAGES.PET}/${data.id}`} className="link_img">
            <img
              alt="."
              data-src={getMainImageUrl(data, SIZES_MAIN.SQUARE)}
              className="swiper-lazy"
              loading="lazy"
            />
          </Link>
        )}
      </div>
      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobileState ? ButtonSizes.HUGE : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.PET}/${data.id}`);
          }}
        >
          Подробнее
        </Button>

        <div className="loc_data">
          <div className={`loc_sex ${data.sex === 1 ? "loc--male" : "loc--female"}`}>
            {capitalizeFirtsLetter(prepareSex(data.sex))}
          </div>
          , <div className="loc_age">{prepareAge(data.birthdate)}</div>
          <div className="loc_collected">
            Собрано за 30 дней: <span className="loc_val">{numberFriendly(data.collected)}</span>{" "}
            руб.
          </div>
          <div className="loc_description">{data.short_description}</div>
        </div>
      </div>
    </div>
  );

  const renderPanel = (list: TItem[]) => (
    <div>
      <Swiper
        spaceBetween={16}
        initialSlide={0}
        lazy={{
          enabled: true,
          loadPrevNext: true,
        }}
        slidesPerView={itemsNumber}
        navigation
        modules={[Lazy, Autoplay, Pagination, Navigation]}
        className="loc_slider"
      >
        {[...list].reverse().map((item, index) => (
          <SwiperSlide key={index}>{renderContent(item, index)}</SwiperSlide>
        ))}
        <SwiperSlide>
          <Link to={`${PAGES.PETS}`} className="loc_seeAll link_text">
            Смотреть все
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
  useEffect(() => {
    if (isMobileState === null) return;
    const tabsList: TTabs[] = [];
    const panelsList: ReactElement[] = [];

    AnimalsApi.getList({
      statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED],
      offset: 0,
      limit: 200,
      orderComplex: "ismajor asc, id asc",
    }).then((res) => {
      const puppies = res.filter(
        ({ kind, birthdate }) => getCategoryCode(kind, birthdate) === ANIMALS_CATEGORY.PUPPY
      );

      if (puppies.length) {
        tabsList.push({
          position: "left",
          render: (
            <>
              <img alt="." src={PuppyImg} height={50} />
              <div className="loc_categoryName">Щенки</div>
            </>
          ),
        });
        panelsList.push(renderPanel(puppies));
      }

      const dogs = res.filter(
        ({ kind, birthdate }) => getCategoryCode(kind, birthdate) === ANIMALS_CATEGORY.DOG
      );

      if (dogs.length) {
        tabsList.push({
          position: "left",
          render: (
            <>
              <img alt="." src={DogImg} height={50} />
              <div className="loc_categoryName">Собаки</div>
            </>
          ),
        });
        panelsList.push(renderPanel(dogs));
      }

      const oldDogs = res.filter(
        ({ kind, birthdate }) => getCategoryCode(kind, birthdate) === ANIMALS_CATEGORY.OLD_DOG
      );

      if (oldDogs.length) {
        tabsList.push({
          position: "left",
          render: (
            <>
              <img alt="." src={OldDogImg} height={50} />
              <div className="loc_categoryName">Пожилые собаки</div>
            </>
          ),
        });
        panelsList.push(renderPanel(oldDogs));
      }

      const oldCats = res.filter(
        ({ kind, birthdate }) => getCategoryCode(kind, birthdate) === ANIMALS_CATEGORY.OLD_CAT
      );

      if (oldCats.length) {
        tabsList.push({
          position: "right",
          render: (
            <>
              <img alt="." src={OldCatImg} height={50} />
              <div className="loc_categoryName">Пожилые кошки</div>
            </>
          ),
        });
        panelsList.push(renderPanel(oldCats));
      }

      const cats = res.filter(
        ({ kind, birthdate }) => getCategoryCode(kind, birthdate) === ANIMALS_CATEGORY.CAT
      );

      if (cats.length) {
        tabsList.push({
          position: "right",
          render: (
            <>
              <img alt="." src={CatImg} height={50} />
              <div className="loc_categoryName">Кошки</div>
            </>
          ),
        });
        panelsList.push(renderPanel(cats));
      }

      const kittens = res.filter(
        ({ kind, birthdate }) => getCategoryCode(kind, birthdate) === ANIMALS_CATEGORY.KITTEN
      );

      if (kittens.length) {
        tabsList.push({
          position: "right",
          render: (
            <>
              <img alt="." src={KittenImg} height={50} />
              <div className="loc_categoryName">Котята</div>
            </>
          ),
        });
        panelsList.push(renderPanel(kittens));
      }

      setTabsListState(tabsList);
      setPanelsListState(panelsList);
    });
  }, [isMobileState]);
  return (
    <div className={cn("page-home_ourPets", { "loc--isMobile": isMobileState })}>
      <div className="loc_title">
        <Link to={PAGES.PETS} className="loc_link">
          Наши питомцы
        </Link>
        <Link to={PAGES.PETS} className="link_text loc_seeAll">
          Смотреть все
          <ArrowRight />
        </Link>
      </div>
      <Tabs tabsList={tabsListState} panelsList={panelsListState} />
    </div>
  );
};

export default OurPets;
