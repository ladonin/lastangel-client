/*
  import Administration from 'pages/administration'
  Общая страница админки.
 */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { useLocation } from "react-router";

import {
  TGetListRequest as TGetCollectionsListRequest,
  TItem as TItemCollection,
} from "api/types/collections";
import { TGetListRequest as TGetPetsListRequest, TItem as TItemPet } from "api/types/animals";
import {
  TGetListRequest as TGetVolunteersListRequest,
  TItem as TItemVolunteer,
} from "api/types/volunteers";
import {
  TGetListRequest as TGetDonationsListRequest,
  TItem as TItemDonation,
} from "api/types/donations";
import {
  TGetListRequest as TGetDonatorsListRequest,
  TItem as TItemDonator,
} from "api/types/donators";
import { TGetListRequest as TGetNewsListRequest, TItem as TItemNews } from "api/types/news";
import { TGetListRequest as TGetStoriesListRequest, TItem as TItemStory } from "api/types/stories";
import { AnimalsApi } from "api/animals";
import { VolunteersApi } from "api/volunteers";
import { CollectionsApi } from "api/collections";
import { DonationsApi } from "api/donations";
import { DonatorsApi } from "api/donators";
import { NewsApi } from "api/news";
import { StoriesApi } from "api/stories";
import PAGES from "routing/routes";
import {
  getMainImageUrl as getPetMainImageUrl,
  prepareStatus as preparePetStatus,
  prepareAge,
  prepareGraft,
  prepareSex,
  prepareSterilized,
  prepareStatusCode as preparePetStatusCode,
  prepareKind,
  getCategoryAgeParams,
} from "helpers/animals";
import { getMainImageUrl as getVolunteerMainImageUrl } from "helpers/volunteers";
import { prepareType as prepareDonationType } from "helpers/donations";
import {
  getMainImageUrl as getCollectionMainImageUrl,
  prepareStatus as prepareCollectionStatus,
  prepareType as prepareCollectionType,
} from "helpers/collections";
import { getDateString, numberFriendly, objectsAreEqual } from "helpers/common";
import { loadItem, saveItem } from "utils/localStorage";
import { SIZES_MAIN } from "constants/photos";
import { ANIMALS_STATUS } from "constants/animals";
import { COLLECTIONS_STATUS } from "constants/collections";
import Tabs from "components/Tabs";
import NotFound from "components/NotFound";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import InfiniteScroll from "components/InfiniteScroll";
import LoaderIcon from "components/LoaderIcon";
import PetsFilter, { TFilterParams as TPetsFilterParams } from "./pets/_components/Filter";
import CollectionsFilter, {
  TFilterParams as TCollectionsFilterParams,
} from "./collections/_components/Filter";
import NewsFilter, {
  DEFAULT_SORT as NEWS_DEFAULT_SORT,
  TFilterParams as TNewsFilterParams,
} from "./news/_components/Filter";
import StoriesFilter, {
  DEFAULT_SORT as STORIES_DEFAULT_SORT,
  TFilterParams as TStoriesFilterParams,
} from "./stories/_components/Filter";
import VolunteersFilter, {
  TFilterParams as TVolunteersFilterParams,
} from "./volunteers/_components/Filter";
import DonatorsFilter, {
  TFilterParams as TDonatorsFilterParams,
} from "./donators/_components/Filter";
import DonationsFilter, {
  DEFAULT_SORT as DONATION_DEFAULT_SORT,
  ORDER_VALUES as DONATION_ORDER_VALUES,
  TFilterParams as TDonationsFilterParams,
} from "./donations/_components/Filter";
import "./style.scss";

const STORIES_PAGESIZE = 20;
const NEWS_PAGESIZE = 20;
const PETS_PAGESIZE = 20;
const VOLUNTEERS_PAGESIZE = 20;
const DONATIONS_PAGESIZE = 20;
const DONATORS_PAGESIZE = 20;

const TABS_MAP: { [key: string]: number } = {
  pet: 0,
  collection: 1,
  donation: 2,
  donator: 3,
  volunteer: 4,
  news: 5,
  story: 6,
};

const preparePetsSavedFilter = () => {
  const savedFilter = loadItem("admin_pets_filter");
  if (!savedFilter) return undefined;
  return {
    ...savedFilter,
    ...(savedFilter.category ? getCategoryAgeParams(savedFilter.category) : {}),
  };
};

