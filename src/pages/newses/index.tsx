import React from "react";
import BreadCrumbs from "components/BreadCrumbs";
import List from "./_components/List";
import { loadItem } from "utils/localStorage";
import "./style.scss";
const Newses: React.FC = () => (
  <div className="page-newses">
    <BreadCrumbs title="Новости" />
    <List />
  </div>
);

export default Newses;
