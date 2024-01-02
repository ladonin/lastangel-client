/*
  import Collections from 'pages/collections'
  Страница списка сборов
 */
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import cn from "classnames";
import { Helmet } from "react-helmet";

import PAGES from "routing/routes";
import { TGetListRequest, TItem as TItemCollection } from "api/types/collections";
import { CollectionsApi } from "api/collections";
import { numberFriendly } from "helpers/common";
import { getMainImageUrl } from "helpers/collections";
import { COLLECTIONS_STATUS } from "constants/collections";
import { SIZES_MAIN } from "constants/photos";
import { isAdmin } from "utils/user";
import { loadItem } from "utils/localStorage";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import LoaderIcon from "components/LoaderIcon";
import BreadCrumbs from "components/BreadCrumbs";
import flowerSrc from "icons/flower1.png";
import "./style.scss";

const Collections: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();
  const { getMetatags } = useOutletContext<any>();

  const [listCollectionState, setListCollectionsState] = useState<TItemCollection[] | null>(null);

  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.collections_title || "",
      description: data.collections_description || "",
    };
  }, []);

  const getData = (filter: TGetListRequest) => {
    CollectionsApi.getList(filter).then((res) => {
      setListCollectionsState(res);
    });
  };

  const renderCollectionsContent = (data: TItemCollection) => (
    <>
      <div className="loc_image">
        <Link to={`${PAGES.COLLECTION}/${data.id}`} className="link_img">
          <img alt="загружаю" src={getMainImageUrl(data, SIZES_MAIN.SQUARE)} />
        </Link>
        {data.status === COLLECTIONS_STATUS.CLOSED && (
          <div className="loc_closed">
            Сбор закрыт <img alt="загружаю" src={flowerSrc} />
          </div>
        )}
      </div>
      <div className="loc_content">
        <Button
          className="loc_button"
          theme={ButtonThemes.PRIMARY}
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
          onClick={() => {
            navigate(`${PAGES.COLLECTION}/${data.id}`);
          }}
        >
          Подробнее
        </Button>

        <div className="loc_data">
          <Link to={`${PAGES.COLLECTION}/${data.id}`} className="loc_name link_text">
            {data.name}
          </Link>
          {/* <div className={`loc_type loc--type_${data.type}`}>{prepareType(data.type)}</div> */}
          <div className="loc_target_sum">
            Нужно:{" "}
            <span className="loc_val">
              {numberFriendly(parseFloat(data.target_sum))?.toLocaleString() || 0}
            </span>{" "}
            руб.
          </div>

          <div className="loc_collected">
            Собрано:{" "}
            <span className="loc_val">{numberFriendly(parseFloat(data.collected || "0"))}</span>{" "}
            руб.
          </div>

          {isAdmin() && (
            <div className="loc_spent">
              Потрачено: <span className="loc_val">{numberFriendly(parseFloat(data.spent))}</span>{" "}
              руб.
            </div>
          )}
          <div className="loc_description">{data.short_description}</div>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    getData({
      status: COLLECTIONS_STATUS.PUBLISHED,
      withClosedCollections: true,
      orderComplex: "ismajor desc, status asc",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-collections">
        <BreadCrumbs title="Сборы" />

        <div className="loc_list">
          {listCollectionState &&
            listCollectionState.map((item, index) => (
              <div key={index} className={cn("loc_wrapper ", `loc--status_${item.status}`)}>
                <div className="loc_item">{renderCollectionsContent(item)}</div>
              </div>
            ))}
          {listCollectionState && !listCollectionState.length && (
            <div className="loc_noCollections">На данный момент сборов нет</div>
          )}
          {listCollectionState === null && <LoaderIcon />}
        </div>
      </div>
    </>
  );
};

export default Collections;
