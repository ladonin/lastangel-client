/*
  import InfoBlock from 'pages/home/_components/InfoBlock'
  Компонент "Инфоблок" для домашней страницы. Цифры - кто в приюте и кто уже обрел дом.
 */
import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router-dom";
import PAGES from "routing/routes";
import { AnimalsApi } from "api/animals";
import { TGetCountOutput } from "api/types/animals";
import { loadItem, saveItem } from "utils/localStorage";
import { ANIMALS_STATUS } from "constants/animals";
import OurPetsIcon from "icons/ourPetsIcon.png";
import PetsAtHomeIcon from "icons/petsAtHome.png";
import "./style.scss";

const InfoBlock = () => {
  const isMobile = loadItem("isMobile");
  const navigate = useNavigate();

  const [dataState, setDataState] = useState<TGetCountOutput | null>(null);

  useEffect(() => {
    AnimalsApi.getCount().then((res) => {
      setDataState(res);
    });
  }, []);

  return (
    <div className="page-home_infoBlock">
      <div
        className="loc_ourPets"
        onClick={() => {
          saveItem("pets_filter", { ...loadItem("pets_filter"), status: undefined });
          navigate(PAGES.PETS);
        }}
      >
        <img alt="загружаю" src={OurPetsIcon} />{" "}
        <div className="loc_right">
          <div className="loc_text">Сейчас {isMobile === false && <br />}в приюте</div>
          <div className="loc_value">{dataState?.at_shelter ? dataState.at_shelter : "-"}</div>
        </div>
      </div>
      <div
        className="loc_atHome"
        onClick={() => {
          saveItem("pets_filter", { status: ANIMALS_STATUS.AT_HOME });
          navigate(PAGES.PETS);
        }}
      >
        <img alt="загружаю" src={PetsAtHomeIcon} />{" "}
        <div className="loc_right">
          <div className="loc_text">
            Обрели {isMobile === false && <br />}
            свой дом
          </div>
          <div className="loc_value">{dataState?.at_home ? dataState.at_home : "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoBlock;
