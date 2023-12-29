/*
  import BreadCrumbs from 'components/BreadCrumbs'
  Хлебные крошки
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import PAGES from "routing/routes";
import ArrowRight from "icons/arrowRight.svg";
import "./style.scss";

type TProps = {
  breadCrumbs?: { name: string; link: string; onClick?: () => void }[];
  title: string;
  back?: { link: string; onClick: () => void };
  showTitle?: boolean;
};

const BreadCrumbs: React.FC<TProps> = (props) => {
  const { breadCrumbs, title, back, showTitle = true } = props;
  const navigate = useNavigate();

  return (
    <div className="component-breadCrumbs">
      <div className="loc_links">
        <Link to={PAGES.MAIN} className="loc_toMain">
          Главная
        </Link>

        {!!breadCrumbs &&
          breadCrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <div className="loc_delimiter">/</div>
              <Link
                to={item.link}
                onClick={() => item.onClick && item.onClick()}
                className="loc_breadCrumb"
              >
                {item.name}
              </Link>
            </React.Fragment>
          ))}

        {showTitle && (
          <>
            <div className="loc_delimiter">/</div>
            <h3 className="loc_title">{title}</h3>
          </>
        )}
      </div>
      {back && (
        <div
          className="loc_back"
          onClick={() => {
            back.onClick();
            navigate(back.link);
          }}
        >
          <ArrowRight /> Назад
        </div>
      )}
    </div>
  );
};

export default BreadCrumbs;
