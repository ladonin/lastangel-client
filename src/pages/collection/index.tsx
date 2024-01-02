/*
  import Collection from 'pages/collection'
  Страница просмотра сбора
 */
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Helmet } from "react-helmet";

import PAGES from "routing/routes";
import { DonationsApi } from "api/donations";
import { TItem } from "api/types/collections";
import { TGetListOutput as TListDonations } from "api/types/donations";
import { CollectionsApi } from "api/collections";
import { isAnonym, getDonatorName } from "helpers/donations";
import { getMainImageUrl, getAnotherImagesUrl, getVideoUrl } from "helpers/collections";
import { getVideoType, numberFriendly, textToClient } from "helpers/common";
import { SIZES_ANOTHER, SIZES_MAIN } from "constants/photos";
import { COLLECTIONS_STATUS } from "constants/collections";
import { loadItem } from "utils/localStorage";
import { isAdmin } from "utils/user";
import LoaderIcon from "components/LoaderIcon";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import BreadCrumbs from "components/BreadCrumbs";
import CopyLinkToPage from "components/CopyLinkToPage";
import MediaOriginalLinks from "components/MediaOriginalLinks";
import Modal from "components/Modal";
import flowerSrc from "icons/flower1.png";
import "./style.scss";

const Collection: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const { getMetatags } = useOutletContext<any>();
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataState, setDataState] = useState<TItem | null>(null);
  const [anotherImagesState, setAnotherImagesState] = useState<number[] | null>(null);
  const [donationsListModalOpenedState, setDonationsListModalOpenedState] = useState(false);
  const [donationsListState, setDonationsListState] = useState<TListDonations | null>(null);

  const metatags = useMemo(() => {
    if (!dataState) return false;
    const data = getMetatags();
    return {
      title: data.collection_title ? `${data.collection_title}. ${dataState.name}` : dataState.name,
      description: data.collection_description || "",
    };
  }, [dataState]);

  const getDonationsList = () => {
    if (donationsListState === null) {
      DonationsApi.getTargetList({ type: 2, target_id: Number(id) }).then((res) =>
        setDonationsListState(res)
      );
    }
  };

  const renderDonateButton = () => (
    <Button
      className="loc_donateButton"
      theme={ButtonThemes.PRIMARY}
      size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
      onClick={() => {
        navigate(`${PAGES.HELP}?target=c${id}`);
      }}
    >
      Пожертвовать
    </Button>
  );

  const renderRedactButton = () =>
    isAdmin() && (
      <Button
        className="loc_redactButton"
        theme={ButtonThemes.PRIMARY}
        size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
        onClick={() => {
          navigate(`${PAGES.ADMINISTRATION_COLLECTION_UPDATE}/${id}`);
        }}
      >
        Редактировать
      </Button>
    );

  const renderDonation = (data: TItem | null) =>
    data && (
      <div className="loc_donation">
        <div className="loc_title">Собрано:</div>
        <div className="loc_value">
          <span>{numberFriendly(parseFloat(data.collected || "0"))}</span> руб.
        </div>

        {isAdmin() && (
          <div className="loc_spent">
            Потрачено: <b>{numberFriendly(parseFloat(data.spent))}</b> руб.
          </div>
        )}

        {data.collected && (
          <div
            className="loc_additionally"
            onClick={() => {
              getDonationsList();
              setDonationsListModalOpenedState(true);
            }}
          >
            Подробнее
          </div>
        )}

        {isMobile === false && renderDonateButton()}
        {isMobile === false && renderRedactButton()}
        {isMobile === false && (
          <CopyLinkToPage
            targetText="на сбор"
            text="Рассказать о сборе друзьям"
            url={window.location.href}
          />
        )}
      </div>
    );

  const renderData = () =>
    dataState && (
      <div className="loc_data">
        <div className="loc_name">{dataState.name}</div>
        {dataState.status === COLLECTIONS_STATUS.NON_PUBLISHED && (
          <div className="loc_not_published">Не опубликован</div>
        )}

        {!!dataState.animal_name && !!dataState.animal_id && (
          <div className="loc_target_animal">
            Кому:{" "}
            <Link to={`${PAGES.PET}/${dataState.animal_id}`} className="link_3">
              {dataState.animal_name}
            </Link>
          </div>
        )}
        <div className="loc_id">ID: С{dataState.id} </div>
        <div className="loc_targetSum">
          Надо{isMobile === false && <> собрать</>}:{" "}
          <div className="loc_value">
            <span>{numberFriendly(parseFloat(dataState.target_sum))}</span> руб.
          </div>
        </div>
        {isMobile === true && renderDonation(dataState)}
        {dataState.status === COLLECTIONS_STATUS.CLOSED && (
          <div className="loc_closed">
            Сбор закрыт <img alt="загружаю" src={flowerSrc} />
          </div>
        )}
      </div>
    );

  useEffect(() => {
    id &&
      CollectionsApi.get(Number(id)).then((res) => {
        if (res === null) {
          navigate(PAGES.PAGE_404);
        }

        res && setDataState(res);
        res && res.another_images && setAnotherImagesState(JSON.parse(res.another_images));
      });
  }, [id]);

  return (
    <>
      {metatags && (
        <Helmet>
          <title>{metatags.title}</title>
          <meta name="description" content={metatags.description} />
        </Helmet>
      )}
      <div className="page-collection">
        {!!dataState && (
          <>
            <div className="loc_contentWrapper">
              <BreadCrumbs
                breadCrumbs={[{ name: "Сборы", link: PAGES.COLLECTIONS }]}
                title={dataState.name}
                showTitle={false}
              />
              <div className="loc_topWrapper">
                <div className="loc_avatar">
                  <img alt="загружаю" src={getMainImageUrl(dataState, SIZES_MAIN.SQUARE)} />
                </div>
                {isMobile === true && renderData()}

                <div className="loc_right">
                  {isMobile === false && renderData()}

                  {isMobile === true && (
                    <div
                      className="loc_description"
                      dangerouslySetInnerHTML={{ __html: textToClient(dataState.description) }}
                    />
                  )}

                  {isMobile === false && renderDonation(dataState)}
                  {isMobile === true && (
                    <div className="loc_buttonWrapper">{renderDonateButton()}</div>
                  )}
                  {isMobile === true && renderRedactButton()}
                  {isMobile === true && (
                    <CopyLinkToPage
                      targetText="на сбор"
                      text="Рассказать о сборе друзьям"
                      url={window.location.href}
                    />
                  )}

                  {isMobile === false && (
                    <div className="loc_description">{dataState.description}</div>
                  )}
                </div>
              </div>

              <div className="loc_bottomWrapper">
                {!!anotherImagesState && !!anotherImagesState.length && !!dataState && (
                  <Swiper
                    slidesPerView={1}
                    navigation
                    modules={[Autoplay, Pagination, Navigation]}
                    className="loc_slider"
                  >
                    {[...anotherImagesState].reverse().map((item, index) => (
                      <SwiperSlide key={index}>
                        <img
                          alt="загружаю"
                          className="loc_image"
                          src={getAnotherImagesUrl(dataState, item, SIZES_ANOTHER.SIZE_1200)}
                        />
                      </SwiperSlide>
                    ))}
                    <SwiperSlide>
                      <img
                        alt="загружаю"
                        className="loc_image"
                        src={getMainImageUrl(dataState, SIZES_MAIN.SIZE_1200)}
                      />
                    </SwiperSlide>
                  </Swiper>
                )}

                {dataState.video1 && (
                  <video className="loc_video" controls>
                    <source
                      src={getVideoUrl(dataState, dataState.video1)}
                      type={getVideoType(dataState.video1)}
                    />
                  </video>
                )}
                {dataState.video2 && (
                  <video className="loc_video" controls>
                    <source
                      src={getVideoUrl(dataState, dataState.video2)}
                      type={getVideoType(dataState.video2)}
                    />
                  </video>
                )}
                {dataState.video3 && (
                  <video className="loc_video" controls>
                    <source
                      src={getVideoUrl(dataState, dataState.video3)}
                      type={getVideoType(dataState.video3)}
                    />
                  </video>
                )}
              </div>
            </div>
            <MediaOriginalLinks type="collections" data={dataState} />
          </>
        )}

        <Modal
          isOpen={donationsListModalOpenedState}
          title="Подробности"
          onClose={() => {
            setDonationsListModalOpenedState(false);
          }}
          portalClassName="page-collection_donationsListModal"
        >
          <div className="loc_title">Список пожертвований на текущий сбор, руб.:</div>

          <div className="loc_content">
            {donationsListState === null ? (
              <LoaderIcon />
            ) : (
              <div className="loc_list">
                {donationsListState.map((item) => (
                  <div className="loc_item">
                    <div className={cn("loc_name", { "loc--hasLink": !!item.donator_outer_link })}>
                      {isAnonym(item) ? (
                        "Добрый помощник приюта"
                      ) : (
                        <div
                          onClick={() => {
                            item.donator_outer_link &&
                              window.open(item.donator_outer_link, "_blank");
                          }}
                        >
                          {getDonatorName(item)}
                        </div>
                      )}
                    </div>
                    <div className="loc_sum">
                      <span>{numberFriendly(item.sum)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="loc_buttons">
            <Button
              className="loc_cancelButton"
              theme={ButtonThemes.SUCCESS}
              size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
              onClick={() => {
                setDonationsListModalOpenedState(false);
              }}
            >
              Закрыть
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Collection;
