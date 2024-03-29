/*
  import Collections from 'pages/home/_components/Collections'
  Компонент "Сборы" для домашней страницы
 */
import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { Link, useNavigate } from "react-router-dom";
import PAGES from "routing/routes";
import { CollectionsApi } from "api/collections";
import { TGetListOutput, TItem } from "api/types/collections";
import { numberFriendly } from "helpers/common";
import { getMainImageUrl } from "helpers/collections";
import { COLLECTIONS_STATUS } from "constants/collections";
import { SIZES_MAIN } from "constants/photos";
import { loadItem } from "utils/localStorage";
import ArrowRight from "icons/arrowRight.svg";
import "./style.scss";

const Collections = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const [listState, setListState] = useState<TGetListOutput>([]);

  const maxCollections = isMobile ? 4 : 3;

  const renderContent = (data: TItem) => (
    <div
      className="loc_wrapper"
      onClick={() => {
        navigate(`${PAGES.COLLECTION}/${data.id}`);
      }}
    >
      <div className="loc_image">
        <Link to={`${PAGES.COLLECTION}/${data.id}`} className="link_img">
          <img alt="загружаю" src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
        </Link>
      </div>
      <div className="loc_content">
        <div className="loc_data">
          <Link to={`${PAGES.COLLECTION}/${data.id}`} className="link_text loc_name">
            {data.name}
          </Link>

          <div className="loc_need">
            Надо: <span className="loc_val">{numberFriendly(parseFloat(data.target_sum))}</span> р.
          </div>
          <div className="loc_collected">
            Собрано:{" "}
            <span className="loc_val">{numberFriendly(parseFloat(data.collected || "0"))}</span> р.
          </div>
          <div className="loc_description">{data.short_description}</div>
        </div>
      </div>
    </div>
  );

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
