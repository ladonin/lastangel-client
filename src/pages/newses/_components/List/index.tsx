import React, { useEffect, useState, useRef } from "react";
import LoaderIcon from "components/LoaderIcon";
import { NewsApi } from "api/news";
import { TGetListRequest, TItem } from "api/types/news";
import InfiniteScroll from "components/InfiniteScroll";
import { isAdmin } from "utils/user";
import ListItem from "../ListItem";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";

type TProps = {
  excludeId?: number;
};
const PAGESIZE = 20;
const List = ({ excludeId }: TProps) => {
  const [newsPageState, setNewsPageState] = useState<number>(1);
  const [listNewsState, setListNewsState] = useState<TItem[] | null>(null);

  const newsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const newsFilterRef = useRef<TGetListRequest>({
    excludeId: excludeId || undefined,
    excludeStatus: isAdmin() ? undefined : 2,
  });
  const onReachNewsBottomHandler = () => {
    !newsLoadingStatusRef.current.isOff && !newsLoadingStatusRef.current.isLoading && setNewsPageState((prev) => prev + 1);
  };

  const getData = (params?: TGetListRequest) => {
    newsLoadingStatusRef.current.isLoading = true;
    NewsApi.getList({ ...newsFilterRef.current, ...params, order: "DESC" }).then((res) => {
      setListNewsState((prev) => (!prev || newsPageState === 1 ? res : [...prev, ...res]));
      newsLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        newsLoadingStatusRef.current.isOff = true;
      }
    });
  };

  useEffect(() => {
    getData({ offset: (newsPageState - 1) * PAGESIZE, limit: PAGESIZE });
  }, [newsPageState]);

  useEffect(() => {
    getData({ order: "desc" });
  }, []);
  return (
    <div className="page-news_list">
      {listNewsState && listNewsState.map((item, index) => <ListItem key={index} data={item} />)}
      {listNewsState === null && <LoaderIcon />}
      <InfiniteScroll onReachBottom={onReachNewsBottomHandler} amendment={100} />
    </div>
  );
};

export default List;
