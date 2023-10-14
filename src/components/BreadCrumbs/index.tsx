/*
  import BreadCrumbs from 'components/BreadCrumbs'
 */

import React from "react";

import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { loadItem } from "utils/localStorage";
import PAGES from "routing/routes";
import ArrowRight from "../../icons/arrowRight.svg";

type TProps = {
  breadCrumbs?: { name: string; link: string; onClick?: () => void }[];
  title: string;
  back?: { link: string; onClick: () => void };
};
const BreadCrumbs: React.FC<TProps> = (props) => {
  const { breadCrumbs, title, back } = props;
  const navigate = useNavigate();
  return (
    <div className="component-breadCrumbs">
      <Link to={PAGES.MAIN} className="loc_toMain">
        Главная
      </Link>
      <div className="loc_delimiter">/</div>
      {!!breadCrumbs &&
        breadCrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <Link
              to={item.link}
              onClick={() => item.onClick && item.onClick()}
              className="loc_breadCrumb"
            >
              {item.name}
            </Link>
            <div className="loc_delimiter">/</div>
          </React.Fragment>
        ))}
      <h3 className="loc_title">{title}</h3>
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
