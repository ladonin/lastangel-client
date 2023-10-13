/*
  import VkGroup from 'pages/home/_components/VkGroup'
 */

import React, { useEffect, useMemo } from "react";

import "react-tabs/style/react-tabs.css";

import "./style.scss";
import { loadItem } from "utils/localStorage";

const VkGroup = () => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    if (isMobile === false) {
      setTimeout(() => {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        VK.Widgets.Group(
          "vk_groups",
          { mode: 0, width: "auto", height: isMobile ? "300" : "400" },
          190912136
        );
      }, 0);
    }
  }, []);
  return isMobile ? null : (
    <div className="page-home_vkGroup">
      <div className="loc_title">Наша группа Вконтакте</div>
      <div id="vk_groups" />
    </div>
  );
};

export default VkGroup;
