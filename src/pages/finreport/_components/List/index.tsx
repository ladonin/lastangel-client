import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import PAGES from "routing/routes";
import { DonationsApi } from "api/donations";
import { getDateString, getDateYMD, monthMappings, numberFriendly } from "helpers/common";
import { TGetListRequest, TItem, TItem as TDonationItem } from "api/types/donations";
import InfiniteScroll from "components/InfiniteScroll";
import Tooltip from "components/Tooltip";
import { prepareType as prepareDonationType, isAnonym, getDonatorName } from "helpers/donations";
import LoaderIcon from "components/LoaderIcon";
// const OtherComponent = React.lazy(() => import('components/header'));

import "./style.scss";

const PAGESIZE = 20;
const List = () => {
  const [pageState, setPageState] = useState<number>(1);
  const [listState, setListState] = useState<TItem[] | null>(null);

  const loadingStatusRef = useRef({ isLoading: false, isOff: false });

  const onReachBottomHandler = () => {
    !loadingStatusRef.current.isOff &&
      !loadingStatusRef.current.isLoading &&
      setPageState((prev) => prev + 1);
  };

  const getData = (params?: TGetListRequest) => {
    loadingStatusRef.current.isLoading = true;
    DonationsApi.getList(params).then((res) => {
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
  const dateRef = useRef<null | number>(null);
  
  useEffect(() => {
    dateRef.current = null;
  }, [listState]);
  
  return (
    <div className="page-finreport_list">
      {listState &&
        listState.map((item, index) => {
          const date = new Date(item.created * 1000);
          const month: number = date.getMonth();
          const year: number = date.getFullYear();
          let showMonthYear = false;
          if (dateRef.current === null || dateRef.current !== month) {
            showMonthYear = true;
          }
          dateRef.current = month;

          return (
            <>
              {showMonthYear && (
                <div className="loc_month-year">
                  {monthMappings[month]} {year}
                </div>
              )}

              <div key={index} className={cn("loc_item", `loc--month_${month}`)}>
                <div className={cn("loc_name", { "loc--hasLink": !!item.donator_outer_link })}>
                  {isAnonym(item) ? (
                    "Добрый помощник приюта"
                  ) : (
                    <div
                      onClick={() => {
                        item.donator_outer_link && window.open(item.donator_outer_link, "_blank");
                      }}
                    >
                      {getDonatorName(item)}
                    </div>
                  )}
                </div>
                <div className="loc_sum">
                  <span>{numberFriendly(item.sum)}</span> руб.
                </div>
                <div className="loc_delimiter" />
                <div className="loc_target">
                  {!!item.target_name && !!item.target_id ? (
                    <Link
                      to={`${item.type === 1 ? PAGES.PET : PAGES.COLLECTION}/${item.target_id}`}
                      className={`loc_targetName loc--type_${item.type} link_text`}
                    >
                      {item.target_name}
                    </Link>
                  ) : (
                    <div className="loc_deletedTarget">{item.target_print_name}</div>
                  )}
                  {!item.target_id && (
                    <div className={`loc_targetName loc--type_${item.type}`}>
                      {prepareDonationType(item.type)}
                    </div>
                  )}
                </div>
                <Tooltip
                  text="Дата регистрации доната"
                  className="loc_created"
                  content={getDateYMD(item.created)}
                />
              </div>
            </>
          );
        })}
      {listState === null && <LoaderIcon />}
      <InfiniteScroll onReachBottom={onReachBottomHandler} amendment={100} />
    </div>
  );
};

export default List;
