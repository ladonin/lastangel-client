/*
  import Collections from 'pages/home/components/Collections'
 */

import React, { useEffect, useState, useMemo } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { CollectionsApi } from "api/collections";
import { getMainImageUrl } from "helpers/collections";
import { COLLECTIONS_STATUS } from "constants/collections";
import { TGetListOutput, TItem } from "api/types/collections";
import ArrowRight from "icons/arrowRight.svg";
import PAGES from "routing/routes";
import { numberFriendly } from "helpers/common";
import { loadItem } from "utils/localStorage";
import { SIZES_MAIN } from "constants/photos";
import "./style.scss";

const Collections = () => {
  const [listState, setListState] = useState<TGetListOutput>([]);
  const navigate = useNavigate();
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const renderContent = (data: TItem) => (
    <div
      className="loc_wrapper"
      onClick={() => {
        navigate(`${PAGES.COLLECTION}/${data.id}`);
      }}
    >
      <div className="loc_image">
        <Link to={`${PAGES.COLLECTION}/${data.id}`} className="link_img">
          <img alt="." src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
        </Link>
      </div>
      <div className="loc_content">
        <div className="loc_data">
          <Link to={`${PAGES.COLLECTION}/${data.id}`} className="link_text loc_name">
            {data.name}
          </Link>

          <div className="loc_need">
            Надо: <span className="loc_val">{numberFriendly(data.target_sum)}</span> р.
          </div>
          <div className="loc_collected">
            Собрано: <span className="loc_val">{numberFriendly(data.collected)}</span> р.
          </div>
          <div className="loc_description">{data.short_description}</div>
        </div>
      </div>
    </div>
  );
  const maxCollections = isMobile ? 4 : 3;
  useEffect(() => {
    CollectionsApi.getList({
      status: COLLECTIONS_STATUS.PUBLISHED,
      offset: 0,
      limit: maxCollections,
      order: "ismajor",
      order_type: "desc",
    }).then((res) => {
      setListState(res);
    });
  }, []);
  return listState.length ? (
    <div className={cn("page-home_collections", { "loc--isMobile": isMobile })}>
      <Link to={PAGES.COLLECTIONS} className="link_text loc_title">
        Сборы
      </Link>

      <div className="loc_block">
        {listState.map((item, index) => (
          <div className="loc_item" key={index}>
            {renderContent(item)}
          </div>
        ))}
      </div>
      {listState.length > maxCollections && (
        <Link to={PAGES.COLLECTIONS} className="link_text loc_seeAll">
          Смотреть все <ArrowRight />
        </Link>
      )}
    </div>
  ) : null;
};

export default Collections;
