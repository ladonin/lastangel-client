/*
  import VkGroup from 'pages/home/_components/VkGroup'
 */

import React, { useEffect, useState } from "react";

import "react-tabs/style/react-tabs.css";
import { isMobile } from "react-device-detect";

import "./style.scss";

const VkGroup = () => {
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  useEffect(() => {
    if (isMobileState === false) {
      setTimeout(() => {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        VK.Widgets.Group("vk_groups", { mode: 0, width: "auto", height: isMobileState ? "300" : "400" }, 190912136);
      }, 0);
    }
  }, [isMobileState]);
  return isMobileState ? null : (
    <div className="page-home_vkGroup">
      <div className="loc_title">Наша группа Вконтакте</div>
      <div id="vk_groups" />
    </div>
  );
};

export default VkGroup;
