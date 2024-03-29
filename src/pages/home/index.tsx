/*
  import Home from 'pages/home'
  Главная (домашняя) страница
 */
import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet";

import { loadItem } from "utils/localStorage";
import VkGroup from "pages/home/_components/VkGroup";
import InfoBlock from "pages/home/_components/InfoBlock";
import MainPhotoalbum from "./_components/MainPhotoalbum";
import OurPets from "./_components/OurPets";
import Collections from "./_components/Collections";
import News from "./_components/News";
import Stories from "./_components/Stories";
import Help from "./_components/Help";
import "./style.scss";

const Home: React.FC = () => {
  const isMobile = loadItem("isMobile");
  const { getMetatags } = useOutletContext<any>();

  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.main_title || "",
      description: data.main_description || "",
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-home">
        <div className="loc_top">
          <div className="loc_left">
            {isMobile === true && <InfoBlock />}
            <MainPhotoalbum />
            <div className="loc_textMain">
              У животных есть Душа. Её можно увидеть в их глазах.
              <br />
              <br />
              С давних времен собаки и кошки были приручены и одомашнены человеком. К сожалению, они
              не всегда способны сами позаботиться о себе и нуждаются в постоянном человеческом
              уходе и надзоре. Но некоторых животных люди бросают, забывая о их преданности и как
              здорово им было вместе. Вот так животные становятся бездомными. Они попадают в беду.
              Многие из них становятся инвалидами. Грязные и несчастные, никому не нужные они
              попадают в приют.
              <br />
              <br />
              Попадая в приют, многие находят свою первую или вторую семью. Но многие из них
              остаются в приюте навсегда:
              <br />
              <ul>
                <li>дикие</li>
                <li>старики</li>
                <li>инвалиды</li>
              </ul>
              Пристроенных животных в разы меньше, чем тех, которые поступают в приют. Каждый из Вас
              может поучавствовать в жизни приюта:
              <br />
              <ul>
                <li>забрать питомца домой</li>
                <li>стать куратором</li>
                <li>стать волонтером</li>
              </ul>
              и подарить им радость, любовь и заботу.
              <br />
              <br />
              <b>Животные приюта очень нуждаются в Вашей помощи.</b>
            </div>
            <Help />
          </div>

          <div className="loc_right">
            {!isMobile && <InfoBlock />}
            <Collections />

            <News />
            <VkGroup />
          </div>
        </div>
        <div className="clear" />

        <div className="loc_bottom">
          <OurPets />
          <Stories />
        </div>
      </div>
    </>
  );
};

export default Home;
