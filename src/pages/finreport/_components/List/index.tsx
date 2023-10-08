import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import PAGES from "routing/routes";
import { DonationsApi } from "api/donations";
import { getDateString, numberFriendly } from "helpers/common";
import { TGetListRequest, TItem, TItem as TDonationItem } from "api/types/donations";
import InfiniteScroll from "components/InfiniteScroll";
import Tooltip from "components/Tooltip";
import { prepareType as prepareDonationType } from "helpers/donations";
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

  const navigate = useNavigate();

  const isAnonym = (item: TDonationItem) =>
    !(
      item.donator_fullname ||
      item.donator_firstname ||
      item.donator_middlename ||
      item.donator_lastname
    );
  const getDonatorName = (item: TDonationItem) =>
    (
      item.donator_fullname ||
      `${item.donator_firstname} ${item.donator_middlename} ${item.donator_lastname}`
    ).toUpperCase();

  return (
    <div className="page-finreport_list">
      {listState &&
        listState.map((item, index) => (
          <div key={index} className="loc_item">
            <Tooltip
              text="Дата регистрации доната"
              className="loc_created"
              content={getDateString(item.created)}
            />

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
          </div>
        ))}
      {listState === null && <LoaderIcon />}
      <InfiniteScroll onReachBottom={onReachBottomHandler} amendment={100} />
    </div>
  );
};

export default List;
