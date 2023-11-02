import React from "react";
// const OtherComponent = React.lazy(() => import('components/header'));

import { Link } from "react-router-dom";
import PhoneImage from "icons/phone.png";
import VkLogo from "icons/vk_logo.png";
import OkLogo from "icons/ok_logo.png";
import InstLogo from "icons/inst_logo.png";
import VkGroup from "components/socNetsGroup/VkGroup";
import BreadCrumbs from "components/BreadCrumbs";
import Form from "./_components/Form";
import "./style.scss";
import { MAIN_CARD_OWNER, MAIN_PHONE } from "../../constants/donations";

const Contacts: React.FC = () => (
  <div className="page-contacts">
    <div className="loc_left">
      <BreadCrumbs title="Контакты" />
      <div className="loc_phone">
        <img alt="." src={PhoneImage} />
        <div className="loc_value">{MAIN_PHONE}</div>
        <div className="loc_fio">
          {MAIN_CARD_OWNER}
        </div>
      </div>
      <div className="loc_content_1">
        Приют находится в Александровском р-не, Владимирской обл.
        <br />
        Если Вы хотите посетить наш приют, в частности, привезти питомцам корм и/или любую другую
        помощь, познакомиться с ними, просим Вас звонить по вышеуказанному телефону - Вам сообщат
        точный адрес и как лучше добраться.
      </div>

      <div className="loc_vk">
        <div
          className="loc_link"
          onClick={() => window.open("https://vk.com/club190912136", "_blank")}
        >
          <img alt="." src={VkLogo} /> Мы во вконтакте
        </div>
        <VkGroup height="220" />
      </div>

      <div className="loc_ok">
        <div
          className="loc_link"
          onClick={() => window.open("https://m.ok.ru/profile/565776551254", "_blank")}
        >
          <img alt="." src={OkLogo} /> Мы в одноклассниках
        </div>
      </div>

      <div className="loc_inst">
        <div
          className="loc_link"
          onClick={() => window.open("https://www.instagram.com/posledniyangel", "_blank")}
        >
          <img alt="." src={InstLogo} /> Мы в инстаграм
        </div>
      </div>
    </div>
    <div className="loc_right">
      <Form />
    </div>
  </div>
);

export default Contacts;
