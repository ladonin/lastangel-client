/*
  import VkGroup from 'pages/home/_components/VkGroup'
 */
import React, { useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import { loadItem } from "utils/localStorage";
import "./style.scss";

const VkGroup = () => {
  const isMobile = loadItem("isMobile");

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
