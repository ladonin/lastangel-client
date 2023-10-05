/*
  import News from 'pages/home/_components/News'
 */

import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { NewsApi } from "api/news";
import { getDateString } from "helpers/common";
import { TGetListOutput, TItem } from "api/types/news";
import ArrowRight from "icons/arrowRight.svg";
import PAGES from "routing/routes";
import { NEWS_STATUS } from "constants/news";
import "./style.scss";

const News = () => {
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
        navigate(`${PAGES.NEWS}/${data.id}`);
      }}
    >
      <div className="loc_content">
        <div className="loc_data">
          {data.status === NEWS_STATUS.NON_PUBLISHED && <div className="loc_nonpublished">Не опубликован</div>}
          <div className="loc_created">{getDateString(data.created)}</div>
          <div className="loc_name">{data.name}</div>
          <div className="loc_short_description">{data.short_description}</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (isMobileState === null) return;
    NewsApi.getList({ offset: 0, limit: 5, order: "desc", excludeStatus: 2 /* isAdmin() ? undefined : 2 */ }).then((res) => {
      setListState(res);
    });
  }, [isMobileState]);
  return listState.length ? (
    <div className="page-home_news">
      <div
        className="loc_title"
        onClick={() => {
          navigate(`${PAGES.NEWS}`);
        }}
      >
        Новости
      </div>
      <div className="loc_block">
        {listState.map((item, index) => (
          <div className={cn("loc_item", { "loc--non_published": item.status === NEWS_STATUS.NON_PUBLISHED })} key={index}>
            {renderContent(item)}
          </div>
        ))}
      </div>
      <div
        className="loc_seeAll"
        onClick={() => {
          navigate(`${PAGES.NEWS}`);
        }}
      >
        Смотреть все <ArrowRight />
      </div>
    </div>
  ) : null;
};

export default News;
