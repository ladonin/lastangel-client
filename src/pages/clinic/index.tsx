import React, { useEffect, useState } from "react";
// const OtherComponent = React.lazy(() => import('components/header'));
import "./style.scss";
import { isMobile } from "react-device-detect";
import BreadCrumbs from "components/BreadCrumbs";
import Slider from "./_components/Slider";

const Clinic: React.FC = () => (
  <div className="page-clinic">
    <BreadCrumbs title="Наша клиника" />

    <Slider />
  </div>
);

export default Clinic;
