import React, { useEffect, useState, useRef } from "react";
import LoaderIcon from "components/LoaderIcon";
import { NewsApi } from "api/news";
import { TGetListRequest, TItem } from "api/types/news";
import InfiniteScroll from "components/InfiniteScroll";
import { isAdmin } from "utils/user";
import NotFound from "components/NotFound";
import { loadItem, saveItem } from "utils/localStorage";
import ListItem from "../ListItem";
import Filter, { TFilterParams } from "../Filter";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

type TProps = {
  excludeId?: number;
};
const PAGESIZE = 20;
const List = ({ excludeId }: TProps) => {
  const [pageState, setPageState] = useState<number>(1);
  const [listState, setListState] = useState<TItem[] | null>(null);

  const loadingStatusRef = useRef({ isLoading: false, isOff: false });
  const filterRef = useRef<TGetListRequest>({
    ...loadItem("news_filter"),
    excludeId: excludeId || undefined,
    excludeStatus: isAdmin() ? undefined : 2,
  });
  const onReachBottomHandler = () => {
    !loadingStatusRef.current.isOff &&
      !loadingStatusRef.current.isLoading &&
      setPageState((prev) => prev + 1);
  };

  const getData = (params?: TGetListRequest) => {
    loadingStatusRef.current.isLoading = true;
    NewsApi.getList({ ...filterRef.current, ...params }).then((res) => {
      setListState((prev) => (!prev || pageState === 1 ? res : [...prev, ...res]));
      loadingStatusRef.current.isLoading = false;
      if (!res.length) {
        loadingStatusRef.current.isOff = true;
      }
    });
  };

  useEffect(() => {
    getData({ offset: (pageState - 1) * PAGESIZE, limit: PAGESIZE });
  }, [pageState]);

  useEffect(() => {
    getData({ offset: 0, limit: PAGESIZE });
  }, []);

  const changeFilter = (filter: TFilterParams) => {
    loadingStatusRef.current.isOff = false;
    filterRef.current = filter;
    saveItem("news_filter", filterRef.current);
    if (pageState === 1) {
      getData({ offset: 0, limit: PAGESIZE });
    } else {
      setPageState(1);
    }
  };

  return (
    <div className="page-news_list">
      <Filter filter={filterRef.current} onChange={changeFilter} />

      {listState && listState.map((item, index) => <ListItem key={index} data={item} />)}
      {listState === null && <LoaderIcon />}
      {listState && !listState.length && <NotFound />}
      <InfiniteScroll onReachBottom={onReachBottomHandler} amendment={100} />
    </div>
  );
};

export default List;
