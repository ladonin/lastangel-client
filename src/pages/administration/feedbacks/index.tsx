/*
  import Filter from 'pages/administration/feedbacks'
  Страница просмотра/управления письмами от клиентов. Админка.
 */
import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import cn from "classnames";
import { getDateString } from "helpers/common";
import { FeedbacksApi } from "api/feedbacks";
import { TGetListRequest, TItem } from "api/types/feedbacks";
import { loadItem } from "utils/localStorage";
import NotFound from "components/NotFound";
import { Button, ButtonSizes, ButtonThemes } from "components/Button";
import Modal from "components/Modal";
import LoaderIcon from "components/LoaderIcon";
import InfiniteScroll from "components/InfiniteScroll";
import Filter, { TFilterParams } from "./_components/Filter";
import "./style.scss";

const PAGESIZE = 20;

const Feedbacks: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const { checkMail } = useOutletContext<any>();
  const [pageState, setPageState] = useState<number>(1);

  const [listState, setListState] = useState<TItem[] | null>(null);
  const filterRef = useRef<TFilterParams>({});

  const loadingStatusRef = useRef({ isLoading: false, isOff: false });

  const getData = (params?: TGetListRequest) => {
    loadingStatusRef.current.isLoading = true;
    FeedbacksApi.getList({ ...filterRef.current, ...params }).then((res) => {
      setListState((prev) => (prev === null || pageState === 1 ? res : [...prev, ...res]));

      loadingStatusRef.current.isLoading = false;
      if (!res.length) {
        loadingStatusRef.current.isOff = true;
      }
    });
  };

  const changeFilter = (filter: TFilterParams) => {
    loadingStatusRef.current.isOff = false;
    filterRef.current = {
      ...filter,
    };

    if (pageState === 1) {
      getData({ offset: 0, limit: PAGESIZE });
    } else {
      setPageState(1);
    }
  };

  const markAsViewedHandler = (id: number) => {
    FeedbacksApi.setIsViewed(id).then(() => {
      setListState((curr) =>
        curr ? curr.map((item) => (item.id === id ? { ...item, is_new: 0 } : item)) : curr
      );
      checkMail();
    });
  };

  const markAsNewHandler = (id: number) => {
    FeedbacksApi.setIsNew(id).then(() => {
      setListState((curr) =>
        curr ? curr.map((item) => (item.id === id ? { ...item, is_new: 1 } : item)) : curr
      );
      checkMail();
    });
  };

  const [modalDeleteIsOpenState, setModalDeleteIsOpenState] = useState<false | number>(false);

  const closeModalDelete = () => {
    setModalDeleteIsOpenState(false);
  };

  const openModalDelete = (id: number) => {
    setModalDeleteIsOpenState(id);
  };

  const removeHandler = () => {
    if (modalDeleteIsOpenState) {
      const id: number = modalDeleteIsOpenState;
      modalDeleteIsOpenState &&
        FeedbacksApi.remove(id).then(() => {
          setListState((curr) => (curr ? curr.filter((item) => item.id !== id) : curr));
          checkMail();
          closeModalDelete();
        });
    }
  };

  const renderContent = (data: TItem) => (
    <>
      <div className="loc_created">
        <b>№{data.id}</b> от {getDateString(data.created)}
      </div>

      <div className="loc_data">
        {!!data.fio && <div className="loc_name">{data.fio}</div>}
        <div className="loc_fuck_flex" />
        {!!data.phone && <div className="loc_phone">{data.phone}</div>}
        {!!data.email && <div className="loc_email">{data.email}</div>}
      </div>

      <div className="loc_text">{data.text}</div>

      <div className="loc_buttons">
        {data.is_new === 1 && (
          <Button
            className="loc_button"
            theme={ButtonThemes.SUCCESS}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.SMALL}
            onClick={() => {
              markAsViewedHandler(data.id);
            }}
          >
            Пометить как прочитанное
          </Button>
        )}
        {data.is_new === 0 && (
          <Button
            className="loc_button"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.SMALL}
            onClick={() => {
              markAsNewHandler(data.id);
            }}
          >
            Пометить как непрочитанное
          </Button>
        )}

        <Button
          className="loc_deleteButton"
          theme={ButtonThemes.DELETE_ICON}
          tooltip="Удалить"
          size={isMobile ? ButtonSizes.GIANT : ButtonSizes.SMALL}
          onClick={() => {
            openModalDelete(data.id);
          }}
        />
      </div>
    </>
  );

  const onReachBottomHandler = () => {
    !loadingStatusRef.current.isOff &&
      !loadingStatusRef.current.isLoading &&
      setPageState((prev) => prev + 1);
  };

  useEffect(() => {
    getData({ offset: (pageState - 1) * PAGESIZE, limit: PAGESIZE });
  }, [pageState]);

  return (
    <div className="page-administration_feedbacks">
      <h1>Почта</h1>
      <Filter filter={filterRef.current} onChange={changeFilter} />
      <div className="loc_list">
        {listState === null && <LoaderIcon />}
        {listState &&
          listState.map((item, index) => (
            <div
              key={index}
              className={cn("loc_item", `loc--status_${item.is_new ? "new" : "viewed"}`)}
            >
              {renderContent(item)}
            </div>
          ))}
        <InfiniteScroll onReachBottom={onReachBottomHandler} amendment={100} />
        {listState && !listState.length && <NotFound />}
      </div>

      <Modal
        isOpen={!!modalDeleteIsOpenState}
        title="Удаление сообщения"
        onClose={closeModalDelete}
        portalClassName="page-administration_feedbacks_deleteModal"
      >
        Вы уверены, что хотите удалить сообщение?
        <div className="loc_buttons">
          <Button
            className="loc_deleteButton"
            theme={ButtonThemes.DANGER}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
            onClick={removeHandler}
          >
            Удалить
          </Button>
          <Button
            className="loc_cancelButton"
            theme={ButtonThemes.PRIMARY}
            size={isMobile ? ButtonSizes.GIANT : ButtonSizes.LARGE}
            onClick={closeModalDelete}
          >
            Отмена
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Feedbacks;
