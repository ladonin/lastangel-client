import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Lazy, Navigation, Pagination } from "swiper";
import { isMobile } from "react-device-detect";
import { ANIMALS_STATUS } from "constants/animals";
import { SIZES_ANOTHER, SIZES_MAIN } from "constants/photos";
import Modal from "components/Modal";
import { DonationsApi } from "api/donations";
import { TItem } from "api/types/animals";
import { TGetListOutput as TListDonations, TItem as TDonationItem } from "api/types/donations";
import LoaderIcon from "components/LoaderIcon";
import { TItem as TCollectionItem } from "api/types/collections";
import { AnimalsApi } from "api/animals";
import CopyLinkToPage from "components/CopyLinkToPage";
import PetDonationIcon from "components/PetDonationIcon";
import MediaOriginalLinks from "components/MediaOriginalLinks";
import {
  getMainImageUrl,
  prepareAge,
  prepareGraft,
  prepareSex,
  prepareSterilized,
  prepareStatus,
  prepareStatusCode,
  getAnotherImagesUrl,
  getVideoUrl,
} from "helpers/animals";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { isAdmin } from "utils/user";
import PAGES from "routing/routes";
import BreadCrumbs from "components/BreadCrumbs";
import { getVideoType, numberFriendly, textToClient } from "helpers/common";
import flowerSrc from "icons/flower1.png";
import PetsList from "./_components/PetsList";
// Ленивая загрузка модуля
// const OtherComponent = React.lazy(() => import('components/header'));
// import("components/foo").then(math => {
//     console.log(math.add(16, 26));
// });
import "./style.scss";