const Administration: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const { search } = useLocation();

  const [initTabState, setInitTabState] = useState<number | undefined>(undefined);

  const [listPetsState, setListPetsState] = useState<TItemPet[] | null>(null);
  const [listVolunteersState, setListVolunteersState] = useState<TItemVolunteer[] | null>(null);
  const [listCollectionState, setListCollectionsState] = useState<TItemCollection[] | null>(null);
  const [listDonationsState, setListDonationsState] = useState<TItemDonation[] | null>(null);
  const [listDonatorsState, setListDonatorsState] = useState<TItemDonator[] | null>(null);
  const [listNewsState, setListNewsState] = useState<TItemNews[] | null>(null);
  const [listStoriesState, setListStoriesState] = useState<TItemStory[] | null>(null);
  const [selectedTabIndexState, setSelectedTabIndexState] = useState<number>(0);

  const [newsPageState, setNewsPageState] = useState<number>(1);
  const [storiesPageState, setStoriesPageState] = useState<number>(1);
  const [petsPageState, setPetsPageState] = useState<number>(1);
  const [volunteersPageState, setVolunteersPageState] = useState<number>(1);
  const [donationsPageState, setDonationsPageState] = useState<number>(1);
  const [donatorsPageState, setDonatorsPageState] = useState<number>(1);

  const petsFilterRef = useRef<TPetsFilterParams>(
    preparePetsSavedFilter() || {
      statusExclude: [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED],
    }
  );
  const collectionsFilterRef = useRef<TCollectionsFilterParams>(
    loadItem("admin_collections_filter") || { statusExclude: COLLECTIONS_STATUS.CLOSED }
  );
  const donationsFilterRef = useRef<TDonationsFilterParams>(
    loadItem("admin_donations_filter") || null
  );
  const newsFilterRef = useRef<TNewsFilterParams>(loadItem("admin_news_filter") || null);
  const storiesFilterRef = useRef<TStoriesFilterParams>(loadItem("admin_stories_filter") || null);
  const donatorsFilterRef = useRef<TDonatorsFilterParams>(
    loadItem("admin_donators_filter") || { order: "id", order_type: "DESC" }
  );
  const volunteersFilterRef = useRef<TVolunteersFilterParams>(
    loadItem("admin_volunteers_filter") || null
  );

  const petsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const collectionsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const donationsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const newsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const storiesLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const donatorsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const volunteersLoadingStatusRef = useRef({ isLoading: false, isOff: false });

  const onSelectTabHandler = (index: number) => {
    setSelectedTabIndexState(index);
  };

  const getNewsData = (params?: TGetNewsListRequest) => {
    newsLoadingStatusRef.current.isLoading = true;
    const { order, ...filter } = newsFilterRef.current || {};

    NewsApi.getList({ ...filter, ...params, order: order || NEWS_DEFAULT_SORT }).then((res) => {
      setListNewsState((prev) => (prev === null || newsPageState === 1 ? res : [...prev, ...res]));
      newsLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        newsLoadingStatusRef.current.isOff = true;
      }
    });
  };

  const getStoriesData = (params?: TGetStoriesListRequest) => {
    storiesLoadingStatusRef.current.isLoading = true;
    const { order, ...filter } = storiesFilterRef.current || {};
    StoriesApi.getList({ ...filter, ...params, order: order || STORIES_DEFAULT_SORT }).then(
      (res) => {
        setListStoriesState((prev) =>
          prev === null || storiesPageState === 1 ? res : [...prev, ...res]
        );
        storiesLoadingStatusRef.current.isLoading = false;
        if (!res.length) {
          storiesLoadingStatusRef.current.isOff = true;
        }
      }
    );
  };

  const getCollectionsData = (params?: TGetCollectionsListRequest) => {
    collectionsLoadingStatusRef.current.isLoading = true;
    const filter = collectionsFilterRef.current || {};
    CollectionsApi.getList({
      ...filter,
      ...params,
      order: "id",
      order_type: "DESC",
      with_corrupted: 1,
    }).then((res) => {
      setListCollectionsState(res);
    });
  };

  const getPetsData = (params?: TGetPetsListRequest) => {
    petsLoadingStatusRef.current.isLoading = true;

    const { category, ...filter } = petsFilterRef.current || {};
    AnimalsApi.getList({
      ...filter,
      ...params,
      withUnpublished: 1,
      order: "id",
      order_type: "DESC",
    }).then((res) => {
      setListPetsState((prev) => (prev === null || petsPageState === 1 ? res : [...prev, ...res]));
      petsLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        petsLoadingStatusRef.current.isOff = true;
      }
    });
  };

  const getVolunteersData = (params?: TGetVolunteersListRequest) => {
    volunteersLoadingStatusRef.current.isLoading = true;

    const filter = volunteersFilterRef.current || {};
    VolunteersApi.getList({
      ...filter,
      ...params,
      withUnpublished: 1,
      order: "id",
      order_type: "DESC",
    }).then((res) => {
      setListVolunteersState((prev) =>
        prev === null || volunteersPageState === 1 ? res : [...prev, ...res]
      );
      volunteersLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        volunteersLoadingStatusRef.current.isOff = true;
      }
    });
  };

  const getDonationsData = (params?: TGetDonationsListRequest) => {
    donationsLoadingStatusRef.current.isLoading = true;
    const { order, ...filter } = donationsFilterRef.current || {};

    const orderPrepared = order ? DONATION_ORDER_VALUES[order] : undefined;

    DonationsApi.getList({
      ...filter,
      ...params,
      order: orderPrepared?.field || DONATION_ORDER_VALUES[DONATION_DEFAULT_SORT].field,
      order_type: orderPrepared?.type || DONATION_ORDER_VALUES[DONATION_DEFAULT_SORT].type,
    }).then((res) => {
      setListDonationsState((prev) =>
        prev === null || donationsPageState === 1 ? res : [...prev, ...res]
      );
      donationsLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        donationsLoadingStatusRef.current.isOff = true;
      }
    });
  };

  const getDonatorsData = (params?: TGetDonatorsListRequest) => {
    donatorsLoadingStatusRef.current.isLoading = true;
    DonatorsApi.getList({ ...(donatorsFilterRef.current || {}), ...params }).then((res) => {
      setListDonatorsState((prev) =>
        prev === null || donatorsPageState === 1 ? res : [...prev, ...res]
      );
      donatorsLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        donatorsLoadingStatusRef.current.isOff = true;
      }
    });
  };

  const changePetsFilter = (filter: TPetsFilterParams) => {
    if (objectsAreEqual(filter, petsFilterRef.current)) return;
    petsLoadingStatusRef.current.isOff = false;
    petsFilterRef.current = filter;

    if (filter.status || filter.notPublished === 1) {
      petsFilterRef.current.statusExclude = undefined;
    } else {
      petsFilterRef.current.statusExclude = [ANIMALS_STATUS.AT_HOME, ANIMALS_STATUS.DIED];
    }
    saveItem("admin_pets_filter", petsFilterRef.current);
    if (petsPageState === 1) {
      getPetsData({ offset: 0, limit: PETS_PAGESIZE });
    } else {
      setPetsPageState(1);
    }
  };

  const changeVolunteersFilter = (filter: TVolunteersFilterParams) => {
    if (objectsAreEqual(filter, volunteersFilterRef.current)) return;

    volunteersLoadingStatusRef.current.isOff = false;
    volunteersFilterRef.current = filter;

    saveItem("admin_volunteers_filter", volunteersFilterRef.current);
    if (volunteersPageState === 1) {
      getVolunteersData({ offset: 0, limit: VOLUNTEERS_PAGESIZE });
    } else {
      setVolunteersPageState(1);
    }
  };

  const changeNewsFilter = (filter: TNewsFilterParams) => {
    if (objectsAreEqual(filter, newsFilterRef.current)) return;
    newsLoadingStatusRef.current.isOff = false;
    newsFilterRef.current = filter;
    saveItem("admin_news_filter", newsFilterRef.current);
    if (newsPageState === 1) {
      getNewsData({ offset: 0, limit: NEWS_PAGESIZE });
    } else {
      setNewsPageState(1);
    }
  };

  const changeStoriesFilter = (filter: TStoriesFilterParams) => {
    if (objectsAreEqual(filter, storiesFilterRef.current)) return;
    storiesLoadingStatusRef.current.isOff = false;
    storiesFilterRef.current = filter;
    saveItem("admin_stories_filter", storiesFilterRef.current);
    if (storiesPageState === 1) {
      getStoriesData({ offset: 0, limit: STORIES_PAGESIZE });
    } else {
      setStoriesPageState(1);
    }
  };

  const changeCollectionsFilter = (filter: TCollectionsFilterParams) => {
    if (objectsAreEqual(filter, collectionsFilterRef.current)) return;
    collectionsFilterRef.current = {
      ...filter,
      statusExclude: filter.status && filter.status === 3 ? undefined : COLLECTIONS_STATUS.CLOSED,
    };
    saveItem("admin_collections_filter", collectionsFilterRef.current);
    getCollectionsData();
  };

  const changeDonationsFilter = (filter: TDonationsFilterParams) => {
    if (objectsAreEqual(filter, donationsFilterRef.current)) return;

    donationsLoadingStatusRef.current.isOff = false;
    donationsFilterRef.current = filter;
    saveItem("admin_donations_filter", donationsFilterRef.current);
    if (donationsPageState === 1) {
      getDonationsData({ offset: 0, limit: DONATIONS_PAGESIZE });
    } else {
      setDonationsPageState(1);
    }
  };

  const changeDonatorsFilter = (filter: TDonatorsFilterParams) => {
    if (objectsAreEqual(filter, donatorsFilterRef.current)) return;
    donatorsLoadingStatusRef.current.isOff = false;
    donatorsFilterRef.current = filter;
    saveItem("admin_donators_filter", donatorsFilterRef.current);
    if (donatorsPageState === 1) {
      getDonatorsData({ offset: 0, limit: DONATORS_PAGESIZE });
    } else {
      setDonatorsPageState(1);
    }
  };

  const renderPetContent = (data: TItemPet) => (
    <div className="loc_petItem">
      <img alt="загружаю" src={getPetMainImageUrl(data, SIZES_MAIN.SQUARE)} />
      {data.ismajor === 1 && <div className="loc_isImportant">важно</div>}
      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.ADMINISTRATION_PET_UPDATE}/${data.id}`);
          }}
        >
          Редактировать
        </Button>
        <Button
          className="loc_button loc_redactNewBlank"
          theme={ButtonThemes.GHOST_BORDER}
          size={isMobile ? ButtonSizes.HUGE : ButtonSizes.SMALL}
          onClick={() => {
            window.open(`${PAGES.ADMINISTRATION_PET_UPDATE}/${data.id}`, "_blank");
          }}
        >
          ...в новой вкладке
        </Button>
        <div className="loc_data">
          {!data.is_published && <div className="loc_not_published">Не опубликовано</div>}
          <div className="loc_name">
            №{data.id} {data.name}
          </div>
          ,{" "}
          <div className={`loc_sex ${data.sex === 1 ? "loc--male" : "loc--female"}`}>
            {prepareSex(data.sex)}
          </div>
          , <div className="loc_age">{prepareAge(data.birthdate)}</div>
          <div className="loc_parameters">
            {prepareGraft(data.grafted, data.sex)}, {prepareSterilized(data.sterilized, data.sex)},{" "}
            {data.breed || "порода неизвестна"}, {prepareKind(data.kind, data.sex)}
          </div>
          <div
            className={`loc_status loc--status_${preparePetStatusCode(
              data.status,
              data.need_medicine
            )}`}
          >
            {preparePetStatus(data.status, data.need_medicine)}
          </div>
          {data.need_medicine !== null && <span>({preparePetStatus(data.status, null)})</span>}
          <div className="loc_collected">
            Собрано за месяц: <span className="loc_val">{numberFriendly(data.collected)}</span> руб.
          </div>
          <div className="loc_description">{data.short_description}</div>
          <div className="loc_created">Создано: {getDateString(data.created)}</div>
          {!!data.updated && (
            <div className="loc_updated">Изменено: {getDateString(data.updated)}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVolunteerContent = (data: TItemVolunteer) => (
    <div className="loc_volunteerItem">
      <img alt="загружаю" src={getVolunteerMainImageUrl(data, SIZES_MAIN.SQUARE)} />
      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.ADMINISTRATION_VOLUNTEER_UPDATE}/${data.id}`);
          }}
        >
          Редактировать
        </Button>
        <Button
          className="loc_button loc_redactNewBlank"
          theme={ButtonThemes.GHOST_BORDER}
          size={isMobile ? ButtonSizes.HUGE : ButtonSizes.SMALL}
          onClick={() => {
            window.open(`${PAGES.ADMINISTRATION_VOLUNTEER_UPDATE}/${data.id}`, "_blank");
          }}
        >
          ...в новой вкладке
        </Button>
        <div className="loc_data">
          {!data.is_published && <div className="loc_not_published">Не опубликовано</div>}
          <div className="loc_name">
            №{data.id} {data.fio}
          </div>
          , <div className="loc_description">{data.short_description}</div>
          <div className="loc_created">Создано: {getDateString(data.created)}</div>
          {!!data.updated && (
            <div className="loc_updated">Изменено: {getDateString(data.updated)}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCollectionContent = (data: TItemCollection) => (
    <div className="loc_collectionItem">
      <img alt="загружаю" src={getCollectionMainImageUrl(data, SIZES_MAIN.SQUARE)} />
      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.ADMINISTRATION_COLLECTION_UPDATE}/${data.id}`);
          }}
        >
          Редактировать
        </Button>

        <div className="loc_data">
          {!!data.is_corrupted && <div className="loc_error">Ошибка (питомец удален)</div>}
          <div className="loc_name">{data.name}</div>

          <div className={`loc_type loc--type_${data.type}`}>
            {prepareCollectionType(data.type)}
          </div>

          <div className={`loc_status loc--status_${data.status}`}>
            {prepareCollectionStatus(data.status)}
          </div>
          <div className="loc_target_sum">
            Нужно: <span className="loc_val">{Number(data.target_sum)?.toLocaleString() || 0}</span>{" "}
            руб.
          </div>
          <div
            className={`loc_collected ${
              Number(data.target_sum) <= Number(data.collected) ? "loc--completed" : ""
            }`}
          >
            Собрано:{" "}
            <span className="loc_val">
              {data.collected ? numberFriendly(parseFloat(data.collected)) : 0}
            </span>{" "}
            руб.
          </div>

          <div className="loc_spent">
            Потрачено: <span className="loc_val">{Number(data.spent)?.toLocaleString() || 0}</span>{" "}
            руб.
          </div>

          <div className="loc_description">{data.short_description}</div>
          <div className="loc_created">Создано: {getDateString(data.created)}</div>
          {!!data.updated && (
            <div className="loc_updated">Изменено: {getDateString(data.updated)}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderNewsContent = (data: TItemNews) => (
    <div className="loc_newsItem">
      <div className="loc_content">
        <div className="loc_data">
          <div className="loc_title">{data.name}</div>
          <div className="loc_description">{data.short_description}</div>
          <Button
            className="loc_button"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
            onClick={() => {
              navigate(`${PAGES.ADMINISTRATION_NEWS_UPDATE}/${data.id}`);
            }}
          >
            Редактировать
          </Button>
          <div className="loc_created">Создано: {getDateString(data.created)}</div>
          {!!data.updated && (
            <div className="loc_updated">Изменено: {getDateString(data.updated)}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStoryContent = (data: TItemStory) => (
    <div className="loc_storyItem">
      <div className="loc_content">
        <div className="loc_data">
          <div className="loc_title">{data.name}</div>
          <div className="loc_description">{data.short_description}</div>
          <Button
            className="loc_button"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
            onClick={() => {
              navigate(`${PAGES.ADMINISTRATION_STORY_UPDATE}/${data.id}`);
            }}
          >
            Редактировать
          </Button>
          <div className="loc_created">Создано: {getDateString(data.created)}</div>
          {!!data.updated && (
            <div className="loc_updated">Изменено: {getDateString(data.updated)}</div>
          )}
        </div>
      </div>
    </div>
  );

  const isAnonymDonator = (item: TItemDonation) =>
    !(
      item.donator_fullname ||
      item.donator_firstname ||
      item.donator_middlename ||
      item.donator_lastname
    );

  const getDonatorName = (item: TItemDonation) =>
    (
      item.donator_fullname ||
      `${item.donator_firstname} ${item.donator_middlename} ${item.donator_lastname}`
    ).toUpperCase();

  const renderDonationContent = (data: TItemDonation) => (
    <div className="loc_donationItem">
      <div className="loc_sum">{numberFriendly(data.sum)} руб.</div>
      <div className="loc_content">
        <div className="loc_data">
          <div className="loc_targetation">
            {/* <div className="loc_type">{prepareDonationType(data.type)}</div> */}
            {!!data.target_name && !!data.target_id ? (
              <div
                className={`loc_targetName loc--type_${data.type}`}
                onClick={() =>
                  navigate(`${data.type === 1 ? PAGES.PET : PAGES.COLLECTIONS}/${data.target_id}`)
                }
              >
                {data.target_name}
              </div>
            ) : (
              <div className="loc_deletedTarget">{data.target_print_name}</div>
            )}
            {!data.target_id && (
              <div className={`loc_targetName loc--type_${data.type}`}>
                {prepareDonationType(data.type)}
              </div>
            )}
          </div>

          <div className="loc_donator">
            <div className="loc_name">
              {isAnonymDonator(data) ? "Аноним" : getDonatorName(data)}
            </div>
            {!!data.donator_card && <div className="loc_card">Карта: {data.donator_card}</div>}
            <Button
              className="loc_button"
              theme={ButtonThemes.PRIMARY}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
              onClick={() => {
                navigate(`${PAGES.ADMINISTRATION_DONATION_UPDATE}/${data.id}`);
              }}
            >
              Редактировать
            </Button>
            <div className="loc_created">Создано: {getDateString(data.created)}</div>
            {!!data.updated && (
              <div className="loc_updated">Изменено: {getDateString(data.updated)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDonatorContent = (data: TItemDonator) => (
    <div className="loc_donatorItem">
      <div className="loc_content">
        <div className="loc_data">
          <div className="loc_name">{data.fullname}</div>
          <div className="loc_card">Карта: {data.card}</div>
          <Button
            className="loc_button"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
            onClick={() => {
              navigate(`${PAGES.ADMINISTRATION_DONATOR_UPDATE}/${data.id}`);
            }}
          >
            Редактировать
          </Button>
          <div className="loc_created">Создан: {getDateString(data.created)}</div>
          {!!data.updated && (
            <div className="loc_updated">Изменен: {getDateString(data.updated)}</div>
          )}
        </div>
      </div>
    </div>
  );

  const onReachNewsBottomHandler = () => {
    !newsLoadingStatusRef.current.isOff &&
      !newsLoadingStatusRef.current.isLoading &&
      setNewsPageState((prev) => prev + 1);
  };

  const onReachStoriesBottomHandler = () => {
    !storiesLoadingStatusRef.current.isOff &&
      !storiesLoadingStatusRef.current.isLoading &&
      setStoriesPageState((prev) => prev + 1);
  };

  const onReachPetsBottomHandler = () => {
    if (!petsLoadingStatusRef.current.isOff && !petsLoadingStatusRef.current.isLoading) {
      petsLoadingStatusRef.current.isLoading = true;
      setPetsPageState((prev) => prev + 1);
    }
  };

  const onReachDonationsBottomHandler = () => {
    !donationsLoadingStatusRef.current.isOff &&
      !donationsLoadingStatusRef.current.isLoading &&
      setDonationsPageState((prev) => prev + 1);
  };

  const onReachDonatorsBottomHandler = () => {
    !donatorsLoadingStatusRef.current.isOff &&
      !donatorsLoadingStatusRef.current.isLoading &&
      setDonatorsPageState((prev) => prev + 1);
  };

  const onReachVolunteersBottomHandler = () => {
    !volunteersLoadingStatusRef.current.isOff &&
      !volunteersLoadingStatusRef.current.isLoading &&
      setVolunteersPageState((prev) => prev + 1);
  };

  const tabs = [
    {
      position: "left",
      render: <div className="loc_categoryName">Питомцы</div>,
    },
    {
      position: "left",
      render: <div className="loc_categoryName">Сборы</div>,
    },
    {
      position: "left",
      render: <div className="loc_categoryName">Донаты</div>,
    },
    {
      position: "left",
      render: <div className="loc_categoryName">Донаторы</div>,
    },
    {
      position: "left",
      render: <div className="loc_categoryName">Волонтеры</div>,
    },
    {
      position: "left",
      render: <div className="loc_categoryName">Новости</div>,
    },
    {
      position: "left",
      render: <div className="loc_categoryName">Истории</div>,
    },
  ];

  const panels = useMemo(
    () => [
      <>
        <PetsFilter filter={petsFilterRef.current} onChange={changePetsFilter} />
        <div className="loc_list">
          {listPetsState === null && <LoaderIcon />}
          {listPetsState &&
            listPetsState.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "loc_itemWrapper loc--pet",
                  `loc--status_${preparePetStatusCode(item.status, item.need_medicine)}`,
                  { "loc--not_published": !item.is_published }
                )}
              >
                <div className="loc_item">{renderPetContent(item)}</div>
                <div
                  className="loc_link"
                  onClick={() => {
                    navigate(`${PAGES.PET}/${item.id}`);
                  }}
                >
                  Перейти на страницу
                </div>
              </div>
            ))}
          {selectedTabIndexState === 0 && (
            <InfiniteScroll onReachBottom={onReachPetsBottomHandler} amendment={100} />
          )}
          {listPetsState && !listPetsState.length && <NotFound />}
        </div>
      </>,
      <>
        <CollectionsFilter
          filter={collectionsFilterRef.current}
          onChange={changeCollectionsFilter}
        />
        <div className="loc_list">
          {listCollectionState === null && <LoaderIcon />}
          {listCollectionState &&
            listCollectionState.map((item, index) => (
              <div
                key={index}
                className={cn("loc_itemWrapper loc--collection", `loc--status_${item.status}`, {
                  "loc--isCorrupted": item.is_corrupted,
                })}
              >
                <div className="loc_item">{renderCollectionContent(item)}</div>
                <div
                  className="loc_link"
                  onClick={() => {
                    navigate(`${PAGES.COLLECTION}/${item.id}`);
                  }}
                >
                  Перейти на страницу
                </div>
              </div>
            ))}
          {listCollectionState && !listCollectionState.length && <NotFound />}
        </div>
      </>,
      <div className="loc_list">
        <DonationsFilter filter={donationsFilterRef.current} onChange={changeDonationsFilter} />
        {listDonationsState === null && <LoaderIcon />}
        {listDonationsState &&
          listDonationsState.map((item, index) => (
            <div
              key={index}
              className={cn("loc_itemWrapper loc--donation", `loc--type_${item.type}`)}
            >
              <div className="loc_item">{renderDonationContent(item)}</div>
            </div>
          ))}
        {selectedTabIndexState === 2 && (
          <InfiniteScroll onReachBottom={onReachDonationsBottomHandler} amendment={100} />
        )}
        {listDonationsState && !listDonationsState.length && <NotFound />}
      </div>,
      <div className="loc_list">
        <DonatorsFilter filter={donatorsFilterRef.current} onChange={changeDonatorsFilter} />
        {listDonatorsState === null && <LoaderIcon />}
        {listDonatorsState &&
          listDonatorsState.map((item, index) => (
            <div key={index} className="loc_itemWrapper loc--donator">
              <div className="loc_item">{renderDonatorContent(item)}</div>
              <div
                className="loc_link"
                onClick={() => {
                  navigate(`${PAGES.DONATOR}/${item.id}`);
                }}
              >
                Перейти на страницу
              </div>
            </div>
          ))}
        {selectedTabIndexState === 3 && (
          <InfiniteScroll onReachBottom={onReachDonatorsBottomHandler} amendment={100} />
        )}
        {listDonatorsState && !listDonatorsState.length && <NotFound />}
      </div>,
      <>
        <VolunteersFilter filter={volunteersFilterRef.current} onChange={changeVolunteersFilter} />
        <div className="loc_list">
          {listVolunteersState === null && <LoaderIcon />}
          {listVolunteersState &&
            listVolunteersState.map((item, index) => (
              <div
                key={index}
                className={cn("loc_itemWrapper loc--volunteer", {
                  "loc--not_published": !item.is_published,
                })}
              >
                <div className="loc_item">{renderVolunteerContent(item)}</div>
                <div
                  className="loc_link"
                  onClick={() => {
                    navigate(`${PAGES.VOLUNTEER}/${item.id}`);
                  }}
                >
                  Перейти на страницу
                </div>
              </div>
            ))}
          {selectedTabIndexState === 0 && (
            <InfiniteScroll onReachBottom={onReachVolunteersBottomHandler} amendment={100} />
          )}
          {listVolunteersState && !listVolunteersState.length && <NotFound />}
        </div>
      </>,
      <>
        <NewsFilter filter={newsFilterRef.current} onChange={changeNewsFilter} />
        <div className="loc_list">
          {listNewsState === null && <LoaderIcon />}
          {listNewsState &&
            listNewsState.map((item, index) => (
              <div key={index} className="loc_itemWrapper loc--news">
                <div className="loc_item">{renderNewsContent(item)}</div>
                <div
                  className="loc_link"
                  onClick={() => {
                    navigate(`${PAGES.NEWS}/${item.id}`);
                  }}
                >
                  Перейти на страницу
                </div>
              </div>
            ))}
          {selectedTabIndexState === 4 && (
            <InfiniteScroll onReachBottom={onReachNewsBottomHandler} amendment={100} />
          )}
          {listNewsState && !listNewsState.length && <NotFound />}
        </div>
      </>,

      <>
        <StoriesFilter filter={storiesFilterRef.current} onChange={changeStoriesFilter} />
        <div className="loc_list">
          {listStoriesState === null && <LoaderIcon />}
          {listStoriesState &&
            listStoriesState.map((item, index) => (
              <div key={index} className="loc_itemWrapper loc--stories">
                <div className="loc_item">{renderStoryContent(item)}</div>
                <div
                  className="loc_link"
                  onClick={() => {
                    navigate(`${PAGES.STORY}/${item.id}`);
                  }}
                >
                  Перейти на страницу
                </div>
              </div>
            ))}
          {selectedTabIndexState === 5 && (
            <InfiniteScroll onReachBottom={onReachStoriesBottomHandler} amendment={100} />
          )}
          {listStoriesState && !listStoriesState.length && <NotFound />}
        </div>
      </>,
    ],
    [
      listPetsState,
      listCollectionState,
      listDonationsState,
      listDonatorsState,
      listVolunteersState,
      listNewsState,
      listStoriesState,
      selectedTabIndexState,
    ]
  );

  useEffect(() => {
    getCollectionsData();
  }, []);

  useEffect(() => {
    if (initTabState !== undefined) {
      setSelectedTabIndexState(initTabState);
    }
  }, [initTabState]);

  useEffect(() => {
    if (search) {
      const params = new URLSearchParams(search);
      const tabName = params.get("tab");
      if (tabName && TABS_MAP[tabName]) {
        setInitTabState(TABS_MAP[tabName]);
      } else {
        setInitTabState(0);
      }
      return;
    }
    setInitTabState(0);
  }, [search]);

  useEffect(() => {
    getPetsData({ offset: (petsPageState - 1) * PETS_PAGESIZE, limit: PETS_PAGESIZE });
  }, [petsPageState]);

  useEffect(() => {
    getNewsData({ offset: (newsPageState - 1) * NEWS_PAGESIZE, limit: NEWS_PAGESIZE });
  }, [newsPageState]);

  useEffect(() => {
    getStoriesData({ offset: (storiesPageState - 1) * STORIES_PAGESIZE, limit: STORIES_PAGESIZE });
  }, [storiesPageState]);

  useEffect(() => {
    getDonationsData({
      offset: (donationsPageState - 1) * DONATIONS_PAGESIZE,
      limit: DONATIONS_PAGESIZE,
    });
  }, [donationsPageState]);

  useEffect(() => {
    getDonatorsData({
      offset: (donatorsPageState - 1) * DONATORS_PAGESIZE,
      limit: DONATORS_PAGESIZE,
    });
  }, [donatorsPageState]);

  useEffect(() => {
    getVolunteersData({
      offset: (volunteersPageState - 1) * VOLUNTEERS_PAGESIZE,
      limit: VOLUNTEERS_PAGESIZE,
    });
  }, [volunteersPageState]);

  return initTabState !== undefined ? (
    <div className="page-administration">
      <Tabs
        selectedTab={initTabState}
        onSelect={onSelectTabHandler}
        tabsList={tabs}
        panelsList={panels}
      />
    </div>
  ) : null;
};

export default Administration;
