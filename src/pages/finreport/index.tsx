import React from "react";
import BreadCrumbs from "components/BreadCrumbs";
import List from "./_components/List";
import { loadItem } from "utils/localStorage";
import "./style.scss";
const Finreport: React.FC = () => (
  <div className="page-finreport">
    <BreadCrumbs title="Финансовая отчетность" />
    <List />
  </div>
);

export default Finreport;
