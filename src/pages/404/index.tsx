/*
  import Page404 from 'pages/404'
  Страница 404
 */
import React from "react";
import { Helmet } from "react-helmet";
import Image from "./icons/image.jpg";
import "./style.scss";

const Page404: React.FC = () => (
  <>
    <Helmet>
      <title>404</title>
      <meta name="description" content="Страница не найдена" />
    </Helmet>
    <div className="page-404">
      <img className="loc_image" alt="загружаю" src={Image} />
      <div className="loc_404">
        <strong>404</strong>
      </div>
      <div className="loc_text">
        <div className="loc_1">Страница не найдена</div>
        <div className="loc_2">Возможно, её удалили или она не существовала вовсе :(</div>
      </div>
    </div>
  </>
);

export default Page404;
