import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Lazy, Navigation, Pagination } from "swiper";
import { Helmet } from "react-helmet";
import { SIZES_ANOTHER, SIZES_MAIN } from "constants/photos";
import { TItem } from "api/types/volunteers";
import { VolunteersApi } from "api/volunteers";
import MediaOriginalLinks from "components/MediaOriginalLinks";
import { getMainImageUrl, getAnotherImagesUrl, getVideoUrl } from "helpers/volunteers";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import { isAdmin } from "utils/user";
import PAGES from "routing/routes";
import BreadCrumbs from "components/BreadCrumbs";
import { getDateYMDFriendly, getDateYMFriendly, getVideoType, textToClient } from "helpers/common";
import { loadItem, saveItem, removeItem } from "utils/localStorage";
import VolunteersList from "./_components/VolunteersList";
// Ленивая загрузка модуля
// const OtherComponent = React.lazy(() => import('components/header'));
// import("components/foo").then(math => {
//     console.log(math.add(16, 26));
// });
import "./style.scss";
import VkLogo from "../../icons/vk_logo.png";
import OkLogo from "../../icons/ok_logo.png";
import InstLogo from "../../icons/inst_logo.png";
import { prepareAge } from "../../helpers/animals";
import PhoneImage from "../../icons/phone.png";
import { MAIN_CARD_OWNER, MAIN_PHONE } from "../../constants/donations";

const Volunteer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataState, setDataState] = useState<TItem | null>(null);
  const [anotherImagesState, setAnotherImagesState] = useState<number[] | null>(null);

  const isMobile = useMemo(() => loadItem("isMobile"), []);
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);
  const hasBack = useMemo(() => loadItem("backFromVolunteer"), []);
  const { getMetatags } = useOutletContext<any>();
  const metatags = useMemo(() => {
    if (!dataState) return false;
    const data = getMetatags();
    return {
      title: data.volunteer_title ? `${data.volunteer_title}. ${dataState.fio}` : dataState.fio,
      description: data.volunteer_description || "",
    };
  }, [dataState]);
  useEffect(() => {
    if (id) {
      setIsLoadingState(true);
      VolunteersApi.get(Number(id)).then((res) => {
        if (res === null) {
          navigate(PAGES.PAGE_404);
        }
        res && setIsLoadingState(false);
        res && setDataState(res);
        res && res.another_images && setAnotherImagesState(JSON.parse(res.another_images));
      });
    }
  }, [id]);

  const destroyBack = () => {
    removeItem("backFromVolunteer");
  };
  const createNeedUsePrint = () => {
    saveItem("usePrintInVolunteers", true);
  };
  useEffect(
    () => () => {
      destroyBack();
    },
    []
  );

  const renderRedactButton = (data: TItem) =>
    isAdmin() ? (
      <Button
        className="loc_redactButton"
        theme={ButtonThemes.PRIMARY}
        size={isMobile ? ButtonSizes.GIANT : ButtonSizes.MEDIUM}
        onClick={() => {
          navigate(`${PAGES.ADMINISTRATION_VOLUNTEER_UPDATE}/${data.id}`);
        }}
      >
        Редактировать
      </Button>
    ) : null;

  const renderData = () =>
    dataState && (
      <div className="loc_data">
        <div className="loc_fio">{dataState.fio}</div>
        {dataState.is_published === 0 && <div className="loc_not_published">Не опубликовано</div>}

        <div className="loc_parameters">
          {dataState.birthdate && (
            <div className="loc_birthdate">
              День рождения: <span>{getDateYMFriendly(dataState.birthdate)}</span>
            </div>
          )}

          {dataState.phone && (
            <div className="loc_phone">
              <img alt="." src={PhoneImage} />
              {dataState.phone}
            </div>
          )}

          {dataState.vk_link && (
            <div className="loc_vkLink">
              <Link target="_blank" to={dataState.vk_link} className="link_3">
                <img src={VkLogo} alt="." title="Страница в ВК" /> Страница в ВК
              </Link>
            </div>
          )}
          {dataState.ok_link && (
            <div className="loc_okLink">
              <Link target="_blank" to={dataState.ok_link} className="link_3">
                <img src={OkLogo} alt="." title="Страница в Одноклассниках" /> Страница в
                OK
              </Link>
            </div>
          )}
          {dataState.inst_link && (
            <div className="loc_instLink">
              <Link target="_blank" to={dataState.inst_link} className="link_3">
                <img src={InstLogo} alt="." title="Страница в Instagram" /> Страница в Instagram
              </Link>
            </div>
          )}
        </div>
      </div>
    );

  return (
    <>
      {metatags && (
        <Helmet>
          <title>{metatags.title}</title>
          <meta name="description" content={metatags.description} />
        </Helmet>
      )}
      <div className="page-volunteer">
        {!!dataState && (
          <>
            <BreadCrumbs
              breadCrumbs={[
                {
                  name: "Наши волонтеры",
                  link: PAGES.VOLUNTEERS,
                  onClick: hasBack ? createNeedUsePrint : undefined,
                },
              ]}
              title={dataState.fio}
              back={
                hasBack
                  ? {
                      link: PAGES.VOLUNTEERS,
                      onClick: createNeedUsePrint,
                    }
                  : undefined
              }
              showTitle={false}
            />
            {/* <VolunteersList currentId={Number(id)} /> */}

            <div className="loc_contentWrapper">
              {isLoadingState && <div className="loc_loader" />}
              <div className="loc_topWrapper">
                <div className="loc_avatar">
                  <img alt="not found" src={getMainImageUrl(dataState, SIZES_MAIN.SQUARE)} />
                </div>
                {isMobile === true && renderData()}
                <div className="loc_right">
                  {isMobile === false && renderData()}
                  {renderRedactButton(dataState)}

                  <div
                    className="loc_description"
                    dangerouslySetInnerHTML={{ __html: textToClient(dataState.description) }}
                  />
                </div>
              </div>

              <div className="loc_bottomWrapper">
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

                {dataState.video1 && !isLoadingState && (
                  <video key={`video1${id}`} className="loc_video" controls>
                    <source
                      key={`video1${id}`}
                      src={getVideoUrl(dataState, dataState.video1)}
                      type={getVideoType(dataState.video1)}
                    />
                  </video>
                )}
                {dataState.video2 && !isLoadingState && (
                  <video key={`video2${id}`} className="loc_video" controls>
                    <source
                      key={`video2${id}`}
                      src={getVideoUrl(dataState, dataState.video2)}
                      type={getVideoType(dataState.video2)}
                    />
                  </video>
                )}
                {dataState.video3 && !isLoadingState && (
                  <video key={`video3${id}`} className="loc_video" controls>
                    <source
                      key={`video3${id}`}
                      src={getVideoUrl(dataState, dataState.video3)}
                      type={getVideoType(dataState.video3)}
                    />
                  </video>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Volunteer;
