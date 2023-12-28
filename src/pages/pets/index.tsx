import React, { useEffect, useState, useRef, useMemo } from "react";

import { Link, useNavigate, useOutletContext } from "react-router-dom";
import cn from "classnames";

import { Helmet } from "react-helmet";
import { TGetListRequest, TItem } from "api/types/animals";
import PAGES from "routing/routes";
import { AnimalsApi } from "api/animals";
import { getTimestamp, numberFriendly, objectsAreEqual } from "helpers/common";
import {
  getMainImageUrl,
  prepareStatus,
  prepareStatusCode,
  prepareAge,
  prepareGraft,
  prepareSex,
  prepareSterilized,
  transformCategoryToParams,
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

// const OtherComponent = React.lazy(() => import('components/header'));
import { TFilterParams } from "../administration/pets/_components/Filter";
import "./style.scss";
import PetDonationIcon from "../../components/PetDonationIcon";
import { SIZES_MAIN } from "../../constants/photos";
import Filter from "./_components/Filter";

const PAGESIZE = 20;

const preparePetsSavedFilter = () => {
  const savedFilter = loadItem("pets_filter");
  if (!savedFilter) return undefined;
  return {
    ...savedFilter,
    ...(savedFilter.category ? transformCategoryToParams(savedFilter.category) : {}),
  };
};

const Pets: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMemo(() => loadItem("isMobile"), []);
  const { getMetatags } = useOutletContext<any>();
  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.pets_title || "",
      description: data.pets_description || "",
    };
  }, []);
  const loadingStatusRef = useRef({ isLoading: false, isOff: false });

  const filterRef = useRef<TFilterParams>(
    preparePetsSavedFilter() || { statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED] }
  );

  // --> Сохранение состояния страницы
  const printRef = useRef<{
    list: TItem[] | null;
    page: number;
  } | null>(null);
  const needUsePrint = useRef<boolean>(useMemo(() => loadItem("usePrintInPets"), []));
  const print = useMemo(() => loadItem("print"), []);
  const [listState, setListState] = useState<TItem[] | null>(
    needUsePrint.current && print.list ? print.list : null
  );
  // <-- Сохранение состояния страницы

  const [myPetState, setMyPetState] = useState<TItem | null>(null);
  const [myPetIsLoadingState, setMyPetIsLoadingState] = useState<boolean>(false);
  const [pageState, setPageState] = useState<number>(
    needUsePrint.current && print ? print.page : 1
  );

  // --> Сохранение состояния страницы
  const initRef = useRef<boolean>(true);

  const [isBlankState, setIsBlankState] = useState<boolean>(needUsePrint.current);
  const [listHeightState, setListHeightState] = useState<number | undefined>(
    (needUsePrint.current && print?.listHeight) || 0
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
      list: listState,
      page: pageState,
    };
  }, [listState, pageState]);

  useEffect(() => {
    setTimeout(() => {
      if (needUsePrint.current && printRef.current) {
        setTimeout(() => {
          setIsBlankState(false);
        }, 0);

        setListHeightState(print.listHeight);

        window.scrollTo(0, print.scroll);
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
      saveItem("pets_filter", filterRef.current);
    },
    []
  );

  const getData = (params?: TGetListRequest) => {
    // --> Сохранение состояния страницы
    initRef.current = false;
    // <-- Сохранение состояния страницы

    loadingStatusRef.current.isLoading = true;
    const { category, ...filter } = filterRef.current;

    AnimalsApi.getList({ ...filter, ...params, orderComplex: "ismajor desc, id desc" }).then(
      (res) => {
        setListState((prev) => (!prev || pageState === 1 ? res : [...prev, ...res]));
        loadingStatusRef.current.isLoading = false;
        if (!res.length) {
          loadingStatusRef.current.isOff = true;
        }
      }
    );
  };

  useEffect(() => {
    // --> Сохранение состояния страницы
    if (initRef.current && needUsePrint.current) return;
    // <-- Сохранение состояния страницы

    getData({ offset: (pageState - 1) * PAGESIZE, limit: PAGESIZE });
  }, [pageState]);

  const changeFilter = (filter: TFilterParams) => {
    if (objectsAreEqual(filter, filterRef.current)) return;

    // --> Сохранение состояния страницы
    // При работе фильтра необходимость применения принта сбрасываем
    needUsePrint.current = false;
    saveItem("usePrintInPets", false);
    initRef.current = false;
    setListHeightState(0);
    // <-- Сохранение состояния страницы

    loadingStatusRef.current.isOff = false;
    filterRef.current = filter;
    if (filter.status) {
      filterRef.current.statusExclude = undefined;
    } else {
      filterRef.current.statusExclude = [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED];
    }

    if (pageState === 1) {
      getData({ offset: 0, limit: PAGESIZE });
    } else {
      setPageState(1);
    }
  };

  const isHere = (status: number) =>
    status !== ANIMALS_STATUS.AT_HOME && status !== ANIMALS_STATUS.DIED;
  const renderContent = (data: TItem) => (
    <>
      <div className="loc_image">
        <Link onClick={createBack} to={`${PAGES.PET}/${data.id}`} className="link_img">
          <img alt="загружаю" src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
        </Link>

        {isHere(data.status) && (
          <div className="loc_donationIcon">
            <PetDonationIcon 
              
              
              
              
              pet={data} />
          </div>
        )}
        {data.status === ANIMALS_STATUS.AT_HOME ? (
          <div className="loc_atHome">
            {prepareStatus(data.status, null, data.sex)} <img alt="загружаю" src={flowerSrc} />
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

  const onReachBottomHandler = () => {
    if (!loadingStatusRef.current.isOff && !loadingStatusRef.current.isLoading) {
      loadingStatusRef.current.isLoading = true;
      // --> Сохранение состояния страницы
      initRef.current = false;
      // <-- Сохранение состояния страницы

      setPageState((prev) => prev + 1);
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
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
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
                  <div className="loc_item">{renderContent(myPetState)}</div>
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
        <Filter filter={filterRef.current} onChange={changeFilter} />

        <div
          className="loc_list"
          id="pets_list"
          style={{ minHeight: listHeightState ? `${listHeightState}px` : 0 }}
        >
          {listState &&
            listState.map((item, index) => (
              <div key={index} className={cn("loc_wrapper ", `loc--status_${item.status}`)}>
                <div className="loc_item">{renderContent(item)}</div>
              </div>
            ))}
          <InfiniteScroll onReachBottom={onReachBottomHandler} amendment={100} />
          {listState && !listState.length && <NotFound />}
          {listState === null && <LoaderIcon />}
        </div>
      </div>
    </>
  );
};

export default Pets;
