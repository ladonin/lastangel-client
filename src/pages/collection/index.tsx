import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { isMobile } from "react-device-detect";

import Modal from "components/Modal";
import { DonationsApi } from "api/donations";
import { TItem } from "api/types/collections";
import { TGetListOutput as TListDonations, TItem as TDonationItem } from "api/types/donations";
import LoaderIcon from "components/LoaderIcon";
import { CollectionsApi } from "api/collections";
import { getMainImageUrl, getAnotherImagesUrl, getVideoUrl } from "helpers/collections";
import { getVideoType, numberFriendly } from "helpers/common";
import { SIZES_ANOTHER, SIZES_MAIN } from "constants/photos";
import "./style.scss";

import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { isAdmin } from "utils/user";
import PAGES from "routing/routes";
import { COLLECTIONS_STATUS } from "constants/collections";
import flowerSrc from "icons/flower1.png";
import BreadCrumbs from "components/BreadCrumbs";
import CopyLinkToPage from "components/CopyLinkToPage";

// Ленивая загрузка модуля
// const OtherComponent = React.lazy(() => import('components/header'));
// import("components/foo").then(math => {
//     console.log(math.add(16, 26));
// });
const Collection: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataState, setDataState] = useState<TItem | null>(null);
  const [anotherImagesState, setAnotherImagesState] = useState<number[] | null>(null);
  const [donationsListModalOpenedState, setDonationsListModalOpenedState] = useState(false);
  const [donationsListState, setDonationsListState] = useState<TListDonations | null>(null);
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  useEffect(() => {
    id &&
      CollectionsApi.get(Number(id)).then((res) => {
        setDataState(res);
        res.another_images && setAnotherImagesState(JSON.parse(res.another_images));
      });
  }, [id]);

  const getDonationsList = () => {
    if (donationsListState === null) {
      DonationsApi.getTargetList({ type: 2, target_id: Number(id) }).then((res) => setDonationsListState(res));
    }
  };
  const isAnonym = (item: TDonationItem) =>
    !(item.donator_fullname || item.donator_firstname || item.donator_middlename || item.donator_lastname);
  const getDonatorName = (item: TDonationItem) =>
    (item.donator_fullname || `${item.donator_firstname} ${item.donator_middlename} ${item.donator_lastname}`).toUpperCase();

  const renderDonateButton = () => (
    <Button
      className="loc_donateButton"
      theme={ButtonThemes.PRIMARY}
      size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
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
        size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
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
          <span>{numberFriendly(data.collected)}</span> руб.
        </div>
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

        {isMobileState === false && renderDonateButton()}
        {isMobileState === false && renderRedactButton()}
        {isMobileState === false && <CopyLinkToPage text="Рассказать о сборе друзьям" url={window.location.href} />}
      </div>
    );
  const renderData = () =>
    dataState && (
      <div className="loc_data">
        <div className="loc_name">{dataState.name}</div>
        {dataState.status === COLLECTIONS_STATUS.NON_PUBLISHED && <div className="loc_not_published">Не опубликован</div>}

        {!!dataState.animal_name && !!dataState.animal_id && (
          <div className="loc_target_animal">
            Кому:{" "}
            <span
              onClick={() => {
                navigate(`${PAGES.PET}/${dataState.animal_id}`);
              }}
            >
              {dataState.animal_name}
            </span>
          </div>
        )}
        <div className="loc_id">ID: С{dataState.id} </div>
        <div className="loc_targetSum">
          Необходимо {isMobileState === false && <>собрать</>}: <span>{numberFriendly(dataState.target_sum)}</span> руб.
        </div>
        {isMobileState === true && renderDonation(dataState)}
        {dataState.status === COLLECTIONS_STATUS.CLOSED && (
          <div className="loc_closed">
            Сбор закрыт <img alt="nophoto" src={flowerSrc} />
          </div>
        )}
      </div>
    );

  return (
    <div className="page-collection">
      {!!dataState && (
        <div className="loc_contentWrapper">
          <BreadCrumbs breadCrumbs={[{ name: "Сборы", link: PAGES.COLLECTIONS }]} title={dataState.name} />
          <div className="loc_topWrapper">
            <div className="loc_avatar">
              <img alt="not found" src={getMainImageUrl(dataState, SIZES_MAIN.SQUARE)} />
            </div>
            {isMobileState === true && renderData()}

            <div className="loc_right">
              {isMobileState === false && renderData()}

              {isMobileState === true && <div className="loc_description">{dataState.description}</div>}

              {isMobileState === false && renderDonation(dataState)}
              {isMobileState === true && <div className="loc_buttonWrapper">{renderDonateButton()}</div>}
              {isMobileState === true && renderRedactButton()}
              {isMobileState === true && <CopyLinkToPage text="Рассказать о сборе друзьям" url={window.location.href} />}

              {isMobileState === false && <div className="loc_description">{dataState.description}</div>}
            </div>
          </div>

          <div className="loc_bottomWrapper">
            {!!anotherImagesState && !!anotherImagesState.length && !!dataState && (
              <Swiper slidesPerView={1} navigation modules={[Autoplay, Pagination, Navigation]} className="loc_slider">
                {[...anotherImagesState].reverse().map((item, index) => (
                  <SwiperSlide key={index}>
                    <img
                      alt="nophoto"
                      className="loc_image"
                      src={getAnotherImagesUrl(dataState, item, SIZES_ANOTHER.SIZE_1200)}
                    />
                  </SwiperSlide>
                ))}
                <SwiperSlide>
                  <img alt="nophoto" className="loc_image" src={getMainImageUrl(dataState, SIZES_MAIN.SIZE_1200)} />
                </SwiperSlide>
              </Swiper>
            )}

            {dataState.video1 && (
              <video className="loc_video" controls>
                <source src={getVideoUrl(dataState, dataState.video1)} type={getVideoType(dataState.video1)} />
              </video>
            )}
            {dataState.video2 && (
              <video className="loc_video" controls>
                <source src={getVideoUrl(dataState, dataState.video2)} type={getVideoType(dataState.video2)} />
              </video>
            )}
            {dataState.video3 && (
              <video className="loc_video" controls>
                <source src={getVideoUrl(dataState, dataState.video3)} type={getVideoType(dataState.video3)} />
              </video>
            )}
          </div>
        </div>
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
                          item.donator_outer_link && window.open(item.donator_outer_link, "_blank");
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
            size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.LARGE}
            onClick={() => {
              setDonationsListModalOpenedState(false);
            }}
          >
            Закрыть
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Collection;
