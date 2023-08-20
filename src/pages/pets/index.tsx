import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import { TGetListRequest as TGetPetsListRequest, TItem as TItemPet } from "api/types/animals";
import PAGES from "routing/routes";
import { AnimalsApi } from "api/animals";
import { getTimestamp, numberFriendly } from "helpers/common";
import {
  getMainImageUrl,
  prepareStatus,
  prepareStatusCode,
  prepareAge,
  prepareGraft,
  prepareSex,
  prepareSterilized,
} from "helpers/animals";
import NotFound from "components/NotFound";
import { useQueryHook } from "hooks/useQueryHook";
import InfiniteScroll from "components/InfiniteScroll";
import BreadCrumbs from "components/BreadCrumbs";
import flowerSrc from "icons/flower1.png";
import { ANIMALS_STATUS } from "constants/animals";
import { loadItem, saveItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import LoaderIcon from "components/LoaderIcon";
import { TFilterParams as TPetsFilterParams } from "../administration/pets/_components/Filter";
import Filter from "./_components/Filter";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

const PETS_PAGESIZE = 20;
const Pets: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);
  const petsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const petsFilterRef = useRef<TPetsFilterParams>(
    loadItem("pets_filter") || { statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED] }
  );
  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  const [listPetsState, setListPetsState] = useState<TItemPet[] | null>(null);
  const [myPetState, setMyPetState] = useState<TItemPet | null>(null);
  const [myPetIsLoadingState, setMyPetIsLoadingState] = useState<boolean>(false);
  const [petsPageState, setPetsPageState] = useState<number>(1);

  const query = useQueryHook();

  const [isCuratoryState, setIsCuratoryState] = useState<boolean>(true);
  useEffect(() => {
    query.get("curator") !== null && typeof query.get("curator") !== "undefined" && setIsCuratoryState(true);
  }, [query]);

  useEffect(
    () => () => {
      saveItem("pets_filter", petsFilterRef.current);
    },
    []
  );

  const getData = (params?: TGetPetsListRequest) => {
    petsLoadingStatusRef.current.isLoading = true;
    AnimalsApi.getList({ ...petsFilterRef.current, ...params, order: "id", order_type: "DESC" }).then((res) => {
      setListPetsState((prev) => (!prev || petsPageState === 1 ? res : [...prev, ...res]));
      petsLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        petsLoadingStatusRef.current.isOff = true;
      }
    });
  };

  useEffect(() => {
    getData({ offset: (petsPageState - 1) * PETS_PAGESIZE, limit: PETS_PAGESIZE });
  }, [petsPageState]);

  const changeFilter = (filter: TPetsFilterParams) => {
    petsLoadingStatusRef.current.isOff = false;
    petsFilterRef.current = filter;

    if (filter.status) {
      petsFilterRef.current.statusExclude = undefined;
    } else {
      petsFilterRef.current.statusExclude = [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED];
    }

    if (petsPageState === 1) {
      getData({ offset: 0, limit: PETS_PAGESIZE });
    } else {
      setPetsPageState(1);
    }
  };

  const renderPetsContent = (data: TItemPet) => (
    <>
      <div className="loc_image">
        <img
          alt="nophoto"
          src={getMainImageUrl(data)}
          onClick={() => {
            navigate(`${PAGES.PET}/${data.id}`);
          }}
        />
        {data.status === ANIMALS_STATUS.AT_HOME ? (
          <div className="loc_atHome">
            {prepareStatus(data.status, null, data.sex)} <img alt="nophoto" src={flowerSrc} />
          </div>
        ) : (
          <div className={`loc_status loc--status_${prepareStatusCode(data.status, data.need_medicine)}`}>
            {prepareStatus(data.status, data.need_medicine, data.sex)}
          </div>
        )}
      </div>

      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.PET}/${data.id}`);
          }}
        >
          Подробнее
        </Button>

        <div className="loc_data">
          <div className="loc_name">{data.name}</div>,{" "}
          <div className={`loc_sex ${data.sex === 1 ? "loc--male" : "loc--female"}`}>{prepareSex(data.sex)}</div>,{" "}
          <div className="loc_age">{prepareAge(data.birthdate)}</div>
          <div className="loc_parameters">
            {data.status !== ANIMALS_STATUS.AT_HOME && data.status !== ANIMALS_STATUS.DIED && (
              <>
                №{data.id}, <span style={{ display: "inline-block" }}>{prepareGraft(data.grafted, data.sex)}</span>,{" "}
                <span style={{ display: "inline-block" }}>{prepareSterilized(data.sterilized, data.sex)}</span>,{" "}
              </>
            )}
            {data.breed || "порода неизвестна"}
          </div>
          {data.status !== ANIMALS_STATUS.AT_HOME && data.status !== ANIMALS_STATUS.DIED && (
            <div className="loc_collected">
              Собрано за 30 дней: <span className="loc_val">{numberFriendly(data.collected)}</span> руб.
            </div>
          )}
          <div className="loc_description">{data.short_description}</div>
        </div>
      </div>
    </>
  );

  const onReachPetsBottomHandler = () => {
    !petsLoadingStatusRef.current.isOff && !petsLoadingStatusRef.current.isLoading && setPetsPageState((prev) => prev + 1);
  };
  // продолжить с шапки
  const getMyAnimalHandler = () => {
    const myPet = loadItem("myPet");
    if (!myPet?.created || myPet.created < getTimestamp(new Date()) - 3600 * 1000) {
      setMyPetIsLoadingState(true);
      // "Мой питомец" устарел - обновляем его
      AnimalsApi.getMyAnimal().then((res) => {
        saveItem("myPet", { created: getTimestamp(new Date()), data: res });
        setMyPetState(res);
        setMyPetIsLoadingState(false);
      });
    } else {
      setMyPetState(myPet.data);
    }
  };

  return (
    <div className="page-pets">
      <BreadCrumbs title="Наши питомцы" />
      {isCuratoryState && (
        <div className="loc_forCurator">
          Вы можете сделать разовое пожертвование на питомца или жертвовать на его содержание ежемесячно любую сумму. Для этого
          Вам нужно выбрать питомца из списка и на его странице нажать кнопку "Помочь"
          <div style={{ marginTop: "16px" }}>
            Также вы можете{" "}
            <span
              className="loc_linkToContacts"
              onClick={() => {
                navigate(PAGES.CONTACTS);
              }}
            >
              связаться
            </span>{" "}
            с нами с целью <strong>забрать питомца из приюта</strong>.
          </div>
          <div style={{ marginTop: "16px" }}>
            Если желаете выбрать питомца для кураторства/разовой помощи, то мы можем сделать этот выбор за Вас.
          </div>
          {isMobileState !== null && (
            <div className="loc_buttonWrapper">
              <Button
                className="loc_buttonSelectPet"
                isLoading={myPetIsLoadingState}
                theme={ButtonThemes.SUCCESS}
                size={isMobileState ? ButtonSizes.HUGE : ButtonSizes.MEDIUM}
                onClick={getMyAnimalHandler}
              >
                Выбрать своего питомца
              </Button>
            </div>
          )}
          {myPetState !== null && (
            <div className="loc_myPet">
              <h2 className="loc_title">Ваш питомец</h2>

              <div className={cn("loc_wrapper ", `loc--status_${myPetState.status}`)}>
                <div className="loc_item">{renderPetsContent(myPetState)}</div>
              </div>
            </div>
          )}
        </div>
      )}
      <Filter filter={petsFilterRef.current} onChange={changeFilter} />

      <div className="loc_list">
        {listPetsState &&
          listPetsState.map((item, index) => (
            <div key={index} className={cn("loc_wrapper ", `loc--status_${item.status}`)}>
              <div className="loc_item">{renderPetsContent(item)}</div>
            </div>
          ))}
        <InfiniteScroll onReachBottom={onReachPetsBottomHandler} amendment={100} />
        {listPetsState && !listPetsState.length && <NotFound />}
        {listPetsState === null && <LoaderIcon />}
      </div>
    </div>
  );
};

export default Pets;
