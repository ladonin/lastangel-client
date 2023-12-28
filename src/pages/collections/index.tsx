import React, { useEffect, useState, useMemo } from "react";

// const OtherComponent = React.lazy(() => import('components/header'));

import { Link, useNavigate, useOutletContext } from "react-router-dom";
import cn from "classnames";
import { Helmet } from "react-helmet";
import LoaderIcon from "components/LoaderIcon";
import { TGetListRequest, TItem as TItemCollection } from "api/types/collections";
import PAGES from "routing/routes";
import { CollectionsApi } from "api/collections";
import { getMainImageUrl } from "helpers/collections";
import flowerSrc from "icons/flower1.png";
import BreadCrumbs from "components/BreadCrumbs";
import { COLLECTIONS_STATUS } from "constants/collections";
import { numberFriendly } from "helpers/common";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { isAdmin } from "utils/user";
import "./style.scss";
import { loadItem } from "utils/localStorage";
import { SIZES_MAIN } from "../../constants/photos";

const Collections: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMemo(() => loadItem("isMobile"), []);
  const { getMetatags } = useOutletContext<any>();
  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.collections_title || "",
      description: data.collections_description || "",
    };
  }, []);
  const [listCollectionState, setListCollectionsState] = useState<TItemCollection[] | null>(null);

  const getData = (filter: TGetListRequest) => {
    CollectionsApi.getList(filter).then((res) => {
      setListCollectionsState(res);
    });
  };

  useEffect(() => {
    getData({
      status: COLLECTIONS_STATUS.PUBLISHED,
      withClosedCollections: true,
      orderComplex: "ismajor desc, status asc",
    });
  }, []);

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
            Собрано: <span className="loc_val">{numberFriendly(parseFloat(data.collected || '0'))}</span>{" "}
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
