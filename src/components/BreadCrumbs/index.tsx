/*
  import BreadCrumbs from 'components/BreadCrumbs'
 */

import React from "react";

import "./style.scss";
import { useNavigate } from "react-router-dom";
import PAGES from "routing/routes";

type TProps = {
  breadCrumbs?: { name: string; link: string }[];
  title: string;
};
const BreadCrumbs: React.FC<TProps> = (props) => {
  const { breadCrumbs, title } = props;
  const navigate = useNavigate();
  return (
    <div className="component-breadCrumbs">
      <div
        className="loc_toMain"
        onClick={() => {
          navigate(`${PAGES.MAIN}`);
        }}
      >
        Главная
      </div>
      <div className="loc_delimiter">/</div>
      {!!breadCrumbs &&
        breadCrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className="loc_breadCrumb"
              onClick={() => {
                navigate(item.link);
              }}
            >
              {item.name}
            </div>
            <div className="loc_delimiter">/</div>
          </React.Fragment>
        ))}
      <h2 className="loc_title">{title}</h2>
    </div>
  );
};

export default BreadCrumbs;
