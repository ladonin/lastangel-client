import React from "react";
import BreadCrumbs from "components/BreadCrumbs";
import List from "./_components/List";
import "./style.scss";

const Stories: React.FC = () => (
  <div className="page-stories">
    <BreadCrumbs title="Истории" />
    <List />
  </div>
);

export default Stories;
