import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet";
import { TGetListRequest, TItem } from "api/types/volunteers";
import PAGES from "routing/routes";
import { VolunteersApi } from "api/volunteers";
import { getMainImageUrl } from "helpers/volunteers";
import NotFound from "components/NotFound";
import InfiniteScroll from "components/InfiniteScroll";
import BreadCrumbs from "components/BreadCrumbs";
import { loadItem, saveItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import LoaderIcon from "components/LoaderIcon";
import { SIZES_MAIN } from "constants/photos";
import Filter, { TFilterParams } from "./_components/Filter";
import "./style.scss";

const PAGESIZE = 20;
const Volunteers: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const { getMetatags } = useOutletContext<any>();
  const metatags = useMemo(() => {
    const data = getMetatags();

    return {
      title: data.volunteers_title || "",
      description: data.volunteers_description || "",
    };
  }, []);
  const loadingStatusRef = useRef({ isLoading: false, isOff: false });
  const filterRef = useRef<TFilterParams>(loadItem("volunteers_filter") || {});

  // --> Сохранение состояния страницы
  const printRef = useRef<{
    list: TItem[] | null;
    page: number;
  } | null>(null);
  const print = loadItem("volunteersPrint");
  const needUsePrint = useRef<boolean>(print ? loadItem("usePrintInVolunteers") : false);

  const [listState, setListState] = useState<TItem[] | null>(
    needUsePrint.current && print?.list ? print.list : null
  );
  // <-- Сохранение состояния страницы

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
    saveItem("volunteersPrint", {
      ...printRef.current,
      scroll: scrollTop.current,
      listHeight: document.getElementById("volunteers_list")?.offsetHeight || undefined,
    });
  };
  const createBack = () => {
    saveItem("backFromVolunteer", true);
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
        //
        setTimeout(() => {
          setIsBlankState(false);
        }, 0);

        print && setListHeightState(print.listHeight);
        print && window.scrollTo(0, print.scroll);
      }
    }, 0);

    return () => {
      saveItem("usePrintInVolunteers", false);
    };
  }, []);
  // <-- Сохранение состояния страницы

  useEffect(
    () => () => {
      saveItem("volunteers_filter", filterRef.current);
    },
    []
  );

  const getData = (params?: TGetListRequest) => {
    // --> Сохранение состояния страницы
    initRef.current = false;
    // <-- Сохранение состояния страницы

    loadingStatusRef.current.isLoading = true;
    const { ...filter } = filterRef.current;

    VolunteersApi.getList({ ...filter, ...params, orderComplex: "id desc" }).then((res) => {
      setListState((prev) => (!prev || pageState === 1 ? res : [...prev, ...res]));
      loadingStatusRef.current.isLoading = false;
      if (!res.length) {
        loadingStatusRef.current.isOff = true;
      }
    });
  };

  useEffect(() => {
    // --> Сохранение состояния страницы
    if (initRef.current && needUsePrint.current) return;
    // <-- Сохранение состояния страницы

    getData({ offset: (pageState - 1) * PAGESIZE, limit: PAGESIZE });
  }, [pageState]);

  const changeFilter = (filter: TFilterParams) => {
    // --> Сохранение состояния страницы
    // При работе фильтра необходимость применения принта сбрасываем
    needUsePrint.current = false;
    saveItem("usePrintInVolunteers", false);
    initRef.current = false;
    setListHeightState(0);
    // <-- Сохранение состояния страницы

    loadingStatusRef.current.isOff = false;
    filterRef.current = filter;

    if (pageState === 1) {
      getData({ offset: 0, limit: PAGESIZE });
    } else {
      setPageState(1);
    }
  };

  const renderContent = (data: TItem) => (
    <>
      <div className="loc_image">
        <Link onClick={createBack} to={`${PAGES.VOLUNTEER}/${data.id}`} className="link_img">
          <img alt="загружаю" src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
        </Link>
      </div>

      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.VOLUNTEER}/${data.id}`);
            createBack();
          }}
        >
          Подробнее
        </Button>

        <div className="loc_data">
          <Link
            onClick={createBack}
            to={`${PAGES.VOLUNTEER}/${data.id}`}
            className="loc_fio link_text"
          >
            {data.fio}
          </Link>

          <div className="loc_parameters" />

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

  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-volunteers">
        {isBlankState && <div className="loc_blank" />}
        <BreadCrumbs title="Наши волонеры" />

        <Filter filter={filterRef.current} onChange={changeFilter} />

        <div
          className="loc_list"
          id="volunteers_list"
          style={{ minHeight: listHeightState ? `${listHeightState}px` : 0 }}
        >
          {listState &&
            listState.map((item, index) => (
              <div key={index} className="loc_wrapper">
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

export default Volunteers;
