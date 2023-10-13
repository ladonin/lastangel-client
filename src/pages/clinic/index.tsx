import React from "react";
// const OtherComponent = React.lazy(() => import('components/header'));

import "./style.scss";
import { Helmet } from "react-helmet";
import BreadCrumbs from "components/BreadCrumbs";
import Slider from "./_components/Slider";
import { Link } from "react-router-dom";
import VkLogo from "../../icons/vk_logo.png";

const Clinic: React.FC = () => (
  <>
    <Helmet>
      <title>Клиника приюта "Последний ангел"</title>
      <meta name="description" content='Клиника приюта "Последний ангел"' />
    </Helmet>
    <div className="page-clinic">
      <BreadCrumbs title="Наша клиника" />

      <div className="loc_content">Ветеринарная клиника "Доберман"</div>
      <div className="loc_content">
        <b>Номер телефона:</b> +7 (962) 089-90-94
      </div>
      <div className="loc_content">
        <b>Адрес:</b> г. Александров, улица Первомайская, 68
      </div>
      <div className="loc_content">
        <b>Сотрудники клиники:</b> <Link target="_blank" to='https://vk.com/dobermann1989' className="link_3">Алена Вакулина</Link>, <Link target="_blank" to='https://vk.com/imperialchoice' className="link_3">Оксана Халтурина</Link>
      </div>
      <div className="loc_content loc_vkGroup">
        <Link to='https://vk.com/vetclinicdoberman' className="link_3">
          <img alt="." src={VkLogo} /> Адрес клиники вконтакте
        </Link>
      </div> 
<br/>
      <Slider />
    </div>
  </>
);

export default Clinic;
