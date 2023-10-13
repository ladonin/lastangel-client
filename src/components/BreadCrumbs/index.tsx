/*
  import BreadCrumbs from 'components/BreadCrumbs'
 */

import React from "react";

import "./style.scss";import { loadItem } from "utils/localStorage";import { Link, useNavigate } from "react-router-dom";
import PAGES from "routing/routes";
import ArrowRight from "../../icons/arrowRight.svg";

type TProps = {
  breadCrumbs?: { name: string; link: string }[];
  title: string;
};
const BreadCrumbs: React.FC<TProps> = (props) => {
  const { breadCrumbs, title } = props;
  return (
    <div className="component-breadCrumbs">
      <Link to={PAGES.MAIN} className="loc_toMain">
        Главная
      </Link>
      <div className="loc_delimiter">/</div>
      {!!breadCrumbs &&
        breadCrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <Link to={item.link} className="loc_breadCrumb">
              {item.name}
            </Link>
            <div className="loc_delimiter">/</div>
          </React.Fragment>
        ))}
      <h3 className="loc_title">{title}</h3>
    </div>
  );
};

export default BreadCrumbs;