const Pet: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataState, setDataState] = useState<TItem | null>(null);
  const [collectionsState, setCollectionsState] = useState<TCollectionItem[] | null>(null);
  const [anotherImagesState, setAnotherImagesState] = useState<number[] | null>(null);
  const [donationsListModalOpenedState, setDonationsListModalOpenedState] = useState(false);
  const [donationsListState, setDonationsListState] = useState<TListDonations | null>(null);
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (id) {
      setIsLoadingState(true);
      AnimalsApi.get(Number(id)).then((res) => {
        res && setIsLoadingState(false);
        res && setDataState(res);
        res && res.another_images && setAnotherImagesState(JSON.parse(res.another_images));
      });

      AnimalsApi.getCollections(Number(id)).then((res) => {
        setCollectionsState(res);
      });
    }
  }, [id]);

  const getDonationsList = () => {
    if (donationsListState === null) {
      DonationsApi.getTargetList({ type: 1, target_id: Number(id) }).then((res) =>
        setDonationsListState(res)
      );
    }
  };
  const renderRedactButton = (data: TItem) =>
    isAdmin() ? (
      <Button
        className="loc_redactButton"
        theme={ButtonThemes.PRIMARY}
        size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
        onClick={() => {
          navigate(`${PAGES.ADMINISTRATION_PET_UPDATE}/${data.id}`);
        }}
      >
        Редактировать
      </Button>
    ) : null;
  const isHere = (status: number) =>
    status !== ANIMALS_STATUS.AT_HOME && status !== ANIMALS_STATUS.DIED;
  const isAnonym = (item: TDonationItem) =>
    !(
      item.donator_fullname ||
      item.donator_firstname ||
      item.donator_middlename ||
      item.donator_lastname
    );
  const getDonatorName = (item: TDonationItem) =>
    (
      item.donator_fullname ||
      `${item.donator_firstname} ${item.donator_middlename} ${item.donator_lastname}`
    ).toUpperCase();
  const renderCollections = () =>
    collectionsState &&
    !!collectionsState.length && (
      <div className="loc_collections">
        <div className="loc_title">Открытые сборы:</div>

        {collectionsState.map((item, index) => (
          <Link
            key={index}
            to={`${PAGES.COLLECTION}/${item.id}`}
            className={cn("loc_item", "link_text", `loc--type_${item.type}`)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    );
  const renderData = () =>
    dataState && (
      <div
        className="loc_data"
        style={isMobileState === false && !isHere(dataState.status) ? { width: "100%" } : {}}
      >
        <div className="loc_name">{dataState.name}</div>
        {dataState.is_published === 0 && <div className="loc_not_published">Не опубликовано</div>}
        {(dataState.status !== ANIMALS_STATUS.MEMBERS ||
          (dataState.need_medicine !== null && dataState.need_medicine > 0)) && (
          <>
            {(dataState.status === ANIMALS_STATUS.INVALID ||
              dataState.status === ANIMALS_STATUS.SPINAL) &&
              !!dataState.need_medicine && (
                <div
                  className={`loc_status loc--status_${prepareStatusCode(dataState.status, null)}`}
                  style={{ marginBottom: 0 }}
                >
                  {prepareStatus(dataState.status, null)}
                </div>
              )}

            <div
              className={`loc_status loc--status_${prepareStatusCode(
                dataState.status,
                dataState.need_medicine
              )}`}
            >
              {dataState.status === ANIMALS_STATUS.AT_HOME && <img alt="." src={flowerSrc} />}
              {prepareStatus(dataState.status, dataState.need_medicine, dataState.sex)}
            </div>
          </>
        )}

        {isHere(dataState.status) && <div className="loc_id">№: {dataState.id} </div>}
        {dataState.birthdate && (
          <div className="loc_age">
            Возраст: <span>{prepareAge(dataState.birthdate)}</span>
          </div>
        )}
        {!dataState.birthdate && (
          <div className="loc_age">
            Возраст: <span>(точный возраст неизвестен)</span>
          </div>
        )}
        <div className="loc_breed">
          Порода: <span>{dataState.breed || "неизвестна"}</span>
        </div>
        {isHere(dataState.status) && (
          <div className="loc_parameters">
            <div className={`loc_sex ${dataState.sex === 1 ? "loc--male" : "loc--female"}`}>
              {prepareSex(dataState.sex)}
              <span>,</span>
            </div>

            <div className="loc_grafted">{prepareGraft(dataState.grafted, dataState.sex)},</div>
            <div className="loc_sterilized">
              {prepareSterilized(dataState.sterilized, dataState.sex)}
            </div>
          </div>
        )}

        {!isHere(dataState.status) && isMobileState === false && (
          <div
            className="loc_description"
            dangerouslySetInnerHTML={{ __html: textToClient(dataState.description) }}
          />
        )}
      </div>
    );

  const renderDisclaimer = () => (
    <div className="disclaimer">
      <span className="orange">*</span> - собранные средства идут на кормление (покупка специальных
      сухих кормов, готовка еды - каши, супы и т.д.), уход (регулярная мойка, особенно это касается
      "спинальников", расчесывание, стрижка когтей и пр процедуры; иногда данные процедуры
      многократно усложняются при работе с "дикими" животными приюта, которые ранее получили
      психическую травму, либо никогда не жили с человеком), уборку за питомцем, содержание в
      вольере либо в доме (в зависимости от возраста и состояния здоровья), транспорт, регулярный
      медицинский осмотр, оплату электричества, отопления (в холодное время), воды и пр. расходы.
    </div>
  );

  return (
    <div className="page-pet">
      {!!dataState && (
        <>
          <BreadCrumbs
            breadCrumbs={[{ name: "Наши питомцы", link: PAGES.PETS }]}
            title={dataState.name}
          />
          <PetsList currentId={Number(id)} />

          <div className="loc_contentWrapper">
            {isLoadingState && <div className="loc_loader" />}
            <div className="loc_topWrapper">
              <div className="loc_avatar">
                <img
                  alt="not found"
                  className={dataState.status === ANIMALS_STATUS.DIED ? "loc--died" : ""}
                  src={getMainImageUrl(dataState, SIZES_MAIN.SQUARE)}
                />

                {!isMobile && isHere(dataState.status) && (
                  <div className="loc_donationIcon">
                    <PetDonationIcon pet={dataState} />
                  </div>
                )}
              </div>
              {isMobileState === true && renderData()}
              <div className="loc_right">
                {isMobileState === false && renderData()}

                {isMobileState === true && (
                  <div className="loc_description">{dataState.description}</div>
                )}
                {isMobileState === true && renderCollections()}
                {isMobileState === false && !isHere(dataState.status) && (
                  <div className="margin_t24">{renderRedactButton(dataState)}</div>
                )}
                {isMobileState === true &&
                  !isHere(dataState.status) &&
                  renderRedactButton(dataState)}
                {isHere(dataState.status) && (
                  <>
                    <div className="loc_donation">
                      <div className="loc_title">
                        Собрано за последние 30 дней <span className="orange">*</span>:
                      </div>
                      <div className="loc_value">
                        <span>{numberFriendly(dataState.collected)}</span> руб.
                      </div>
                      {dataState.collected && (
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
                      <div className="loc_buttonWrapper">
                        {isMobile && isHere(dataState.status) && (
                          <div className="loc_donationIcon">
                            <PetDonationIcon pet={dataState} />
                          </div>
                        )}
                        <Button
                          className="loc_donateButton"
                          theme={ButtonThemes.SUCCESS}
                          size={isMobileState ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
                          onClick={() => {
                            navigate(`${PAGES.HELP}?target=${id}`);
                          }}
                        >
                          Покормить
                        </Button>
                        <CopyLinkToPage
                          targetText="на новость"
                          text="Рассказать о питомце друзьям"
                          url={window.location.href}
                        />
                      </div>
                      {renderRedactButton(dataState)}
                    </div>
                    {isMobileState === false && renderCollections()}
                    {isMobileState === false && (
                      <div className="loc_description">{dataState.description}</div>
                    )}
                    {isMobileState === false && renderDisclaimer()}
                  </>
                )}
              </div>
            </div>

            <div className="loc_bottomWrapper">
              {isMobileState === true && renderDisclaimer()}
              {!!anotherImagesState && !!anotherImagesState.length && !!dataState && (
                <>
                  {isLoadingState ? (
                    <div className="loc_fakephotoalbum" />
                  ) : (
                    <Swiper
                      slidesPerView={1}
                      navigation
                      modules={[Lazy, Autoplay, Pagination, Navigation]}
                      initialSlide={0}
                      lazy={{
                        enabled: true,
                        loadPrevNext: true,
                      }}
                      className="loc_slider"
                    >
                      {[...anotherImagesState].reverse().map((item, index) => (
                        <SwiperSlide key={index}>
                          {index === 1 ? (
                            <img
                              alt="."
                              className="loc_image"
                              src={getAnotherImagesUrl(dataState, item, SIZES_ANOTHER.SIZE_1200)}
                            />
                          ) : (
                            <img
                              alt="."
                              data-src={getAnotherImagesUrl(
                                dataState,
                                item,
                                SIZES_ANOTHER.SIZE_1200
                              )}
                              className="loc_image swiper-lazy"
                              loading="lazy"
                            />
                          )}
                        </SwiperSlide>
                      ))}
                      <SwiperSlide>
                        <img
                          alt="."
                          className="loc_image"
                          src={getMainImageUrl(dataState, SIZES_MAIN.SIZE_1200)}
                        />
                      </SwiperSlide>
                    </Swiper>
                  )}
                </>
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
          <MediaOriginalLinks type="animals" data={dataState} />
        </>
      )}

      <Modal
        isOpen={donationsListModalOpenedState}
        title="Подробности"
        onClose={() => {
          setDonationsListModalOpenedState(false);
        }}
        portalClassName="page-pet_donationsListModal"
      >
        <div className="loc_title">Список пожертвований за последние 30 дней, руб.:</div>

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

export default Pet;
