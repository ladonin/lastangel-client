import React, { useEffect, useState, useRef } from "react";
import LoaderIcon from "components/LoaderIcon";
import { StoriesApi } from "api/stories";
import { TGetListRequest, TItem } from "api/types/stories";
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
  const [pageState, setPageState] = useState<number>(1);
  const [listState, setListState] = useState<TItem[] | null>(null);

  const loadingStatusRef = useRef({ isLoading: false, isOff: false });
  const filterRef = useRef<TGetListRequest>({
    excludeId: excludeId || undefined,
    excludeStatus: isAdmin() ? undefined : 2,
  });
  const onReachBottomHandler = () => {
    !loadingStatusRef.current.isOff && !loadingStatusRef.current.isLoading && setPageState((prev) => prev + 1);
  };

  const getData = (params?: TGetListRequest) => {
    loadingStatusRef.current.isLoading = true;
    StoriesApi.getList({ ...filterRef.current, ...params, order: "DESC" }).then((res) => {
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
    getData({ order: "desc" });
  }, []);
  return (
    <div className="page-stories_list">
      {listState && listState.map((item, index) => <ListItem key={index} data={item} />)}
      {listState === null && <LoaderIcon />}
      <InfiniteScroll onReachBottom={onReachBottomHandler} amendment={100} />
    </div>
  );
};

export default List;
