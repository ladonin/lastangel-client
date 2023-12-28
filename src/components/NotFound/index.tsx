/* 
  import NotFound from 'components/NotFound'
 */
import React from "react";
import "react-tooltip/dist/react-tooltip.css";
import icon from "./icon.png";
import { loadItem } from "utils/localStorage";
import "./style.scss";
const NotFound = () => (
  <div className="component-notFound">
    <img src={icon} alt="Ничего не найдено" />
    <div className="loc_descr">Ничего не найдено</div>
  </div>
);

export default NotFound;
