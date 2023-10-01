/*
  import Collections from 'pages/home/components/Collections'
 */

import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { CollectionsApi } from "api/collections";
import { getMainImageUrl } from "helpers/collections";
import { COLLECTIONS_STATUS } from "constants/collections";
import { TGetListOutput, TItem } from "api/types/collections";
import ArrowRight from "icons/arrowRight.svg";
import PAGES from "routing/routes";
import { numberFriendly } from "helpers/common";
import "./style.scss";
import { SIZES_MAIN } from "../../../../constants/photos";

const Collections = () => {
  const [listState, setListState] = useState<TGetListOutput>([]);
  const navigate = useNavigate();
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  const renderContent = (data: TItem) => (
    <div
      className="loc_wrapper"
      onClick={() => {
        navigate(`${PAGES.COLLECTION}/${data.id}`);
      }}
    >
      <div className="loc_image">
        <img alt="nophoto" src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
      </div>
      <div className="loc_content">
        <div className="loc_data">
          <div className="loc_name">{data.name}</div>

          <div className="loc_need">
            Необходимо: <span className="loc_val">{numberFriendly(data.target_sum)}</span> р.
          </div>
          <div className="loc_collected">
            Собрано: <span className="loc_val">{numberFriendly(data.collected)}</span> р.
          </div>
          <div className="loc_description">{data.short_description}</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (isMobileState === null) return;

    CollectionsApi.getList({ status: COLLECTIONS_STATUS.PUBLISHED, offset: 0, limit: isMobileState ? 4 : 3 }).then((res) => {
      setListState(res);
    });
  }, [isMobileState]);
  return listState.length ? (
    <div className={cn("page-home_collections", { "loc--isMobile": isMobileState })}>
      <div
        className="loc_title"
        onClick={() => {
          navigate(PAGES.COLLECTIONS);
        }}
      >
        Сборы
      </div>
      <div className="loc_block">
        {listState.map((item, index) => (
          <div className="loc_item" key={index}>
            {renderContent(item)}
          </div>
        ))}
      </div>
      <div
        className="loc_seeAll"
        onClick={() => {
          navigate(`${PAGES.COLLECTIONS}`);
        }}
      >
        Смотреть все <ArrowRight />
      </div>
    </div>
  ) : null;
};

export default Collections;
