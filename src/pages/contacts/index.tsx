import React from "react";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";
import PhoneImage from "icons/phone.png";
import VkLogo from "icons/vk_logo.png";
import OkLogo from "icons/ok_logo.png";
import InstLogo from "icons/inst_logo.png";

import OkGroup from "components/socNetsGroup/OkGroup";
import VkGroup from "components/socNetsGroup/VkGroup";
import BreadCrumbs from "components/BreadCrumbs";
import Form from "./_components/Form";

const Contacts: React.FC = () => (
  <div className="page-contacts">
    <div className="loc_left">
      <BreadCrumbs title="Контакты" />
      <div className="loc_phone">
        <img alt="nophoto" src={PhoneImage} />
        <div className="loc_value">8 (996) 442-24-16</div>
        <div className="loc_fio">Варенова Мария Павловна</div>
      </div>
      <div className="loc_content_1">
        Приют находится в Александровском р-не, Владимирской обл.
        <br />
        Если вы хотите посетить наш приют, в частности, привезти питомцам корм и/или любую другую помощь, познакомиться с ними,
        просим вас звонить по вышеуказанному телефону - вам сообщат точный адрес и как лучше добраться.
      </div>

      <div className="loc_vk">
        <img alt="nophoto" src={VkLogo} />
        <div className="loc_link" onClick={() => window.open("https://vk.com/club190912136", "_blank")}>
          Мы во вконтакте
        </div>
        <VkGroup height="220" />
      </div>

      <div className="loc_ok">
        <img alt="nophoto" src={OkLogo} />
        <div className="loc_link" onClick={() => window.open("https://m.ok.ru/profile/565776551254", "_blank")}>
          Мы в одноклассниках
        </div>
        <OkGroup height="220" width="396" />
      </div>

      <div className="loc_inst">
        <img alt="nophoto" src={InstLogo} />
        <div className="loc_link" onClick={() => window.open("https://www.instagram.com/posledniyangel", "_blank")}>
          Мы в инстаграм
        </div>
      </div>
    </div>
    <div className="loc_right">
      <Form />
    </div>
  </div>
);

export default Contacts;
