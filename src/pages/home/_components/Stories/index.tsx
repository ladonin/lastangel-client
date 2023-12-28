/*
  import Stories from 'pages/home/_components/Stories'
 */

import React, { useEffect, useState, useMemo } from "react";
import "react-tabs/style/react-tabs.css";
import cn from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { StoriesApi } from "api/stories";
import { getDateString } from "helpers/common";
import { TGetListOutput, TItem } from "api/types/stories";
import ArrowRight from "icons/arrowRight.svg";
import PAGES from "routing/routes";
import { STORIES_STATUS } from "constants/stories";
import { loadItem } from "utils/localStorage";
import Tooltip from "components/Tooltip";
import PinIcon from "icons/pin.png";
import "./style.scss";

const Stories = () => {
  const [listState, setListState] = useState<TGetListOutput>([]);
  const navigate = useNavigate();
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  const renderContent = (data: TItem) => (
    <div
      className="loc_wrapper"
      onClick={() => {
        navigate(`${PAGES.STORY}/${data.id}`);
      }}
    >
      <div className="loc_content">
        <div className="loc_data">
          {data.status === STORIES_STATUS.NON_PUBLISHED && (
            <div className="loc_nonpublished">Не опубликован</div>
          )}
          {!!data.ismajor && (
            <div className="loc_pin">
              {" "}
              <Tooltip text="Закреплено" content={<img alt="загружаю" src={PinIcon} />} />
            </div>
          )}
          <div className="loc_created">{getDateString(data.created)}</div>

          <Link to={`${PAGES.STORY}/${data.id}`} className="link_text loc_name">
            {data.name}
          </Link>
          <div className="loc_short_description">{data.short_description}</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (isMobile === null) return;
    StoriesApi.getList({
      offset: 0,
      limit: 5,
      orderComplex: "ismajor desc, id desc",
      excludeStatus: 2 /* isAdmin() ? undefined : 2 */,
    }).then((res) => {
      setListState(res);
    });
  }, []);
  return listState.length ? (
    <div className="page-home_stories">
      <Link to={`${PAGES.STORIES}`} className="link_text loc_title">
        Истории
      </Link>
      <div className="loc_block">
        {listState.map((item, index) => (
          <div
            className={cn("loc_item", {
              "loc--non_published": item.status === STORIES_STATUS.NON_PUBLISHED,
            })}
            key={index}
          >
            {renderContent(item)}
          </div>
        ))}
      </div>

      <Link to={`${PAGES.STORIES}`} className="loc_seeAll link_text">
        Смотреть все <ArrowRight />
      </Link>
    </div>
  ) : null;
};

export default Stories;
