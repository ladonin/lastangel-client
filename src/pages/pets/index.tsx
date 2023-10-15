import React, { useEffect, useState, useRef, useMemo } from "react";

import { Link, useNavigate } from "react-router-dom";
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
import Filter from "./_components/Filter";
// const OtherComponent = React.lazy(() => import('components/header'));
import { TFilterParams as TPetsFilterParams } from "../administration/pets/_components/Filter";
import "./style.scss";
import PetDonationIcon from "../../components/PetDonationIcon";
import { SIZES_MAIN } from "../../constants/photos";

const PETS_PAGESIZE = 20;
const Pets: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const petsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const petsFilterRef = useRef<TPetsFilterParams>(
    loadItem("pets_filter") || { statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED] }
  );

  // --> Сохранение состояния страницы
  const printRef = useRef<{
    list: TItemPet[] | null;
    page: number;
  } | null>(null);
  const needUsePrint = useRef<boolean>(useMemo(() => loadItem("usePrintInPets"), []));
  const petsPrint = useMemo(() => loadItem("petsPrint"), []);
  const [listPetsState, setListPetsState] = useState<TItemPet[] | null>(
    needUsePrint.current && petsPrint.list ? petsPrint.list : null
  );
  // <-- Сохранение состояния страницы
  
  const [myPetState, setMyPetState] = useState<TItemPet | null>(null);
  const [myPetIsLoadingState, setMyPetIsLoadingState] = useState<boolean>(false);
  const [petsPageState, setPetsPageState] = useState<number>(
    needUsePrint.current && petsPrint ? petsPrint.page : 1
  );

  // --> Сохранение состояния страницы
  const initRef = useRef<boolean>(true);

  const [isBlankState, setIsBlankState] = useState<boolean>(needUsePrint.current);
  const [listHeightState, setListHeightState] = useState<number | undefined>(
    (needUsePrint.current && petsPrint?.listHeight) || 0
  );
  const scrollTop = useRef<number>(0);
  const onScroll = () => {
    scrollTop.current = document.documentElement.scrollTop || document.body.scrollTop;
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const createPrint = () => {
    saveItem("petsPrint", {
      ...printRef.current,
      scroll: scrollTop.current,
      listHeight: document.getElementById("pets_list")?.offsetHeight || undefined,
    });
  };
  const createBack = () => {
    saveItem("backFromPet", true);
    createPrint();
  };
  useEffect(() => {
    printRef.current = {
      list: listPetsState,
      page: petsPageState,
    };
  }, [listPetsState, petsPageState]);

  useEffect(() => {
    setTimeout(() => {
      if (needUsePrint.current && printRef.current) {
        //
        setTimeout(() => {
          setIsBlankState(false);
        }, 0);

        setListHeightState(petsPrint.listHeight);

        window.scrollTo(0, petsPrint.scroll);
      }
    }, 0);

    return () => {
      saveItem("usePrintInPets", false);
    };
  }, []);
  // <-- Сохранение состояния страницы

  const query = useQueryHook();
  const [compactCuratoryState, setCompactCuratoryState] = useState<boolean>(
    loadItem("compactForCurator") || false
  );

  useEffect(() => {
    if (loadItem("myPet") && loadItem("myPet").created > getTimestamp(new Date()) - 3600 * 1000) {
      setMyPetState(loadItem("myPet").data);
    }
  }, []);

  useEffect(() => {
    query.get("curator") !== null &&
      typeof query.get("curator") !== "undefined" &&
      setCompactCuratoryState(false);
  }, [query]);

  useEffect(
    () => () => {
      saveItem("pets_filter", petsFilterRef.current);
    },
    []
  );

  const getData = (params?: TGetPetsListRequest) => {
    // --> Сохранение состояния страницы
    initRef.current = false;
    // <-- Сохранение состояния страницы

    petsLoadingStatusRef.current.isLoading = true;
    const { category, ...filter } = petsFilterRef.current;

    AnimalsApi.getList({ ...filter, ...params, orderComplex: "ismajor desc, id desc" }).then(
      (res) => {
        setListPetsState((prev) => (!prev || petsPageState === 1 ? res : [...prev, ...res]));
        petsLoadingStatusRef.current.isLoading = false;
        if (!res.length) {
          petsLoadingStatusRef.current.isOff = true;
        }
      }
    );
  };

  useEffect(() => {
    // --> Сохранение состояния страницы
    if (initRef.current && needUsePrint.current) return;
    // <-- Сохранение состояния страницы

    getData({ offset: (petsPageState - 1) * PETS_PAGESIZE, limit: PETS_PAGESIZE });
  }, [petsPageState]);

  const changeFilter = (filter: TPetsFilterParams) => {
    // --> Сохранение состояния страницы
    // При работе фильтра необходимость применения принта сбрасываем
    needUsePrint.current = false;
    saveItem("usePrintInPets", false);
    initRef.current = false;
    setListHeightState(0);
    // <-- Сохранение состояния страницы

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

  const isHere = (status: number) =>
    status !== ANIMALS_STATUS.AT_HOME && status !== ANIMALS_STATUS.DIED;
  const renderPetsContent = (data: TItemPet) => (
    <>
      <div className="loc_image">
        <Link onClick={createBack} to={`${PAGES.PET}/${data.id}`} className="link_img">
          <img alt="." src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
        </Link>

        {isHere(data.status) && (
          <div className="loc_donationIcon">
            <PetDonationIcon pet={data} />
          </div>
        )}
        {data.status === ANIMALS_STATUS.AT_HOME ? (
          <div className="loc_atHome">
            {prepareStatus(data.status, null, data.sex)} <img alt="." src={flowerSrc} />
          </div>
        ) : (
          <div
            className={`loc_status loc--status_${prepareStatusCode(
              data.status,
              data.need_medicine
            )}`}
          >
            {prepareStatus(data.status, data.need_medicine, data.sex)}
          </div>
        )}
      </div>

      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.PET}/${data.id}`);
            createBack();
          }}
        >
          Подробнее
        </Button>

        <div className="loc_data">
          <Link onClick={createBack} to={`${PAGES.PET}/${data.id}`} className="loc_name link_text">
            {data.name}
          </Link>
          ,{" "}
          <div className={`loc_sex ${data.sex === 1 ? "loc--male" : "loc--female"}`}>
            {prepareSex(data.sex)}
          </div>
          , <div className="loc_age">{prepareAge(data.birthdate)}</div>
          <div className="loc_parameters">
            {data.status !== ANIMALS_STATUS.AT_HOME && data.status !== ANIMALS_STATUS.DIED && (
              <>
                №{data.id},{" "}
                <span style={{ display: "inline-block" }}>
                  {prepareGraft(data.grafted, data.sex)}
                </span>
                ,{" "}
                <span style={{ display: "inline-block" }}>
                  {prepareSterilized(data.sterilized, data.sex)}
                </span>
                ,{" "}
              </>
            )}
            {data.breed || "порода неизвестна"}
          </div>
          {data.status !== ANIMALS_STATUS.AT_HOME && data.status !== ANIMALS_STATUS.DIED && (
            <div className="loc_collected">
              Собрано за месяц: <span className="loc_val">{numberFriendly(data.collected)}</span>{" "}
              руб.
            </div>
          )}
          <div className="loc_description">{data.short_description}</div>
        </div>
      </div>
    </>
  );

  const onReachPetsBottomHandler = () => {
    if (!petsLoadingStatusRef.current.isOff && !petsLoadingStatusRef.current.isLoading) {
      petsLoadingStatusRef.current.isLoading = true;
      // --> Сохранение состояния страницы
      initRef.current = false;
      // <-- Сохранение состояния страницы

      setPetsPageState((prev) => prev + 1);
    }
  };

  const getMyAnimalHandler = () => {
    setMyPetIsLoadingState(true);
    // "Мой питомец" устарел - обновляем его
    AnimalsApi.getMyAnimal().then((res) => {
      saveItem("myPet", { created: getTimestamp(new Date()), data: res });
      setMyPetState(res);
      setMyPetIsLoadingState(false);
    });
  };

  useEffect(() => {
    saveItem("compactForCurator", compactCuratoryState);
    if (compactCuratoryState) {
      navigate(PAGES.PETS);
    }
  }, [compactCuratoryState]);

  return (
    <div className="page-pets">
      {isBlankState && <div className="loc_blank" />}
      <BreadCrumbs title="Наши питомцы" />
      {!compactCuratoryState && (
        <div className="loc_forCurator">
          Вы можете сделать разовое пожертвование на питомца или жертвовать на его содержание
          ежемесячно любую сумму. Для этого Вам нужно выбрать питомца из списка и на его странице
          нажать кнопку <b>"Покормить"</b>
          <div style={{ marginTop: "16px" }}>
            Также вы можете{" "}
            <Link to={PAGES.CONTACTS} className="loc_linkToContacts link_3">
              связаться
            </Link>{" "}
            с нами с целью <strong>забрать питомца из приюта</strong>.
          </div>
          <div style={{ marginTop: "16px" }}>
            Если желаете выбрать питомца для кураторства/разовой помощи, то мы можем сделать этот
            выбор за Вас.
          </div>
          {myPetState === null && (
            <div className="loc_buttonWrapper">
              <Button
                className="loc_buttonSelectPet"
                isLoading={myPetIsLoadingState}
                theme={ButtonThemes.SUCCESS}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                onClick={getMyAnimalHandler}
              >
                Выбрать своего питомца
              </Button>
              <Button
                className="loc_buttonCompact"
                theme={ButtonThemes.GHOST_BORDER}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                onClick={() => setCompactCuratoryState(!compactCuratoryState)}
              >
                Закрыть
              </Button>
            </div>
          )}
          {myPetState !== null && (
            <div className="loc_myPet">
              <h2 className="loc_title">Ваш питомец</h2>

              <div className={cn("loc_wrapper ", `loc--status_${myPetState.status}`)}>
                <div className="loc_item">{renderPetsContent(myPetState)}</div>
              </div>
              <Button
                className="loc_buttonCompact"
                theme={ButtonThemes.GHOST_BORDER}
                size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
                onClick={() => setCompactCuratoryState(!compactCuratoryState)}
              >
                Закрыть
              </Button>
            </div>
          )}
        </div>
      )}
      {compactCuratoryState && (
        <Button
          className="loc_buttonOpenCuratory"
          theme={ButtonThemes.GHOST_BORDER}
          size={isMobile ? ButtonSizes.LARGE : ButtonSizes.SMALL}
          onClick={() => setCompactCuratoryState(false)}
        >
          Кураторство
        </Button>
      )}
      <Filter filter={petsFilterRef.current} onChange={changeFilter} />

      <div
        className="loc_list"
        id="pets_list"
        style={{ minHeight: listHeightState ? `${listHeightState}px` : 0 }}
      >
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
