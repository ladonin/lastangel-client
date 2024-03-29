/*
  import News from 'pages/home/_components/News'
  Компонент "Новости" для домашней страницы
 */
import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { NewsApi } from "api/news";
import { TGetListOutput, TItem } from "api/types/news";
import { getDateString } from "helpers/common";
import PAGES from "routing/routes";
import { NEWS_STATUS } from "constants/news";
import Tooltip from "components/Tooltip";
import ArrowRight from "icons/arrowRight.svg";
import PinIcon from "icons/pin.png";
import "./style.scss";

const News = () => {
  const navigate = useNavigate();
  const [listState, setListState] = useState<TGetListOutput>([]);

  const renderContent = (data: TItem) => (
    <div
      className="loc_wrapper"
      onClick={() => {
        navigate(`${PAGES.NEWS}/${data.id}`);
      }}
    >
      <div className="loc_content">
        <div className="loc_data">
          {data.status === NEWS_STATUS.NON_PUBLISHED && (
            <div className="loc_nonpublished">Не опубликован</div>
          )}

          {!!data.ismajor && (
            <div className="loc_pin">
              {" "}
              <Tooltip text="Закреплено" content={<img alt="загружаю" src={PinIcon} />} />
            </div>
          )}

          <div className="loc_created">{getDateString(data.created)}</div>
          <Link to={`${PAGES.NEWS}/${data.id}`} className="link_text loc_name">
            {data.name}
          </Link>
          <div className="loc_short_description">{data.short_description}</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    NewsApi.getList({
      offset: 0,
      limit: 4,
      orderComplex: "ismajor desc, id desc",
      excludeStatus: 2 /* isAdmin() ? undefined : 2 */,
    }).then((res) => {
      setListState(res);
    });
  }, []);

  return listState.length ? (
    <div className="page-home_news">
      <Link to={`${PAGES.NEWS}`} className="link_text loc_title">
        Новости
      </Link>
      <div className="loc_block">
        {listState.map((item, index) => (
          <div
            className={cn("loc_item", {
              "loc--non_published": item.status === NEWS_STATUS.NON_PUBLISHED,
            })}
            key={index}
          >
            {renderContent(item)}
          </div>
        ))}
      </div>
      <Link to={`${PAGES.NEWS}`} className="loc_seeAll link_text">
        Смотреть все <ArrowRight />
      </Link>
    </div>
  ) : null;
};

export default News;
